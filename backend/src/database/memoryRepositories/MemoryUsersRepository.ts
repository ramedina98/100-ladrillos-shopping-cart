import cloneDeep from 'lodash.clonedeep';

import User from '../../core/User.js';
import { UsersRepository, UserCreateData } from '../../core/database/index.js';
import { UserIsAlreadyRegistered, UserNotFound } from '../../core/database/errors/index.js';

import AbstractRepository from '../AbstractRepository.js';

class MemoryUserRepository extends AbstractRepository implements UsersRepository {
  private users: Record<string, User>[] = [];

  async create(user: UserCreateData): Promise<User> {
    if (this.userIsAlreadyRegistered(user.email)) {
      throw new UserIsAlreadyRegistered(user.email);
    }

    const userId = this.generateUUID();
    const createdUser = new User({ ...user, id: userId });

    this.users[userId] = createdUser;

    return cloneDeep(createdUser);
  }

  async findById(id: string): Promise<User> {
    const user: User = this.users[id];

    if (!user) {
      throw new UserNotFound(id);
    }

    return cloneDeep(user);
  }

  private userIsAlreadyRegistered(email: string): boolean {
    return Object.keys(this.users).some(key => {
      return this.users[key].email.toLowerCase() === email.toLowerCase();
    });
  }
}

export default MemoryUserRepository;
