import { PrismaClient } from '@prisma/client/extension';

import type { Database } from '../../core/database/Database.js';
import type { UsersRepository } from '../../core/database/UsersRepository.js';

import SQLUsersRepository from './SQLUsersRepository.js';

class SQLDatabase implements Database {
  readonly users: UsersRepository;

  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.users = new SQLUsersRepository(client);
  };
}

export default SQLDatabase;
