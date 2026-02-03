import { describe, it, expect } from 'vitest';
import { BrickStatus } from '@prisma/client';

import Address from '../../../src/core/Address.js';
import BrickSerializer from '../../../src/database/serializers/BrickSerializer.js';
import Property from '../../../src/core/Property.js';
import User from '../../../src/core/User.js';
import { InvalidEnumValue } from '../../../src/database/serializers/errors/index.js';

describe('BrickSerializer', () => {
  const property = new Property({
    id: 'prop-1',
    name: 'Prop',
    description: 'desc',
    address: new Address({
      street: 's',
      exteriorNumber: '1',
      neighborhood: 'n',
      city: 'c',
      state: 's',
      country: 'c'
    }),
    propertyType: 'COMMERCIAL',
    totalBricks: 10,
    brickBasePrice: 100,
    currency: 'USD',
    fundingStatus: 'FUNDED',
    annualReturnTarget: 5,
    rentalYield: 3,
    appreciationTarget: 2,
    hasRentalPool: true,
    rentalDistributionFrequency: 'MONTHLY',
    estimatedDeliveryDate: new Date()
  });

  const user = new User({
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com'
  });

  it('should deserialize DB data into Brick domain object', () => {
    const dbBrick = {
      id: 'brick-1',
      propertyId: 'prop-1',
      currentOwnerId: 'user-1',
      price: 100,
      status: 'AVAILABLE',
      ownershipPercentage: 0.1,
      accumulatedEarnings: 50,
      lastPayoutDate: new Date('2024-01-01'),
      version: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const brick = BrickSerializer.deserialize(dbBrick, property, user);

    expect(brick.id).toBe('brick-1');
    expect(brick.property.id).toBe(property.id);
    expect(brick.getCurrentOwner().id).toBe(user.id);
    expect(brick.getPrice()).toBe(100);
    expect(brick.getStatus()).toBe(BrickStatus.AVAILABLE);
    expect(brick.ownershipPercentage).toBe(0.1);
    expect(brick.accumulatedEarnings).toBe(50);
    expect(brick.lastPayoutDate).toEqual(new Date('2024-01-01'));
    expect(brick.getVersion()).toBe(2);
  });

  it('should set lastPayoutDate as undefined when DB value is null', () => {
    const dbBrick = {
      id: 'brick-2',
      propertyId: 'prop-1',
      currentOwnerId: 'user-1',
      price: 100,
      status: 'RESERVED',
      ownershipPercentage: 0.1,
      accumulatedEarnings: 0,
      lastPayoutDate: null,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const brick = BrickSerializer.deserialize(dbBrick, property, user);

    expect(brick.lastPayoutDate).toBeUndefined();
    expect(brick.getStatus()).toBe(BrickStatus.RESERVED);
  });

  it('should throw InvalidEnumValue when brick status is invalid', () => {
    const dbBrick = {
      id: 'brick-4',
      propertyId: 'prop-1',
      currentOwnerId: 'user-1',
      price: 100,
      status: 'BROKEN',
      ownershipPercentage: 0.1,
      accumulatedEarnings: 0,
      lastPayoutDate: null,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(() =>
      BrickSerializer.deserialize(dbBrick, property, user)
    ).toThrow(InvalidEnumValue);
  });
});
