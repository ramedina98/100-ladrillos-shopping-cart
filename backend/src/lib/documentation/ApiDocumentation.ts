import type { Application } from 'express';

interface ApiDocumentation {
  setup(app: Application): void;
}

export default ApiDocumentation;
