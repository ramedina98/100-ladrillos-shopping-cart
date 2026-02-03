import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';

import Brick from '../../src/core/Brick.js';
import prisma from '../../src/infrastructure/prisma/prismaClient.js';
import SQLOrdersRepository from '../../src/database/SQLRepositories/SQLOrdersRepository.js';
import SQLDatabase from '../../src/database/SQLRepositories/SQLDatabase.js';
import Order from '../../src/core/Order.js';
import User from '../../src/core/User.js';
import { OrderNotFound } from '../../src/core/database/errors/index.js';

describe('SQLOrdersRepository', () => {
  let database: SQLDatabase;
  let ordersRepo: SQLOrdersRepository;
  let user: User;
  let brick: Brick;

  beforeEach(async () => {
    database = new SQLDatabase(prisma);
    ordersRepo = new SQLOrdersRepository(database, prisma);

    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.brick.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');

    const userDb = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test.user.${Date.now()}@example.com`
      }
    });

    user = new User({
      ...userDb,
      secondLastName: userDb.secondLastName ?? undefined
    });

    const propertyDb = await prisma.property.create({
      data: {
        name: 'Test Property',
        description: 'Property for testing',
        street: '123 Street',
        externalNumber: '1',
        neighborhood: 'Testhood',
        city: 'City',
        state: 'State',
        country: 'Country',
        propertyType: 'COMMERCIAL',
        totalBricks: 1,
        brickBasePrice: new Decimal(100),
        currency: 'USD',
        fundingStatus: 'FUNDED',
        annualReturnTarget: new Decimal(5),
        rentalYield: new Decimal(3),
        appreciationTarget: new Decimal(2),
        hasRentalPool: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    const brickDb = await prisma.brick.create({
      data: {
        propertyId: propertyDb.id,
        price: new Decimal(100),
        ownershipPercentage: new Decimal(1),
        currentOwnerId: user.id,
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    brick = await database.bricks.findById(brickDb.id);
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should save and retrieve an order', async () => {
    const order = new Order({
      id: 'order-123',
      user,
      status: 'PENDING',
      items: [
        {
          id: 'item-123',
          brick,
          orderId: '',
          finalPrice: Number(100)
        }
      ],
      totalAmount: 100,
      createdAt: new Date()
    });

    const savedOrder = await ordersRepo.save(order);

    expect(savedOrder).toBeInstanceOf(Order);
    expect(savedOrder.getItems().length).toBe(1);
    expect(savedOrder.getItems()[0].brick.id).toBe(brick.id);

    const fetchedOrder = await ordersRepo.findById(savedOrder.id!);
    expect(fetchedOrder.id).toBe(savedOrder.id);
    expect(fetchedOrder.getItems()[0].brick.id).toBe(brick.id);
  });

  it('should throw OrderNotFound if order does not exist', async () => {
    await expect(
      ordersRepo.findById('non-existent-id')
    ).rejects.toBeInstanceOf(OrderNotFound);
  });

  it('should handle multiple orders independently', async () => {
    const order1 = new Order({
      user,
      status: 'PENDING',
      items: [
        { id: '', brick, orderId: '', finalPrice: Number(100) }
      ],
      totalAmount: 100,
      createdAt: new Date()
    });

    const order2 = new Order({
      user,
      status: 'PENDING',
      items: [],
      totalAmount: 100,
      createdAt: new Date()
    });

    const saved1 = await ordersRepo.save(order1);
    const saved2 = await ordersRepo.save(order2);

    expect(saved1.id).not.toBe(saved2.id);
  });
});
