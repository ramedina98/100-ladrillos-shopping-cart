import DatabaseError from './DatabaseError.js';

class CouldNotCreateProperty extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not create property', options);
  }
}

export default CouldNotCreateProperty;
