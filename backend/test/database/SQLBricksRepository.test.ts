import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import {
  BrickStatus,
  FundingStatus,
  PrismaClient,
  PropertyType,
  RentalDistributionFrequency
} from '@prisma/client';

import BrickSerializer from '../../src/database/serializers/BrickSerializer.js';
import SQLBricksRepository from '../../src/database/SQLRepositories/SQLBricksRepository.js';
import SQLDatabase from '../../src/database/SQLRepositories/SQLDatabase.js';
import {
  BrickNotFound,
  BrickVersionDoNotMatch,
  CouldNotSaveBrick
} from '../../src/core/database/errors/index.js';
import Brick from '../../src/core/Brick.js';
import Property from '../../src/core/Property.js';
import User from '../../src/core/User.js';

describe('SQLBricksRepository', () => {
  let bricksRepository: SQLBricksRepository;
  let database: SQLDatabase;
  let property: Property;
  let user: User;

  const prisma = new PrismaClient();
  beforeAll(async () => {
    database = new SQLDatabase(prisma);
  });

  beforeEach(async () => {
    await prisma.brick.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();

    property = await database.properties.create({
      name: 'Test Property',
      description: 'Nice property',
      street: 'Street 1',
      externalNumber: '123',
      neighborhood: 'Downtown',
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

    user = await database.users.create({
      firstName: 'John',
      lastName: 'Doe',
      email: `john.${Date.now()}@test.com`
    });

    bricksRepository = new SQLBricksRepository(database, prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('save()', () => {
    it('should throw CouldNotSaveBrick when prisma fails', async () => {
      await expect(
        bricksRepository.save({
          propertyId: property.id,
          status: 'AVAILABLE',
          ownershipPercentage: 10,
          accumulatedEarnings: 0,
          price: 100,
          version: 1
        })
      ).rejects.toBeInstanceOf(CouldNotSaveBrick);
    });
  });

  describe('saveWithVersion()', () => {
    it('should throw BrickNotFound', async () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: BrickStatus.RESERVED,
        ownershipPercentage: 0.03,
        accumulatedEarnings: 0.10,
        currentOwner: user,
        price: 120,
        version: 1
      });

      await expect(bricksRepository.saveWithVersion(brick)).rejects.toBeInstanceOf(BrickNotFound);
    });

    it('should throw BrickVersionDoNotMatch', async () => {
      await prisma.brick.create({
        data: {
          id: 'brick-123',
          propertyId: property.id,
          status: 'AVAILABLE',
          price: 100,
          ownershipPercentage: 0.10,
          accumulatedEarnings: 0,
          version: 2
        }
      });

      const brick = new Brick({
        id: 'brick-123',
        property,
        status: BrickStatus.RESERVED,
        ownershipPercentage: 0.03,
        accumulatedEarnings: 0.10,
        currentOwner: user,
        price: 120,
        version: 1
      });

      await expect(
        bricksRepository.saveWithVersion(brick)
      ).rejects.toBeInstanceOf(BrickVersionDoNotMatch);
    });
  });

  describe('findById()', () => {
    it('should return brick successfully', async () => {
      await prisma.brick.create({
        data: {
          id: 'brick-4',
          propertyId: property.id,
          currentOwnerId: user.id,
          status: 'AVAILABLE',
          price: 100,
          ownershipPercentage: 0.10,
          accumulatedEarnings: 0,
          version: 1
        }
      });

      const spy = vi.spyOn(BrickSerializer, 'deserialize');

      await bricksRepository.findById('brick-4');

      expect(spy).toHaveBeenCalled();
    });

    it('should throw BrickNotFound', async () => {
      await expect(
        bricksRepository.findById('none')
      ).rejects.toBeInstanceOf(BrickNotFound);
    });
  });
});
