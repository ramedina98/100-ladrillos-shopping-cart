import DatabaseError from './DatabaseError.js';

class BrickSerializerError extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Failed to serialize property', options);
  }
}

export default BrickSerializerError;
