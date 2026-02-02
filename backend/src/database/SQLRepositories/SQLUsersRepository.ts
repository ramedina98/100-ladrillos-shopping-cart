import { Prisma, PrismaClient } from '@prisma/client';

import AbstractRepository from '../AbstractRepository.js';
import User from '../../core/User.js';
import {
  CouldNotCreateUser,
  CouldNotFetchUser,
  UserIsAlreadyRegistered,
  UserNotFound
} from '../../core/database/errors/index.js';
import { UserCreateData, UsersRepository } from '../../core/database/UsersRepository.js';

class SQLUsersRepository extends AbstractRepository implements UsersRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    super();

    this.client = client;
  }

  async create(user: UserCreateData): Promise<User> {
    try {
      const createdUser = await this.client.user.create({
        data: { ...user, id: this.generateUUID() }
      });

      return new User({
        ...createdUser,
        secondLastName: createdUser.secondLastName ?? undefined
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UserIsAlreadyRegistered(user.email);
        }
      }

      throw new CouldNotCreateUser({ cause: error });
    }
  }

  async findById(id: string): Promise<User> {
    let user;

    try {
      user = await this.client.user.findUnique({ where: { id } });
    } catch (error) {
      throw new CouldNotFetchUser({ cause: error });
    }

    if (!user) {
      throw new UserNotFound(id);
    }

    return new User(user);
  }
}

export default SQLUsersRepository;
