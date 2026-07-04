// src/config/swagger.js
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], // where your APIs are
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };