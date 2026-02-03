import { describe, it, expect } from 'vitest';
import { FundingStatus, PropertyType, RentalDistributionFrequency } from '@prisma/client';

import Address from '../../../src/core/Address.js';
import Property from '../../../src/core/Property.js';
import PropertySerializer from '../../../src/database/serializers/PropertySerializer.js'; ;
import { InvalidEnumValue } from '../../../src/database/serializers/errors/index.js';
import { propertyDBData } from '../../../src/database/serializers/PropertySerializer.js';

describe('PropertySerializer', () => {
  const validProperty: propertyDBData = {
    id: 'prop-1',
    name: 'Test Property',
    description: 'Nice property',
    street: 'Street 1',
    externalNumber: '123',
    neighborhood: 'Downtown',
    city: 'City',
    state: 'State',
    country: 'Country',
    propertyType: 'COMMERCIAL',
    totalBricks: 10,
    brickBasePrice: 100,
    currency: 'USD',
    estimatedDeliveryDate: new Date(),
    fundingStatus: 'FUNDED',
    annualReturnTarget: 5,
    rentalYield: 3,
    appreciationTarget: 2,
    hasRentalPool: true,
    rentalDistributionFrequency: 'MONTHLY',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  it('should deserialize valid propertyDBData into Property', () => {
    const property = PropertySerializer.deserialize(validProperty);

    expect(property).toBeInstanceOf(Property);
    expect(property.name).toBe(validProperty.name);
    expect(property.address).toBeInstanceOf(Address);
    expect(property.address.street).toBe(validProperty.street);
    expect(property.propertyType).toBe(PropertyType.COMMERCIAL);
    expect(property.fundingStatus).toBe(FundingStatus.FUNDED);
    expect(property.rentalDistributionFrequency).toBe(RentalDistributionFrequency.MONTHLY);
  });

  it('should handle null optional fields', () => {
    const propertyData = {
      ...validProperty,
      estimatedDeliveryDate: null,
      rentalDistributionFrequency: null
    };

    const property = PropertySerializer.deserialize(propertyData);

    expect(property.estimatedDeliveryDate).toBeUndefined();
    expect(property.rentalDistributionFrequency).toBeUndefined();
  });

  it('should throw InvalidEnumValue for invalid propertyType', () => {
    const data = { ...validProperty, propertyType: 'INVALID_TYPE' };

    expect(() => PropertySerializer.deserialize(data)).toThrowError(InvalidEnumValue);
  });

  it('should throw InvalidEnumValue for invalid fundingStatus', () => {
    const data = { ...validProperty, fundingStatus: 'INVALID_STATUS' };

    expect(() => PropertySerializer.deserialize(data)).toThrowError(InvalidEnumValue);
  });

  it('should throw InvalidEnumValue for invalid rentalDistributionFrequency', () => {
    const data = { ...validProperty, rentalDistributionFrequency: 'INVALID_FREQ' };

    expect(() => PropertySerializer.deserialize(data)).toThrowError(InvalidEnumValue);
  });
});
