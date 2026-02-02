import ValidationError from './ValidationError.js';

class InvalidPostalCode extends ValidationError {
  readonly postalCode: string;

  constructor(postalCode: string, options?: ErrorOptions) {
    super(`Invalid postal code: "${postalCode}"`, options);

    this.postalCode = postalCode;
  }
}

export default InvalidPostalCode;
