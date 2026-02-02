import Property from '../Property.js';
import type {
  FundingStatus,
  PropertyType,
  RentalDistributionFrequency
} from '../Property.js';

interface CreatePropertyData {
  name: string;
  description: string;
  street: string;
  externalNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
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
}

interface PropertiesRepository {
  create(property: CreatePropertyData): Promise<Property>;
  findById(propertyId: string): Promise<Property>;
}

export type { CreatePropertyData, PropertiesRepository };
