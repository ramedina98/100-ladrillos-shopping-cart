import { PrismaClient } from '@prisma/client';

import AbstractRepository from '../AbstractRepository.js';
import Brick from '../../core/Brick.js';
import BrickSerializer from '../serializers/BrickSerializer.js';
import InvalidEnumValue from '../serializers/errors/InvalidEnumValue.js';
import {
  BrickNotFound,
  BrickSerializerError,
  BrickVersionDoNotMatch,
  CouldNotSaveBrick,
  CouldNotFetchBrick
} from '../../core/database/errors/index.js';
import { Database } from '../../core/database/Database.js';
import type { BrickData, BricksRepository } from '../../core/database/BricksRepository.js';

class SQLBricksRepository extends AbstractRepository implements BricksRepository {
  readonly database: Database;

  private client: PrismaClient;

  constructor(database: Database, client: PrismaClient) {
    super();

    this.database = database;
    this.client = client;
  }

  async save(brick: BrickData): Promise<Brick> {
    try {
      const id = brick.id ?? this.generateUUID();

      await this.client.brick.upsert({
        where: { id },
        update: {
          ...brick,
          status: brick.status,
          updatedAt: new Date()
        },
        create: {
          ...brick,
          id,
          status: brick.status
        }
      });

      return this.findById(id);
    } catch (error) {
      throw new CouldNotSaveBrick({ cause: error });
    }
  }

  async saveWithVersion(brick: Brick): Promise<Brick> {
    try {
      const current = await this.client.brick.findUnique({ where: { id: brick.id } });

      if (!current) {
        throw new BrickNotFound(brick.id);
      }

      if (current.version !== brick.getVersion()) {
        throw new BrickVersionDoNotMatch();
      }

      await this.client.brick.update({
        where: { id: brick.id },
        data: {
          status: brick.getStatus(),
          price: brick.getPrice(),
          currentOwnerId: brick.getCurrentOwner()?.id ?? null,
          version: { increment: 1 },
          updatedAt: new Date()
        }
      });

      return brick;
    } catch (error) {
      if (error instanceof BrickNotFound || error instanceof BrickVersionDoNotMatch) {
        throw error;
      }

      throw new CouldNotSaveBrick({ cause: error });
    }
  }

  async findById(brickId: string): Promise<Brick> {
    let brick;

    try {
      brick = await this.client.brick.findUnique({
        where: { id: brickId }
      });
    } catch (error) {
      throw new CouldNotFetchBrick({ cause: error });
    }

    if (!brick) {
      throw new BrickNotFound(brickId);
    }

    try {
      const property = await this.database.properties.findById(brick.propertyId);
      const owner = await this.database.users.findById(brick.currentOwnerId);

      return BrickSerializer.deserialize(brick, property, owner);
    } catch (error) {
      if (error instanceof InvalidEnumValue) {
        throw new BrickSerializerError({ cause: error });
      }

      throw new CouldNotFetchBrick( {cause: error });
    }
  }
}

export default SQLBricksRepository;
