import ServiceError from './ServiceError.js';

class TermsNotAcceptedError extends ServiceError {
  constructor(options?: ErrorOptions) {
    super('Terms not accepted error', options);
  }
}

export default TermsNotAcceptedError;
