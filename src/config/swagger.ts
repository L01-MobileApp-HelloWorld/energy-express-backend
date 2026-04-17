import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Energy Express Backend API',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes/*.ts']
};
