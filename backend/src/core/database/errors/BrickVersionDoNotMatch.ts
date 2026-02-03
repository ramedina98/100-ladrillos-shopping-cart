import DatabaseError from './DatabaseError.js';

class BrickVersionDoNotMatch extends DatabaseError {
  constructor(options?: ErrorOptions) {
    super('Brick version do not match', options);
  }
}

export default BrickVersionDoNotMatch;
