export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'FraudShield API — Real-Time Risk & Fraud Engine',
    version: '1.0.0',
    description:
      'Production-grade RESTful API for real-time transaction ingestion, rule evaluation, velocity signals, alert case management, and analyst workflow.',
    contact: {
      name: 'FraudShield Engineering Team',
      email: 'support@fraudshield.io',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1',
      description: 'Local Development Environment',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT token obtained from POST /auth/login',
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Merchant API Key for transaction ingestion',
      },
    },
    schemas: {
      TransactionInput: {
        type: 'object',
        required: ['userId', 'amount', 'deviceId', 'ipAddress'],
        properties: {
          userId: { type: 'string', format: 'uuid', example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' },
          amount: { type: 'number', example: 85000 },
          currency: { type: 'string', example: 'INR', default: 'INR' },
          deviceId: { type: 'string', example: 'DEV_991_SUSPICIOUS' },
          ipAddress: { type: 'string', example: '103.44.12.99' },
          location: { type: 'string', example: 'Mumbai' },
          merchantCategory: { type: 'string', example: 'ECOMMERCE' },
          idempotencyKey: { type: 'string', example: 'IDEM_9918237482' },
        },
      },
      TransactionResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          transactionRef: { type: 'string', example: 'TXN_1725458100_9912' },
          amount: { type: 'number', example: 85000 },
          currency: { type: 'string', example: 'INR' },
          status: { type: 'string', example: 'REVIEW' },
          riskScore: { type: 'integer', example: 75 },
          decision: { type: 'string', example: 'REVIEW' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'System Health Check',
        description: 'Returns operational status of PostgreSQL database and Redis cache.',
        responses: {
          '200': { description: 'System healthy' },
          '503': { description: 'Degraded infrastructure' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'User / Analyst Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'analyst@fraudshield.io' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful with JWT access token & refresh token' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/transactions': {
      post: {
        summary: 'Submit Transaction for Real-Time Risk Scoring',
        security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
        parameters: [
          {
            in: 'header',
            name: 'X-Idempotency-Key',
            schema: { type: 'string' },
            required: false,
            description: 'Idempotency key to prevent duplicate execution',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TransactionInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Transaction processed and risk score assigned' },
          '400': { description: 'Validation error' },
        },
      },
      get: {
        summary: 'List Ledger Transactions',
        security: [{ BearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'status', schema: { type: 'string' } },
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': { description: 'Paginated list of transactions' },
        },
      },
    },
  },
};
