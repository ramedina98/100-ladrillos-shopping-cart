import DatabaseError from './DatabaseError.js';

class BrickNotFound extends DatabaseError {
  readonly id: string;

  constructor(id: string, options?: ErrorOptions) {
    super(`Brick with id "${id}" was not found`, options);

    this.id = id;
  }
}

export default BrickNotFound;
