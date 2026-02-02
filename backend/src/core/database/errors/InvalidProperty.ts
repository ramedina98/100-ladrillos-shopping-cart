import DatabaseError from './DatabaseError.js';

class InvalidProperty extends DatabaseError {
  readonly name: string;

  constructor(name: string, options?: ErrorOptions) {
    super(`Invalid property: "${name}"`, options);

    this.name = name;
  }
}

export default InvalidProperty;
