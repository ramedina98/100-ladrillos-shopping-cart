import DatabaseError from './DatabaseError.js';

class CouldNotCreateUser extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not create user', options);
  }
}

export default CouldNotCreateUser;
