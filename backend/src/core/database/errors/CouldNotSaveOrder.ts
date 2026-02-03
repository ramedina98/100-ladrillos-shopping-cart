import DatabaseError from './DatabaseError.js';

class CouldNotSaveOrder extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not save order', options);
  }
}

export default CouldNotSaveOrder;
