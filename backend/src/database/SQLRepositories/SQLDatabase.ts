import { PrismaClient } from '@prisma/client/extension';

import type { Database } from '../../core/database/Database.js';
import type { UsersRepository } from '../../core/database/UsersRepository.js';

class SQLDatabase implements Database {
  readonly users: UsersRepository;

  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;

    // this.users...
  };
}

export default SQLDatabase;
