import type {
  BricksRepository,
  CartsRepository,
  Database,
  PropertiesRepository,
  UsersRepository
} from '../../core/database/index.js';

import MemoryPropertiesRepository from './MemoryPropertiesRepository.js';
import MemoryUserRepository from './MemoryUsersRepository.js';

class MemoryDatabase implements Database {
  readonly bricks: BricksRepository;
  readonly carts: CartsRepository;
  readonly properties: PropertiesRepository;
  readonly users: UsersRepository;

  constructor() {
    this.properties = new MemoryPropertiesRepository();
    this.users = new MemoryUserRepository();
  };
};

export default MemoryDatabase;
