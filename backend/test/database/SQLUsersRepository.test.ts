import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

import SQLUsersRepository from '../../src/database/SQLRepositories/SQLUsersRepository.js';
import User from '../../src/core/User.js';
import {
  CouldNotCreateUser,
  CouldNotFetchUser,
  UserIsAlreadyRegistered,
  UserNotFound
} from '../../src/core/database/errors/index.js';

describe('SQLUsersusersRepositorysitory', () => {
  let prisma: PrismaClient;
  let usersRepository: SQLUsersRepository;

  beforeEach(async () => {
    prisma = new PrismaClient();
    usersRepository = new SQLUsersRepository(prisma);

    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('create()', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        secondLastName: 'Gómez',
        email: 'juan@example.com'
      };

      const user = await usersRepository.create(userData);

      expect(user).to.be.instanceOf(User);
      expect(user.id).toBeDefined();
      expect(user.getName())
        .to.be.equal(userData.firstName + ' ' + userData.lastName + ' ' + userData.secondLastName);
      expect(user.email).to.be.equal(userData.email);

      const userInDb = await prisma.user.findUnique({ where: { email: userData.email } });

      /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
      expect(userInDb).not.to.be.null;
      expect(userInDb!.firstName).to.be.equal(userData.firstName);
    });

    it('should throw UserIsAlreadyRegistered when email exists', async () => {
      const userData = {
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana@example.com'
      };

      await usersRepository.create(userData);

      await expect(
        usersRepository.create(userData)
      ).rejects.toBeInstanceOf(UserIsAlreadyRegistered);
    });

    it('should throw CouldNotCreateUser when Prisma fails', async () => {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const invalidUserData: any = {
        firstName: 'Test',
        lastName: 'Fail',
        email: 'fail@example.com',
        invalidField: 'oops'
      };

      await expect(
        usersRepository.create(invalidUserData)
      ).rejects.to.be.instanceOf(CouldNotCreateUser);
    });
  });

  describe('findById()', () => {
    it('should find an existing user by id', async () => {
      const created = await usersRepository.create({
        firstName: 'Carlos',
        lastName: 'Ramírez',
        email: 'carlos@example.com'
      });

      const user = await usersRepository.findById(created.id);

      expect(user).to.be.instanceOf(User);
      expect(user.id).to.be.equal(created.id);
      expect(user.email).to.be.equal(created.email);
    });

    it('should throw UserNotFound whe user does not exist', async () => {
      await expect(
        usersRepository.findById('non-existent-id')
      ).rejects.toBeInstanceOf(UserNotFound);
    });

    it('should throw CouldNotFetchUser when Prisma fails', async () => {
      const mockClient = {
        user: {
          findUnique: vi.fn().mockRejectedValue(new Error('Database failure'))
        }
      } as unknown as PrismaClient;

      const usersRepository = new SQLUsersRepository(mockClient);

      await expect(usersRepository.findById('any-id')).rejects.toBeInstanceOf(CouldNotFetchUser);
    });
  });
});
