import type { UsersRepository } from './UsersRepository.js';

interface Database {
  readonly users: UsersRepository;
}

export type { Database };
