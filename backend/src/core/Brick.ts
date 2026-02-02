import Property from './Property.js';
import User from './User.js';

import {
  BrickHasNoOwner,
  BrickNotAvailable,
  BrickNotReserved,
  BrickPriceLocked
} from './errors/index.js';

type BrickStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

interface BrickData {
  id?: string;
  property: Property;
  status: BrickStatus;
  ownershipPercentage: number;
  accumulatedEarnings: number;
  lastPayoutDate?: Date;
  currentOwner?: User;
  price: number;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Brick {
  readonly id?: string;
  readonly property: Property;
  readonly ownershipPercentage: number;
  readonly accumulatedEarnings: number;
  readonly lastPayoutDate?: Date;
  readonly createdAt: Date;

  private currentOwner?: User;
  private price: number;
  private version: number;
  private status: BrickStatus;
  private updatedAt: Date;

  constructor(data: BrickData) {
    this.id = data.id;
    this.property = data.property;
    this.ownershipPercentage = data.ownershipPercentage;
    this.accumulatedEarnings = data.accumulatedEarnings;
    this.lastPayoutDate = data.lastPayoutDate;
    this.currentOwner = data.currentOwner;
    this.price = data.price;
    this.version = data.version;
    this.status = data.status;

    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? this.createdAt;
  }

  isAvailable(): boolean {
    return this.status === 'AVAILABLE';
  }

  reserve() {
    if (!this.isAvailable()) {
      throw new BrickNotAvailable(this.status);
    }

    this.status = 'RESERVED';
    this.bumpVersion();
  }

  release() {
    if (this.status !== 'RESERVED') {
      throw new BrickNotReserved();
    }

    this.status = 'AVAILABLE';
    this.bumpVersion();
  }

  sold(newOwner: User): void {
    if (this.status !== 'RESERVED') {
      throw new BrickNotReserved();
    }

    this.status = 'SOLD';
    this.currentOwner = newOwner;
    this.bumpVersion();
  }

  getCurrentOwnerName(): string {
    if (!this.currentOwner) {
      throw new BrickHasNoOwner();
    }

    return this.currentOwner.getName();
  }

  getPrice(): number {
    return this.price;
  }

  getStatus(): BrickStatus {
    return this.status;
  }

  updatePrice(newPrice: number) {
    if (!this.isAvailable()) {
      throw new BrickPriceLocked(this.status);
    }

    this.price = newPrice;
  }

  validate(): void {
    if (this.status === 'SOLD' && !this.currentOwner) {
      throw new BrickHasNoOwner();
    }

    if (this.status !== 'SOLD' && this.currentOwner) {
      throw new BrickHasNoOwner();
    }
  }

  private bumpVersion() {
    this.version += 1;
    this.updatedAt = new Date();
  }
}

export default Brick;
export type { BrickStatus };
