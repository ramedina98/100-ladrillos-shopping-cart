import DatabaseError from './DatabaseError.js';

class PropertyNotFound extends DatabaseError {
  readonly id: string;

  constructor(id: string, options?: ErrorOptions) {
    super(`Property with id "${id}" was not found`, options);

    this.id = id;
  }
}

export default PropertyNotFound;
