import { PrismaClient } from '@prisma/client';

import AbstractRepository from '../AbstractRepository.js';
import Property from '../../core/Property.js';
import PropertySerializer from '../serializers/PropertySerializer.js';
import SerializerError from '../serializers/errors/index.js';
import {
  CouldNotCreateProperty,
  CouldNotFetchProperty,
  PropertyNotFound,
  PropertySerializationError
} from '../../core/database/errors/index.js';
import type {
  CreatePropertyData,
  PropertiesRepository
} from '../../core/database/PropertiesRepository.js';

class SQLPropertiesRepository extends AbstractRepository implements PropertiesRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    super();

    this.client = client;
  }

  async create(property: CreatePropertyData): Promise<Property> {
    try {
      const createdProperty = await this.client.property.create({
        data: {
          ...property,
          id: this.generateUUID()
        }
      });

      return PropertySerializer.deserialize({
        ...createdProperty,
        brickBasePrice: Number(createdProperty.brickBasePrice),
        annualReturnTarget: Number(createdProperty.annualReturnTarget),
        rentalYield: Number(createdProperty.rentalYield),
        appreciationTarget: Number(createdProperty.appreciationTarget)
      });
    } catch (error) {
      if (error instanceof SerializerError) {
        throw new PropertySerializationError({ cause: error });
      }

      throw new CouldNotCreateProperty({ cause: error });
    }
  }

  async findById(propertyId: string): Promise<Property> {
    let property;

    try {
      property = await this.client.property.findUnique({ where: { id: propertyId }});
    } catch (error) {
      throw new CouldNotFetchProperty({ cause: error });
    }

    if (!property) {
      throw new PropertyNotFound(propertyId);
    }

    try {
      return PropertySerializer.deserialize({
        ...property,
        brickBasePrice: Number(property.brickBasePrice),
        annualReturnTarget: Number(property.annualReturnTarget),
        rentalYield: Number(property.rentalYield),
        appreciationTarget: Number(property.appreciationTarget)
      });
    } catch (error) {
      throw new PropertySerializationError({ cause: error });
    }
  }
}

export default SQLPropertiesRepository;
