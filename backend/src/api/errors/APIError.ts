class APIError extends Error {
  readonly httpStatusCode: number;
  readonly code: string;

  constructor(httpStatusCode: number, code: string, options?: ErrorOptions) {
    super(`APIError with HTTP status ${httpStatusCode}: ${code}`, options);

    this.httpStatusCode = httpStatusCode;
    this.code = code;

    this.name = this.constructor.name;
  }
}

export default APIError;
