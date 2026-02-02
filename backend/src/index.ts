import Backend from './Backend.js';
import EnvConfiguration from './EnvConfiguration.js';
// import prisma from './infrastructure/prisma/prismaClient.js';
import MemoryDatabase from './database/memoryRepositories/MemoryDatabase.js';
import { SwaggerDocumentation } from './lib/documentation/index.js';
import { ConsoleReporter } from './lib/errorReporter/index.js';

const environments = ['development', 'production', 'test'] as const;

type Enviroment = typeof environments[number];

const env = environments.includes(
  process.env.NODE_ENV as Enviroment
)
  ? (process.env.NODE_ENV as Enviroment)
  : 'development';

const config = new EnvConfiguration(env);
const database = new MemoryDatabase();
const documentation = new SwaggerDocumentation();
const errorReporter = new ConsoleReporter();

/* eslint-disable no-console */
config.load()
  .then(() => {
    const app = new Backend(config, database, errorReporter, documentation);

    return app.start();
  })
  .then(() => {
    console.log(`\nServer is running in ${config.getHost()}:${config.getPort()}...`);
  });
