import type { Application } from 'express';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import ApiDocumentation from './ApiDocumentation.js';

class SwaggerDocumentation implements ApiDocumentation {
  private swaggerSpec: object;

  constructor() {
    const options: swaggerJSDoc.Options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'My API',
          version: '1.0.0',
          description: 'Auto-generated API documentation'
        }
      },
      apis: ['./src/api/**/*.ts']
    };

    this.swaggerSpec = swaggerJSDoc(options);
  }

  setup(app: Application): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
  }
}

export default SwaggerDocumentation;
