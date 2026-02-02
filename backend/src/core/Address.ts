import {
  EmptyCity,
  EmptyCountry,
  EmptyExteriorNumber,
  EmptyNeighborhood,
  EmptyState,
  EmptyStreet,
  InvalidPostalCode
} from './ValidationErrors/index.js';

const POSTAL_CODE_REGEX = /^[0-9]{5}$/;

interface AddressData {
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

class Address {
  readonly street: string;
  readonly exteriorNumber: string;
  readonly interiorNumber?: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;

  constructor(props: AddressData) {
    this.street = props.street;
    this.exteriorNumber = props.exteriorNumber;
    this.interiorNumber = props.interiorNumber;
    this.neighborhood = props.neighborhood;
    this.city = props.city;
    this.state = props.state;
    this.postalCode = props.postalCode;
    this.country = props.country;
  }

  equals(address: Address): boolean {
    return (
      this.street === address.street
      && this.neighborhood === address.neighborhood
      && this.city === address.city
      && this.state === address.state
      && this.postalCode === address.postalCode
      && this.country === address.country
    );
  }

  validate(): void {
    if (!this.street.trim()) {
      throw new EmptyStreet();
    }

    if (!this.exteriorNumber.trim()) {
      throw new EmptyExteriorNumber();
    }

    if (!this.neighborhood.trim()) {
      throw new EmptyNeighborhood();
    }

    if (!this.city.trim()) {
      throw new EmptyCity();
    }

    if (!this.state.trim()) {
      throw new EmptyState();
    }

    if (!this.country.trim()) {
      throw new EmptyCountry();
    }

    if (!POSTAL_CODE_REGEX.test(this.postalCode)) {
      throw new InvalidPostalCode(this.postalCode);
    }
  }
}

export default Address;
export type { AddressData };
