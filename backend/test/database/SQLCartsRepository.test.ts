import { beforeAll, beforeEach, afterAll, describe, expect, it } from 'vitest';
import {
  CartStatus,
  BrickStatus,
  FundingStatus,
  PropertyType,
  RentalDistributionFrequency
} from '@prisma/client';

import prisma from '../../src/infrastructure/prisma/prismaClient.js';
import SQLDatabase from '../../src/database/SQLRepositories/SQLDatabase.js';
import SQLCartsRepository from '../../src/database/SQLRepositories/SQLCartsRepository.js';
import {
  CartNotFound,
  CouldNotSaveCart
} from '../../src/core/database/errors/index.js';

describe('SQLCartsRepository', () => {
  let database: SQLDatabase;
  let cartsRepo: SQLCartsRepository;

  let userId: string;
  let brickId: string;

  beforeAll(async () => {
    database = new SQLDatabase(prisma);
    cartsRepo = new SQLCartsRepository(database, prisma);
  });

  beforeEach(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.brick.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    const user = await database.users.create({
      firstName: 'John',
      lastName: 'Doe',
      email: `john.${Date.now()}@test.com`
    });

    userId = user.id;

    const property = await database.properties.create({
      name: 'Prop',
      description: 'Desc',
      street: 'Street',
      externalNumber: '1',
      neighborhood: 'Hood',
      city: 'City',
      state: 'State',
      country: 'Country',
      propertyType: PropertyType.COMMERCIAL,
      totalBricks: 10,
      brickBasePrice: 100,
      currency: 'USD',
      fundingStatus: FundingStatus.FUNDED,
      annualReturnTarget: 5,
      rentalYield: 3,
      appreciationTarget: 2,
      hasRentalPool: true,
      rentalDistributionFrequency: RentalDistributionFrequency.MONTHLY,
      estimatedDeliveryDate: new Date()
    });

    const brick = await database.bricks.save({
      propertyId: property.id,
      status: BrickStatus.AVAILABLE,
      ownershipPercentage: 0.1,
      currentOwnerId: user.id,
      accumulatedEarnings: 0,
      price: 100,
      version: 1
    });

    brickId = brick.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create an ACTIVE cart for user', async () => {
    const cart = await cartsRepo.createActiveCartForUser(userId);

    expect(cart.getStatus()).toBe('ACTIVE');

    const db = await prisma.cart.findFirst({ where: { userId } });
    expect(db).not.toBeNull();
  });

  it('should fetche active cart and hydrates items with bricks', async () => {
    const dbCart = await prisma.cart.create({
      data: { userId, status: CartStatus.ACTIVE }
    });

    await prisma.cartItem.create({
      data: {
        cartId: dbCart.id,
        brickId,
        priceAtAddTime: 100
      }
    });

    const cart = await cartsRepo.findActiveCartByUser(userId);

    expect(cart.getItems().length).toBe(1);
    expect(cart.getItems()[0].brick.id).toBe(brickId);
  });

  it('should persist cart status and items correctly', async () => {
    const cart = await cartsRepo.createActiveCartForUser(userId);
    const brick = await database.bricks.findById(brickId);

    cart.addBrick(brick);
    cart.startCheckout();

    await cartsRepo.save(cart);

    const dbCart = await prisma.cart.findUnique({ where: { id: cart.id } });

    expect(dbCart?.status).toBe('CHECKOUT_STARTED');

    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id } });

    expect(items.length).toBe(1);
  });

  it('should throw CartNotFound when no cart exists', async () => {
    await expect(
      cartsRepo.findActiveCartByUser('non-existing')
    ).rejects.toBeInstanceOf(CartNotFound);
  });

  it('should throw CouldNotSaveCart when DB operation fails', async () => {
    const cart = await cartsRepo.createActiveCartForUser(userId);

    await prisma.cart.delete({ where: { id: cart.id } });
    await expect(cartsRepo.save(cart)).rejects.toBeInstanceOf(CouldNotSaveCart);
  });
});
