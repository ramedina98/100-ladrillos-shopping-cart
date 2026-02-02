import {
  FundingStatus,
  PropertyType,
  RentalDistributionFrequency
} from '@prisma/client';

import Address from '../../core/Address.js';
import Property from '../../core/Property.js';

import { InvalidEnumValue } from './errors/index.js';

interface propertyDBData {
  id: string;
  name: string;
  description: string;
  street: string;
  externalNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  propertyType: string;
  totalBricks: number;
  brickBasePrice: number;
  currency: string;
  estimatedDeliveryDate: Date | null;
  fundingStatus: string;
  annualReturnTarget: number;
  rentalYield: number;
  appreciationTarget: number;
  hasRentalPool: boolean;
  rentalDistributionFrequency: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class PropertySerializer {
  static deserialize(property: propertyDBData): Property {
    const propertyType = this.propertyTypeToDomain(property.propertyType);
    const fundingStatus = this.fundingStatusToDomain(property.fundingStatus);

    const rentalDistributionFrequency = property.rentalDistributionFrequency
      ? this.rentalDistributionFrequencyToDomain(property.rentalDistributionFrequency)
      : undefined;

    return new Property({
      id: property.id,
      name: property.name,
      description: property.description,
      propertyType,
      fundingStatus,
      rentalDistributionFrequency,
      estimatedDeliveryDate: property.estimatedDeliveryDate ?? undefined,
      address: new Address({
        street: property.street,
        exteriorNumber: property.externalNumber,
        neighborhood: property.neighborhood,
        city: property.city,
        state: property.state,
        country: property.country
      }),
      totalBricks: Number(property.totalBricks),
      brickBasePrice: Number(property.brickBasePrice),
      currency: property.currency,
      annualReturnTarget: Number(property.annualReturnTarget),
      rentalYield: Number(property.rentalYield),
      appreciationTarget: Number(property.appreciationTarget),
      hasRentalPool: property.hasRentalPool,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    });
  }

  private static fundingStatusToDomain(status: string): FundingStatus {
    switch (status) {
      case 'FUNDING': return FundingStatus.FUNDING;
      case 'FUNDED': return FundingStatus.FUNDED;
      case 'OPERATING': return FundingStatus.OPERATING;
      default: {
        throw new InvalidEnumValue('fundingStatus', status);
      }
    }
  }

  private static propertyTypeToDomain(type: string): PropertyType {
    switch (type) {
      case 'OFFICE': return PropertyType.OFFICE;
      case 'COMMERCIAL': return PropertyType.COMMERCIAL;
      case 'INDUSTRIAL': return PropertyType.INDUSTRIAL;
      default: {
        throw new InvalidEnumValue('propertyType', type);
      }
    }
  }

  private static rentalDistributionFrequencyToDomain(
    frequency: string
  ): RentalDistributionFrequency {
    switch (frequency) {
      case 'MONTHLY': return RentalDistributionFrequency.MONTHLY;
      case 'QUARTERLY': return RentalDistributionFrequency.QUARTERLY;
      default: {
        throw new InvalidEnumValue('rentalDistributionFrequency', frequency);
      }
    }
  }
}

export default PropertySerializer;
export type { propertyDBData };
