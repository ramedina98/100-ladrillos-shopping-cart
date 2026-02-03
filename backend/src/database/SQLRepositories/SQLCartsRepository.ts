import { CartStatus, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import AbstractRepository from '../AbstractRepository.js';
import Cart from '../../core/Cart.js';
import CartSerializer from '../serializers/CartSerializer.js';
import {
  CouldNotFetchCart,
  CartNotFound,
  CouldNotCreateCart,
  CouldNotSaveCart
} from '../../core/database/errors/index.js';
import { Database } from '../../core/database/Database.js';
import type { CartsRepository } from '../../core/database/index.js';

interface CartItem {
  id: string;
  cartId: string;
  brickId: string;
  priceAtAddTime: Decimal;
  addedAt: Date;
}

class SQLCartsRepository extends AbstractRepository implements CartsRepository {
  readonly database: Database;

  private client: PrismaClient;

  constructor(database: Database, client: PrismaClient) {
    super();

    this.database = database;
    this.client = client;
  }

  async createActiveCartForUser(userId: string): Promise<Cart> {
    try {
      const cart = await this.client.cart.create({
        data: { userId, status: CartStatus.ACTIVE },
        include: { user: true }
      });

      return CartSerializer.deserialize({ ...cart, items: [] });
    } catch (error) {
      throw new CouldNotCreateCart({ cause: error });
    }
  }

  async findActiveCartByUser(userId: string): Promise<Cart> {
    try {
      const cart = await this.client.cart.findFirst({
        where: {
          userId,
          status: CartStatus.ACTIVE
        },
        include: {
          items: true, user: true
        }
      });

      if (!cart) {
        throw new CartNotFound(userId);
      }

      return CartSerializer.deserialize({
        ...cart,
        items: await this.hydrateItemsWithBricks(cart.items)
      });
    } catch (error) {
      if (error instanceof CartNotFound) {
        throw error;
      }

      throw new CouldNotFetchCart({ cause: error });
    }
  }

  async save(cart: Cart): Promise<void> {
    try {
      await this.client.$transaction(async (tx) => {
        await tx.cart.update({
          where: { id: cart.id },
          data: {
            status: cart.getStatus(),
            updatedAt: new Date()
          }
        });

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id }
        });

        if (cart.getItems().length > 0) {
          await tx.cartItem.createMany({
            data: cart.getItems().map(item => ({
              cartId: cart.id,
              brickId: item.brick.id,
              priceAtAddTime: item.priceAtAddTime
            }))
          });
        }
      });
    } catch (error) {
      throw new CouldNotSaveCart({ cause: error });
    }
  }

  private async hydrateItemsWithBricks(items: CartItem[]) {
    return Promise.all(
      items.map(async (item) => ({
        ...item,
        brick: await this.database.bricks.findById(item.brickId)
      }))
    );
  }
}

export default SQLCartsRepository;
