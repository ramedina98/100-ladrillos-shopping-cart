import { PrismaClient } from '@prisma/client/extension';

import type { Database } from '../../core/database/Database.js';
import type { UsersRepository } from '../../core/database/UsersRepository.js';

import SQLUsersRepository from './SQLUsersRepository.js';
import { PropertiesRepository } from '../../core/database/PropertiesRepository.js';
import SQLPropertiesRepository from './SQLPropertiesRepository.js';

class SQLDatabase implements Database {
  readonly properties: PropertiesRepository;
  readonly users: UsersRepository;

  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.properties = new SQLPropertiesRepository(client);
    this.users = new SQLUsersRepository(client);
  };
}

export default SQLDatabase;
