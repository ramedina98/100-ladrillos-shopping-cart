import ValidationError from './ValidationError.js';

class EmptyExteriorNumber extends ValidationError {
  constructor(options?: ErrorOptions) {
    super('Empty exterior number', options);
  }
}

export default EmptyExteriorNumber;
