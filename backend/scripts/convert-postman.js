const p2o = require('postman-to-openapi');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const inputPath = path.join(__dirname, '../../docs/CanAccesible_Postman_Collection.json');
const outputPath = path.join(__dirname, '../../docs/swagger.json');

// Options for the conversion
const options = {
    defaultTag: 'General',
    servers: [
        {
            url: 'http://localhost:85/api',
            description: 'Development server'
        },
        {
            url: 'https://canaccesible.es/api',
            description: 'Production server'
        }
    ]
};

async function convert() {
    try {
        console.log(`Converting ${inputPath} to ${outputPath}...`);
        // Get YAML string first
        const result = await p2o(inputPath, null, options);
        
        // Convert YAML to JSON object
        let doc = yaml.load(result);

        // Add authentication instructions to the description
        const authInstructions = "\n\nFor endpoints protected by JWT, users must sign in using POST /auth/signin, copy the token from the response, and paste it in the Authorize button.";
        doc.info.description = (doc.info.description || "") + authInstructions;

        // Remove global security
        delete doc.security;
        
        // Setup apiKey security scheme for JWT
        doc.components = doc.components || {};
        doc.components.securitySchemes = {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'JWT Token. Just paste your token here (without Bearer prefix).'
            }
        };

        // 2. Fix Paths and Parameters
        const newPaths = {};
        for (const [pathKey, pathItem] of Object.entries(doc.paths)) {
            // Replace :param with {param}
            let newPathKey = pathKey.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
            
            // Process each method (get, post, put, delete, etc.)
            for (const [method, operation] of Object.entries(pathItem)) {
                // Fix Authentication
                if (operation.parameters) {
                    // Remove manual Authorization header
                    operation.parameters = operation.parameters.filter(p => p.name !== 'Authorization');
                }

                // Add Security Requirement
                if (pathKey.includes('/auth/signin')) {
                    // Remove basicAuth security scheme
                    delete operation.security;
                    
                    // Remove any manual Authorization parameter if it exists
                    operation.parameters = operation.parameters || [];
                    operation.parameters = operation.parameters.filter(p => p.name !== 'Authorization');

                    // Add Request Body for Email/Password
                    operation.requestBody = {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string', example: 'usuario@ejemplo.com' },
                                        password: { type: 'string', example: 'password123' }
                                    },
                                    required: ['email', 'password']
                                }
                            },
                            'application/x-www-form-urlencoded': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string', example: 'usuario@ejemplo.com' },
                                        password: { type: 'string', example: 'password123' }
                                    },
                                    required: ['email', 'password']
                                }
                            }
                        }
                    };
                } else {
                    // Remove global security requirement
                    delete operation.security;

                    // Logic to determine if Authorization header is needed
                    let needsAuth = true;

                    // 1. Public Endpoints (No Auth needed)
                    if (
                        (newPathKey === '/auth/logout') ||
                        (newPathKey === '/auth/signup') ||
                        (newPathKey === '/auth/forgot-password') ||
                        (newPathKey === '/incidents' && method === 'get') ||
                        (newPathKey === '/incidents/{id}' && method === 'get') ||
                        (newPathKey.startsWith('/incident-comments') && method === 'get') ||
                        (newPathKey.startsWith('/incidentFollows') && method === 'get') ||
                        (newPathKey.startsWith('/incidentLikes') && method === 'get') ||
                        (newPathKey === '/users' && method === 'post')
                    ) {
                        needsAuth = false;
                    }

                    // 2. Session-Only Endpoints (Cookies used, No Token needed)
                    if (
                        newPathKey.startsWith('/blogArticles') ||
                        newPathKey.startsWith('/logs')
                    ) {
                        needsAuth = false;
                    }

                    // Add security requirement if needed (uses apiKey scheme)
                    if (needsAuth) {
                        operation.parameters = operation.parameters || [];
                        // Remove any existing Authorization parameter to avoid duplicates/conflicts
                        operation.parameters = operation.parameters.filter(p => p.name !== 'Authorization');

                        // Use security scheme instead of manual parameter
                        operation.security = [{ ApiKeyAuth: [] }];
                    }
                }

                // Add Path Parameters if missing
                const pathParams = newPathKey.match(/\{([a-zA-Z0-9_]+)\}/g);
                if (pathParams) {
                    operation.parameters = operation.parameters || [];
                    pathParams.forEach(param => {
                        const paramName = param.replace(/[{}]/g, '');
                        // Check if param already exists
                        const exists = operation.parameters.find(p => p.name === paramName && p.in === 'path');
                        if (!exists) {
                            operation.parameters.push({
                                name: paramName,
                                in: 'path',
                                required: true,
                                schema: { type: 'string' },
                                description: `The ${paramName}`
                            });
                        }
                    });
                }

                // 3. Inject Missing Request Bodies (Manual Fixes)
                if (method === 'post' || method === 'put') {
                    if (!operation.requestBody) {
                        // Default generic body if none exists
                        operation.requestBody = {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {},
                                        description: 'Request body'
                                    }
                                }
                            }
                        };
                    }

                    // Specific bodies for known endpoints
                    if (newPathKey === '/users' && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'multipart/form-data': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            firstName: { type: 'string' },
                                            lastName: { type: 'string' },
                                            email: { type: 'string' },
                                            password: { type: 'string', format: 'password' },
                                            roleId: { type: 'integer' },
                                            image: { type: 'string', format: 'binary' }
                                        },
                                        required: ['firstName', 'lastName', 'email', 'password', 'roleId']
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/users/{id}' && method === 'put') {
                        operation.requestBody = {
                            content: {
                                'multipart/form-data': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            firstName: { type: 'string' },
                                            lastName: { type: 'string' },
                                            email: { type: 'string' },
                                            roleId: { type: 'integer' },
                                            image: { type: 'string', format: 'binary' }
                                        }
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/incidents' && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'multipart/form-data': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            title: { type: 'string' },
                                            description: { type: 'string' },
                                            latitude: { type: 'number' },
                                            longitude: { type: 'number' },
                                            typeId: { type: 'integer' },
                                            image: { type: 'string', format: 'binary' }
                                        },
                                        required: ['title', 'description', 'latitude', 'longitude', 'typeId', 'image']
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/incidents/{id}' && method === 'put') {
                        operation.requestBody = {
                            content: {
                                'multipart/form-data': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            title: { type: 'string' },
                                            description: { type: 'string' },
                                            statusId: { type: 'integer' },
                                            image: { type: 'string', format: 'binary' }
                                        }
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/logs' && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            userId: { type: 'integer' },
                                            action: { type: 'string' },
                                            entity: { type: 'string' },
                                            entityId: { type: 'integer' }
                                        },
                                        required: ['userId', 'action', 'entity', 'entityId']
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/incident-comments' && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'application/x-www-form-urlencoded': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            incidentId: { type: 'integer' },
                                            comment: { type: 'string' }
                                        },
                                        required: ['incidentId', 'comment']
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/conversations' && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            type: { type: 'string', example: 'individual' }
                                        },
                                        required: ['type']
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey.startsWith('/conversationMessages') && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string' },
                                            dateMessage: { type: 'string', format: 'date-time' }
                                        },
                                        required: ['message', 'dateMessage']
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/incidentLikes' && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'application/x-www-form-urlencoded': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            incidentId: { type: 'integer' }
                                        },
                                        required: ['incidentId']
                                    }
                                }
                            }
                        };
                    }
                    if (newPathKey === '/incidentFollows' && method === 'post') {
                        operation.requestBody = {
                            content: {
                                'application/x-www-form-urlencoded': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            incidentId: { type: 'integer' }
                                        },
                                        required: ['incidentId']
                                    }
                                }
                            }
                        };
                    }
                }
            }
            newPaths[newPathKey] = pathItem;
        }
        doc.paths = newPaths;

        // Write JSON file
        fs.writeFileSync(outputPath, JSON.stringify(doc, null, 2));
        console.log('Conversion completed successfully!');
    } catch (err) {
        console.error('Error during conversion:', err);
    }
}

convert();
