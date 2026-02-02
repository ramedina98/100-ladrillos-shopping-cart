import { beforeEach, describe, expect, it } from 'vitest';

import Address from '../../src/core/Address.js';
import Property, { PropertyData } from '../../src/core/Property.js';
import {
  InvalidRentalConfiguration,
  MaxBricksReached
} from '../../src/core/errors/index.js';

describe('Property', () => {
  let address: Address;
  let propertyData: PropertyData;

  beforeEach(() => {
    address = new Address({
      street: 'Av. Reforma',
      exteriorNumber: '123',
      interiorNumber: '4B',
      neighborhood: 'Centro',
      city: 'Ciudad de México',
      state: 'CDMX',
      postalCode: '06000',
      country: 'México'
    });

    propertyData = {
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
    };
  });

  describe('Construction', () => {
    it('should create a valid property', () => {
      const property = new Property(propertyData);

      expect(property.name).to.be.equal('Corporate Tower');
      expect(property.totalBricks).to.be.equal(100);
    });

    it('should allow rental distribution when rental pool exists', () => {
      const property = new Property({
        ...propertyData,
        rentalDistributionFrequency: 'MONTHLY'
      });

      expect(property.rentalDistributionFrequency).to.be.equal('MONTHLY');
    });

    it('should throw when rental frequency is defined without rental pool', () => {
      expect(() =>
        new Property({
          ...propertyData,
          hasRentalPool: false,
          rentalDistributionFrequency: 'MONTHLY'
        })
      ).toThrow(InvalidRentalConfiguration);
    });
  });

  describe('Brick sale rules', () => {
    it('should allow sale when funding', () => {
      const property = new Property(propertyData);

      expect(property.isBrickSaleAllowed()).to.be.equal(true);
    });

    it('should allow sale when operating', () => {
      const property = new Property({
        ...propertyData,
        fundingStatus: 'OPERATING'
      });

      expect(property.isBrickSaleAllowed()).to.be.equal(true);
    });

    it('should do not allow sale when funded but not operating', () => {
      const property = new Property({
        ...propertyData,
        fundingStatus: 'FUNDED'
      });

      expect(property.isBrickSaleAllowed()).to.be.equal(false);
    });
  });

  describe('Brick creation limits', () => {
    it('should allow creating bricks under the limit', () => {
      const property = new Property(propertyData);

      expect(() => property.validateBrickCreation(99)).not.toThrow();
    });

    it('should throw when limit is reached', () => {
      const property = new Property(propertyData);

      expect(() => property.validateBrickCreation(100)).toThrow(MaxBricksReached);
    });

    it('should throw when limit is exceeded', () => {
      const property = new Property(propertyData);

      expect(() => property.validateBrickCreation(150)).toThrow(MaxBricksReached);
    });
  });
});
