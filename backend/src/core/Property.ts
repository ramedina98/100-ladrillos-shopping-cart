import Address from './Address.js';

import {
  InvalidRentalConfiguration,
  MaxBricksReached
} from './errors/index.js';

type FundingStatus = 'FUNDING' | 'FUNDED' | 'OPERATING';
type PropertyType = 'OFFICE' | 'COMMERCIAL' | 'INDUSTRIAL';
type RentalDistributionFrequency = 'MONTHLY' | 'QUARTERLY';

interface PropertyData {
  id?: string;
  name: string;
  description: string;
  address: Address;
  propertyType: PropertyType;
  totalBricks: number;
  brickBasePrice: number;
  currency: string;
  fundingStatus: FundingStatus;
  annualReturnTarget: number;
  rentalYield: number;
  appreciationTarget: number;
  hasRentalPool: boolean;
  estimatedDeliveryDate?: Date;
  rentalDistributionFrequency?: RentalDistributionFrequency;
  createdAt: Date;
  updatedAt: Date;
}

class Property {
  readonly id?: string;
  readonly name: string;
  readonly description: string;
  readonly address: Address;
  readonly propertyType: PropertyType;
  readonly totalBricks: number;
  readonly brickBasePrice: number;
  readonly currency: string;
  readonly fundingStatus: FundingStatus;
  readonly annualReturnTarget: number;
  readonly rentalYield: number;
  readonly appreciationTarget: number;
  readonly hasRentalPool: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly estimatedDeliveryDate?: Date;
  readonly rentalDistributionFrequency?: RentalDistributionFrequency;

  constructor(data: PropertyData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.address = data.address;
    this.propertyType = data.propertyType;
    this.totalBricks = data.totalBricks;
    this.brickBasePrice = data.brickBasePrice;
    this.currency = data.currency;
    this.fundingStatus = data.fundingStatus;
    this.annualReturnTarget = data.annualReturnTarget;
    this.rentalYield = data.rentalYield;
    this.appreciationTarget = data.appreciationTarget;
    this.hasRentalPool = data.hasRentalPool;
    this.estimatedDeliveryDate = data.estimatedDeliveryDate;
    this.rentalDistributionFrequency = data.rentalDistributionFrequency;

    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? this.createdAt;

    this.validateRentalConfig();
  }

  isBrickSaleAllowed(): boolean {
    return this.fundingStatus === 'FUNDING' || this.fundingStatus === 'OPERATING';
  }

  validateBrickCreation(currentBricksCount: number): void {
    if (currentBricksCount >= this.totalBricks) {
      throw new MaxBricksReached(this.totalBricks);
    }
  }

  private validateRentalConfig(): void {
    if (!this.hasRentalPool && this.rentalDistributionFrequency) {
      throw new InvalidRentalConfiguration();
    }
  }
}

export default Property;
export type { PropertyData };
