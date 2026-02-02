import { describe, expect, it } from 'vitest';

import Address from '../../src/core/Address.js';
import {
  EmptyStreet,
  EmptyExteriorNumber,
  EmptyNeighborhood,
  EmptyCity,
  EmptyState,
  EmptyCountry
} from '../../src/core/ValidationErrors/index.js';

const validAddressData = {
  street: 'Av. Reforma',
  exteriorNumber: '123',
  interiorNumber: '4B',
  neighborhood: 'Centro',
  city: 'Ciudad de México',
  state: 'CDMX',
  postalCode: '06000',
  country: 'México'
};

describe('Address', () => {
  describe('creation', () => {
    it('should create a valid address', () => {
      const address = new Address(validAddressData);

      expect(address.street).to.be.equal(validAddressData.street);
      expect(address.exteriorNumber).to.be.equal(validAddressData.exteriorNumber);
      expect(address.interiorNumber).to.be.equal(validAddressData.interiorNumber);
      expect(address.neighborhood).to.be.equal(validAddressData.neighborhood);
      expect(address.city).to.be.equal(validAddressData.city);
      expect(address.state).to.be.equal(validAddressData.state);
      expect(address.postalCode).to.be.equal(validAddressData.postalCode);
      expect(address.country).to.be.equal(validAddressData.country);
    });
  });

  describe('equals', () => {
    it('should return true when addresses are equal', () => {
      const address1 = new Address(validAddressData);
      const address2 = new Address({ ...validAddressData });

      expect(address1.equals(address2)).to.be.equal(true);
    });

    it('should return false when street is different', () => {
      const address1 = new Address(validAddressData);
      const address2 = new Address({
        ...validAddressData,
        street: 'Otra calle'
      });

      expect(address1.equals(address2)).to.be.equal(false);
    });

    it('should return false when postal code is different', () => {
      const address1 = new Address(validAddressData);
      const address2 = new Address({
        ...validAddressData,
        postalCode: '12345'
      });

      expect(address1.equals(address2)).to.be.equal(false);
    });
  });

  describe('validation', () => {
    it('should validate a correct address', () => {
      const address = new Address(validAddressData);

      expect(() => address.validate()).not.toThrow();
    });

    it('should throw EmptyStreet when street is empty', () => {
      const address = new Address({
        ...validAddressData,
        street: '   '
      });

      expect(() => address.validate()).toThrow(EmptyStreet);
    });

    it('should throw EmptyExteriorNumber when exterior number is empty', () => {
      const address = new Address({
        ...validAddressData,
        exteriorNumber: ''
      });

      expect(() => address.validate()).toThrow(EmptyExteriorNumber);
    });

    it('should throw EmptyNeighborhood when neighborhood is empty', () => {
      const address = new Address({
        ...validAddressData,
        neighborhood: ' '
      });

      expect(() => address.validate()).toThrow(EmptyNeighborhood);
    });

    it('should throw EmptyCity when city is empty', () => {
      const address = new Address({
        ...validAddressData,
        city: ''
      });

      expect(() => address.validate()).toThrow(EmptyCity);
    });

    it('should throw EmptyState when state is empty', () => {
      const address = new Address({
        ...validAddressData,
        state: ' '
      });

      expect(() => address.validate()).toThrow(EmptyState);
    });

    it('should throw EmptyCountry when country is empty', () => {
      const address = new Address({
        ...validAddressData,
        country: ''
      });

      expect(() => address.validate()).toThrow(EmptyCountry);
    });
  });
});
