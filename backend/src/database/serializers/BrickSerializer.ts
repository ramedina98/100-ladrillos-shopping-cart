import { BrickStatus } from '@prisma/client';

import Brick from '../../core/Brick.js';
import Property from '../../core/Property.js';
import User from '../../core/User.js';

import { InvalidEnumValue } from './errors/index.js';

interface BrickDBData {
  id: string;
  propertyId: string;
  currentOwnerId: string | null;
  price: number;
  status: string;
  ownershipPercentage: number;
  accumulatedEarnings: number;
  lastPayoutDate: Date | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

class BrickSerializer {
  static deserialize(brick: BrickDBData, property: Property, currentOwner: User): Brick {
    return new Brick({
      ...brick,
      id: brick.id,
      property,
      currentOwner,
      price: brick.price,
      status: this.brickStatusToDomain(brick.status),
      ownershipPercentage: brick.ownershipPercentage,
      accumulatedEarnings: brick.accumulatedEarnings,
      lastPayoutDate: brick.lastPayoutDate ?? undefined,
      version: brick.version
    });
  }

  private static brickStatusToDomain(status: string): BrickStatus {
    switch (status) {
      case 'AVAILABLE': return BrickStatus.AVAILABLE;
      case 'RESERVED': return BrickStatus.RESERVED;
      case 'SOLD': return BrickStatus.SOLD;
      default: {
        throw new InvalidEnumValue('brickStatus', status);
      }
    }
  }
}

export default BrickSerializer;
