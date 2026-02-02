import PropertyError from './PropertyError.js';

class InvalidRentalConfiguration extends PropertyError {
  constructor(options?: ErrorOptions) {
    super('Rental frequency not allowed without rental pool', options);
  }
}

export default InvalidRentalConfiguration;
