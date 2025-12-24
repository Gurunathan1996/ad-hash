export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Shipment Tracking & User Management API',
            version: '1.0.0',
            description: 'API for managing shipments and users',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'integer', example: 200 },
                        code: { type: 'string', example: 'SUCCESS' },
                        data: { type: 'object' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'integer', example: 400 },
                        code: { type: 'string', example: 'ERROR' },
                        message: { type: 'string', example: 'Validation failed' }
                    }
                },
                ValidationErrorItem: {
                    type: 'object',
                    properties: {
                        field: { type: 'string', example: 'username' },
                        message: { type: 'string', example: 'Username is required' }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        status: { type: 'integer', example: 400 },
                        code: { type: 'string', example: 'VALIDATION_ERROR' },
                        message: { type: 'string', example: 'Validation failed' },
                        errors: { type: 'array', items: { $ref: '#/components/schemas/ValidationErrorItem' } }
                    }
                }
            },
            responses: {
                BadRequest: {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ValidationError' }
                        }
                    }
                },
                Unauthorized: {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: { status: 401, code: 'UNAUTHORIZED', message: 'Authentication required' }
                        }
                    }
                },
                Forbidden: {
                    description: 'Forbidden',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: { status: 403, code: 'FORBIDDEN', message: 'Insufficient permissions' }
                        }
                    }
                },
                NotFound: {
                    description: 'Not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: { status: 404, code: 'NOT_FOUND', message: 'Resource not found' }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};