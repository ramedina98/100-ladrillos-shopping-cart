import { beforeEach, describe, expect, it } from 'vitest';

import Address from '../../src/core/Address.js';
import Brick from '../../src/core/Brick.js';
import Property from '../../src/core/Property.js';
import User from '../../src/core/User.js';
import {
  BrickHasNoOwner,
  BrickNotAvailable,
  BrickNotReserved,
  BrickPriceLocked
} from '../../src/core/errors/index.js';

describe('Brick', () => {
  let property: Property;
  let user: User;

  beforeEach(() => {
    const address = new Address({
      street: 'Av. Reforma',
      exteriorNumber: '123',
      interiorNumber: '4B',
      neighborhood: 'Centro',
      city: 'Ciudad de México',
      state: 'CDMX',
      postalCode: '06000',
      country: 'México'
    });

    user = new User({
      id: 'user-123',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'example@email.com'
    });

    property = new Property({
      id: 'property-123',
      name: 'Corporate Tower',
      description: 'Office building',
      address,
      propertyType: 'OFFICE',
      totalBricks: 100,
      brickBasePrice: 1000,
      currency: 'MXN',
      fundingStatus: 'FUNDING',
      annualReturnTarget: 12,
      rentalYield: 8,
      appreciationTarget: 10,
      hasRentalPool: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  describe('Availability', () => {
    it('should return true only when AVAILABLE', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      expect(brick.isAvailable()).to.be.equal(true);
    });

    it('should return false when RESERVED or SOLD', () => {
      const reserved = new Brick({
        id: 'brick-123',
        property,
        status: 'RESERVED',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      const sold = new Brick({
        id: 'brick-123',
        property,
        status: 'SOLD',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        currentOwner: user,
        price: 1000,
        version: 1
      });

      expect(reserved.isAvailable()).to.be.equal(false);
      expect(sold.isAvailable()).to.be.equal(false);
    });
  });

  describe('Reserve', () => {
    it('should change AVAILABLE to RESERVED', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      brick.reserve();
      expect(brick.getStatus()).to.be.equal('RESERVED');
    });

    it('should throw when not AVAILABLE', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'RESERVED',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      expect(() => brick.reserve()).toThrow(BrickNotAvailable);
    });
  });

  describe('Release', () => {
    it('should change RESERVED → AVAILABLE', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      brick.reserve();
      brick.release();

      expect(brick.getStatus()).to.be.equal('AVAILABLE');
    });

    it('should throw when not RESERVED', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      expect(() => brick.release()).toThrow(BrickNotReserved);
    });
  });

  describe('Sell', () => {
    it('should change RESERVED to SOLD and assigns owner', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      const buyer = user;

      brick.reserve();
      brick.sold(buyer);

      expect(brick.getStatus()).to.be.equal('SOLD');
      expect(brick.getCurrentOwner()).to.deep.equal(user);
    });

    it('should throw when not RESERVED', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      expect(() => brick.sold(user)).toThrow(BrickNotReserved);
    });
  });

  describe('Ownership rules', () => {
    it('should validate fails when SOLD without owner', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'SOLD',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      expect(() => brick.validate()).toThrow(BrickHasNoOwner);
    });
  });

  describe('Price rules', () => {
    it('shouldupdate price when AVAILABLE', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      brick.updatePrice(2000);

      expect(brick.getPrice()).to.be.equal(2000);
    });

    it('should throw when price updated during transaction', () => {
      const brick = new Brick({
        id: 'brick-123',
        property,
        status: 'AVAILABLE',
        ownershipPercentage: 0.01,
        accumulatedEarnings: 0,
        price: 1000,
        version: 1
      });

      brick.reserve();

      expect(() => brick.updatePrice(2000)).toThrow(BrickPriceLocked);
    });
  });
});
