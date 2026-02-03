import express from 'express';
import morgan from 'morgan';

import 'express-async-errors';

import type { Application } from 'express';

import cartRouter from './api/cart/index.js';
import Configuration from './Configuration.js';
import errorHandler from './api/middlewares/errorHandler.js';
import type { ApiDocumentation } from './lib/documentation/index.js';
import type { Database } from './core/database/Database.js';
import type { Reporter } from './lib/errorReporter/index.js';

class Backend {
  protected app: Application;
  private config: Configuration;
  private database: Database;
  private documentation: ApiDocumentation;

  constructor(
    config: Configuration,
    database: Database,
    errorReporter: Reporter,
    documentation: ApiDocumentation
  ) {
    this.config = config;
    this.database = database;
    this.documentation = documentation;

    this.app = express();

    this.app.set('database', database);
    this.app.set('errorReporter', errorReporter);

    this.initializeLogs();
    this.initializeMiddlewares();
    this.initializeDocumentation();
    this.initializeRoutes();
    this.initializeErrorHandler();
  }

  getExpressApp(): Application {
    return this.app;
  }

  async start(): Promise<void> {
    const port = this.config.getPort();
    const host = this.config.getHost();

    return new Promise((resolve, reject) => {
      this.app.listen(port, host, (error: Error) => error ? reject(error) : resolve());
    });
  }

  protected initializeLogs(): void {
    this.app.use(morgan('dev'));
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
  }

  private initializeDocumentation(): void {
    this.documentation.setup(this.app);
  }

  private initializeRoutes(): void {
    this.app.use('/api/v1/carts', cartRouter);
  }

  private initializeErrorHandler(): void {
    this.app.use(errorHandler);
  }
}

export default Backend;
