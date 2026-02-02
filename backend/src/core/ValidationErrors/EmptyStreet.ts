import ValidationError from './ValidationError.js';

class EmptyStreet extends ValidationError {
  constructor(options?: ErrorOptions) {
    super('Empty street', options);
  }
}

export default EmptyStreet;
