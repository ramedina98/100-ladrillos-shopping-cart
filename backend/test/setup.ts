import { afterAll, beforeEach } from 'vitest';

import prisma from '../src/infrastructure/prisma/prismaClient';

beforeEach(async () => {
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE CartItem;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE Cart;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE Brick;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE Property;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE User;');
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
});

afterAll(async () => {
  await prisma.$disconnect();
});
