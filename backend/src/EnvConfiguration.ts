import dotenv from 'dotenv';

import Configuration from './Configuration.js';

const DEFAULT_PORT = 5050;
const DEFAULT_HOST = '127.0.0.1';

type Enviroment = 'development' | 'production' | 'test';

class EnvConfiguration implements Configuration {
  private env: Enviroment;
  private host: string = DEFAULT_HOST;
  private port: number = DEFAULT_PORT;

  constructor(env: Enviroment = 'development') {
    this.env = env;
  }

  getPort(): number {
    return this.port;
  }

  getHost(): string {
    return this.host;
  }

  async load() {
    if (this.env !== 'production') {
      const envFilePath = `.env.${this.env}`;

      dotenv.config({ path: envFilePath });
    }

    this.host = process.env.HOST || DEFAULT_HOST;
    this.port = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;

    /* eslint-disable-next-line no-console */
    console.log(`\nLoaded configuration for "${this.env.toUpperCase()}" enviroment`);
  }
}

export default EnvConfiguration;
export type { Enviroment };
