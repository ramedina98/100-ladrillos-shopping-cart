import ValidationError from './ValidationError.js';

class EmptyCity extends ValidationError {
  constructor(options?: ErrorOptions) {
    super('Empty city', options);
  }
}

export default EmptyCity;
