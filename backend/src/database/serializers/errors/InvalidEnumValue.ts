import SerializerError from './SerializerError.js';

class InvalidEnumValue extends SerializerError {
  readonly fieldName: string;
  readonly received: string;

  constructor(
    fieldName: string,
    received: string,
    options?: ErrorOptions
  ) {
    super(`Invalid value for ${fieldName}`, options);

    this.fieldName = fieldName;
    this.received = received;
  }
}

export default InvalidEnumValue;
