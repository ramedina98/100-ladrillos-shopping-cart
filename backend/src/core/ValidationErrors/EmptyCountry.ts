import ValidationError from './ValidationError.js';

class EmptyCountry extends ValidationError {
  constructor(options?: ErrorOptions) {
    super('Empty country', options);
  }
}

export default EmptyCountry;
