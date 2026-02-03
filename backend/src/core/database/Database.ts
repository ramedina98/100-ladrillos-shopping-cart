import type { BricksRepository } from './BricksRepository.js';
import type { CartsRepository } from './CartsRepository.js';
import type { OrdersRepository } from './OrdersRepository.js';
import type { PropertiesRepository } from './PropertiesRepository.js';
import type { UsersRepository } from './UsersRepository.js';

interface Database {
  readonly bricks: BricksRepository;
  readonly carts: CartsRepository;
  readonly orders: OrdersRepository;
  readonly properties: PropertiesRepository
  readonly users: UsersRepository;
}

export type { Database };
