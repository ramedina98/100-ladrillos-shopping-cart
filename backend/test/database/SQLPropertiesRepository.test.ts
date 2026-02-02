import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  FundingStatus,
  PrismaClient,
  PropertyType,
  RentalDistributionFrequency
} from '@prisma/client';

import SQLPropertiesRepository from '../../src/database/SQLRepositories/SQLPropertiesRepository.js';
import Property from '../../src/core/Property.js';
import PropertySerializer from '../../src/database/serializers/PropertySerializer.js';
import SerializerError from '../../src/database/serializers/errors/SerializerError.js';
import {
  PropertyNotFound,
  PropertySerializationError
} from '../../src/core/database/errors/index.js';
import type { CreatePropertyData } from '../../src/core/database/PropertiesRepository.js';

describe('SQLPropertiesRepository', () => {
  let prisma: PrismaClient;
  let propertyData: CreatePropertyData;
  let propertiesRepository: SQLPropertiesRepository;

  beforeEach(async () => {
    prisma = new PrismaClient();
    propertiesRepository = new SQLPropertiesRepository(prisma);

    await prisma.property.deleteMany();

    propertyData = {
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
    };
  });

  afterEach(async () => {
    await prisma.$disconnect();

    vi.restoreAllMocks();
  });

  describe('create()', () => {
    it('should create a property successfully', async () => {
      const property = await propertiesRepository.create(propertyData);

      expect(property).to.be.instanceOf(Property);
      expect(property.name).toBe(propertyData.name);
      expect(property.address.street).toBe(propertyData.street);
    });

    it('should throw PropertySerializationError when serializer fails', async () => {
      vi
        .spyOn(PropertySerializer, 'deserialize')
        .mockImplementation(() => {
          throw new SerializerError('Fail');
        });

      await expect(
        propertiesRepository.create(propertyData)
      ).rejects.to.be.instanceOf(PropertySerializationError);
    });
  });

  describe('findById()', () => {
    it('should find a property successfully', async () => {
      const created = await propertiesRepository.create(propertyData);
      const property = await propertiesRepository.findById(created.id);

      expect(property).to.be.instanceOf(Property);
      expect(property.id).toBe(created.id);
    });

    it('should throw PropertyNotFound if property does not exist', async () => {
      await expect(
        propertiesRepository.findById('non-existent-id')
      ).rejects.to.be.instanceOf(PropertyNotFound);
    });

    it('should throw PropertySerializationError when serializer fails', async () => {
      const created = await propertiesRepository.create(propertyData);

      vi
        .spyOn(PropertySerializer, 'deserialize')
        .mockImplementation(() => {
          throw new SerializerError('Fail');
        });

      await expect(
        propertiesRepository.findById(created.id)
      ).rejects.to.be.instanceOf(PropertySerializationError);
    });
  });
});
