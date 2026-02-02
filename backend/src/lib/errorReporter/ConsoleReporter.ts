import type { Reporter } from './Reporter.js';

class ConsoleReporter implements Reporter {
  send(error: Error): void {
    /* eslint-disable-next-line no-console */
    console.error(error);
  }
}

export default ConsoleReporter;
