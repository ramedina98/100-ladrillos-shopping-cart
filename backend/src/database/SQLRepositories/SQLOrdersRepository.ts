import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import AbstractRepository from '../AbstractRepository.js';
import Order from '../../core/Order.js';
import OrderSerializer from '../serializers/OrderSerializer.js';
import {
  CouldNotFetchOrder,
  CouldNotSaveOrder,
  OrderNotFound
} from '../../core/database/errors/index.js';
import { Database } from '../../core/database/Database.js';
import type { OrdersRepository } from '../../core/database/index.js';

interface OrderItem {
  id: string;
  brickId: string;
  orderId: string;
  finalPrice: Decimal;
}

class SQLOrdersRepository extends AbstractRepository implements OrdersRepository {
  readonly database: Database;

  private client: PrismaClient;

  constructor(database: Database, client: PrismaClient) {
    super();

    this.database = database;
    this.client = client;
  }

  async findById(orderId: string): Promise<Order> {
    try {
      const order = await this.client.order.findUnique({
        where: { id: orderId },
        include: { items: true, user: true }
      });

      if (!order) {
        throw new OrderNotFound(orderId);
      }

      return OrderSerializer.deserialize({
        ...order,
        items: await this.hydrateItemsWithBricks(order.items)
      });
    } catch (error) {
      if (error instanceof OrderNotFound) {
        throw error;
      }

      throw new CouldNotFetchOrder({ cause: error });
    }
  }

  async save(order: Order): Promise<Order> {
    try {
      const id = order.id || this.generateUUID();

      const itemsData = order.getItems().map(item => ({
        id: item.id,
        brickId: item.brick.id,
        finalPrice: item.finalPrice
      }));

      const savedOrder = await this.client.order.upsert({
        where: { id },
        update: {
          status: order.getStatus(),
          confirmedAt: order.getConfirmedAt(),
          completedAt: order.getCompletedAt(),
          termsAcceptedAt: order.getTermsAcceptedAt(),
          items: {
            deleteMany: {},
            create: itemsData
          }
        },
        create: {
          id,
          userId: order.user.id,
          status: order.getStatus(),
          totalAmount: order.totalAmount,
          confirmedAt: order.getConfirmedAt(),
          completedAt: order.getCompletedAt(),
          termsAcceptedAt: order.getTermsAcceptedAt(),
          createdAt: order.createdAt,
          items: { create: itemsData }
        },
        include: {
          items: true, user: true
        }
      });

      return OrderSerializer.deserialize({
        ...savedOrder,
        items: await this.hydrateItemsWithBricks(savedOrder.items)
      });
    } catch (error) {
      throw new CouldNotSaveOrder({ cause: error });
    }
  }

  private async hydrateItemsWithBricks(items: OrderItem[]) {
    return Promise.all(
      items.map(async (item) => ({
        ...item,
        brick: await this.database.bricks.findById(item.brickId)
      }))
    );
  }
}

export default SQLOrdersRepository;
