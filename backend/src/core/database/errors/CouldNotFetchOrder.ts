import DatabaseError from './DatabaseError.js';

class CouldNotFetchOrder extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not fetch order', options);
  }
}

export default CouldNotFetchOrder;
