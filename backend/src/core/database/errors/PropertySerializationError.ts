import DatabaseError from './DatabaseError.js';

class PropertySerializationError extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Failed to serialize property', options);
  }
}

export default PropertySerializationError;
