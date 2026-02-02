import type { UsersRepository } from '../../core/database/index.js';

import type { Database } from '../../core/database/index.js';

class MemoryDatabase implements Database {
  readonly users: UsersRepository;

  constructor() {
    // this.users;
  };
};

export default MemoryDatabase;
