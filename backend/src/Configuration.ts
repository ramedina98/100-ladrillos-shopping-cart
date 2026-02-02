interface Configuration {
  getPort(): number;
  getHost(): string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class ConfigurationError extends Error {
  constructor(message: string, options?: ErrorOptions)
  constructor(options?: ErrorOptions)
  constructor(...args: any[]) {
    if (typeof args[0] === 'string') {
      super(...args);
    } else {
      super('Configuration error', ...args);
    }

    this.name = this.constructor.name;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default Configuration;
export { ConfigurationError };
