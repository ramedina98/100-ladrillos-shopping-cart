import { beforeEach, describe, expect, it, vi } from 'vitest';

import EnvConfiguration from '../src/EnvConfiguration.js';

describe('EnvConfiguration', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    delete process.env.HOST;
    delete process.env.PORT;

    /**
     * Silence console.log during tests  to avoid cluttering the test output. This ensures that log
     * messages from EnvCofiguration or other parts of the app do not appear in the test runner's
     * stdout.
     */
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should load host, port and usersBaseURL from env', async () => {
    process.env.HOST = '127.0.0.1';
    process.env.PORT = '8005';
    process.env.USERS_BASE_URL = 'http://example.com';

    const config = new EnvConfiguration('development');

    await config.load();

    expect(config.getPort()).toBe(8005);
    expect(config.getHost()).toBe('127.0.0.1');
  });

  it('should use default port and host if not set', async () => {
    process.env.USERS_BASE_URL = 'http://example.com';

    const config = new EnvConfiguration('test');

    await config.load();

    expect(config.getPort()).toBe(5050);
    expect(config.getHost()).toBe('127.0.0.1');
  });

  it('should support different environments', async () => {
    process.env.HOST = '192.168.0.1';
    process.env.PORT = '9000';

    const configDev = new EnvConfiguration('development');

    await configDev.load();

    expect(configDev.getHost()).toBe('192.168.0.1');
    expect(configDev.getPort()).toBe(9000);

    const configProd = new EnvConfiguration('production');

    process.env.HOST = '0.0.0.0';
    process.env.PORT = '8080';

    await configProd.load();
    expect(configProd.getHost()).toBe('0.0.0.0');
    expect(configProd.getPort()).toBe(8080);
  });
});
