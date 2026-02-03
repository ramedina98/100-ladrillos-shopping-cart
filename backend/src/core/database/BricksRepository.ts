import Brick from '../Brick.js';
import type { BrickStatus } from '../Brick.js';

interface BrickData {
  id?: string;
  propertyId: string;
  status: BrickStatus;
  ownershipPercentage: number;
  accumulatedEarnings: number;
  lastPayoutDate?: Date;
  currentOwnerId?: string;
  price: number;
  version: number;
}

interface BricksRepository {
  save(brick: BrickData): Promise<Brick>;
  saveWithVersion(brick: Brick): Promise<Brick>;
  findById(brickId: string): Promise<Brick>;
}

export type { BrickData, BricksRepository };
