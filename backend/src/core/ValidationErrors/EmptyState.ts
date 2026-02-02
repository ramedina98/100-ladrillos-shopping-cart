import ValidationError from './ValidationError.js';

class EmptyState extends ValidationError {
  constructor(options?: ErrorOptions) {
    super('Empty state', options);
  }
}

export default EmptyState;
