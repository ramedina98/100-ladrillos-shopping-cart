import type { Database, UsersRepository } from '../../core/database/index.js';

import MemoryUserRepository from './MemoryUsersRepository.js';

class MemoryDatabase implements Database {
  readonly users: UsersRepository;

  constructor() {
    this.users = new MemoryUserRepository();
  };
};

export default MemoryDatabase;
