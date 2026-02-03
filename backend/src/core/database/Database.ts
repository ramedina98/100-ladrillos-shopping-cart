import type { BricksRepository } from './BricksRepository.js';
import type { PropertiesRepository } from './PropertiesRepository.js';
import type { UsersRepository } from './UsersRepository.js';

interface Database {
  readonly bricks: BricksRepository;
  readonly properties: PropertiesRepository
  readonly users: UsersRepository;
}

export type { Database };
