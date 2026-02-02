import ValidationError from './ValidationError.js';

class EmptyNeighborhood extends ValidationError {
  constructor(options?: ErrorOptions) {
    super('Empty neighborhood', options);
  }
}

export default EmptyNeighborhood;
