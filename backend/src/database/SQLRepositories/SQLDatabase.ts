import { PrismaClient } from '@prisma/client/extension';

import type { BricksRepository } from '../../core/database/BricksRepository.js';
import type { Database } from '../../core/database/Database.js';
import type { PropertiesRepository } from '../../core/database/PropertiesRepository.js';
import type { UsersRepository } from '../../core/database/UsersRepository.js';

import SQLBricksRepository from './SQLBricksRepository.js';
import SQLUsersRepository from './SQLUsersRepository.js';
import SQLPropertiesRepository from './SQLPropertiesRepository.js';

class SQLDatabase implements Database {
  readonly bricks: BricksRepository;
  readonly properties: PropertiesRepository;
  readonly users: UsersRepository;

  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.bricks = new SQLBricksRepository(this, client);
    this.properties = new SQLPropertiesRepository(client);
    this.users = new SQLUsersRepository(client);
  };
}

export default SQLDatabase;
