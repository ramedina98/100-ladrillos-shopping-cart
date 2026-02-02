import DatabaseError from './DatabaseError.js';

class CouldNotFetchProperty extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not fetch property', options);
  }
}

export default CouldNotFetchProperty;
