import cloneDeep from 'lodash.clonedeep';

import Address from '../../core/Address.js';
import AbstractRepository from '../AbstractRepository.js';
import Property from '../../core/Property.js';
import { InvalidProperty, PropertyNotFound } from '../../core/database/errors/index.js';
import type {
  CreatePropertyData,
  PropertiesRepository
} from '../../core/database/PropertiesRepository.js';

class MemoryPropertiesRepository extends AbstractRepository implements PropertiesRepository {
  private properties: Record<string, Property>[] = [];

  async create(property: CreatePropertyData): Promise<Property> {
    let createdProperty: Property;

    const propertyId = this.generateUUID();

    try {
      createdProperty = new Property({
        ...property,
        id: propertyId,
        address: new Address({
          street: property.street,
          exteriorNumber: property.externalNumber,
          neighborhood: property.neighborhood,
          city: property.city,
          state: property.state,
          country: property.country
        })
      });
    } catch (error) {
      throw new InvalidProperty(property.name, { cause: error });
    }

    this.properties[propertyId] = createdProperty;

    return cloneDeep(createdProperty);
  }

  async findById(propertyId: string): Promise<Property> {
    const property = this.properties[propertyId];

    if (!property) {
      throw new PropertyNotFound(propertyId);
    }

    return cloneDeep(property);
  }
}

export default MemoryPropertiesRepository;
