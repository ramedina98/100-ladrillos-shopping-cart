import DatabaseError from './DatabaseError.js';

class CouldNotSaveBrick extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Could not save brick', options);
  }
}

export default CouldNotSaveBrick;
