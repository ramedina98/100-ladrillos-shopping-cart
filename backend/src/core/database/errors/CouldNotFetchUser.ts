import DatabaseError from './DatabaseError.js';

class CouldNotFetchUser extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not fetch user', options);
  }
}

export default CouldNotFetchUser;
