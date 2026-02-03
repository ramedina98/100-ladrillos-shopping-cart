import DatabaseError from './DatabaseError.js';

class CouldNotFetchBrick extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not fetch brick', options);
  }
}

export default CouldNotFetchBrick;
