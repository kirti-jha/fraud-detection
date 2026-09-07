import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { openApiSpec } from './config/swagger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';

const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(apiRateLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Logging
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));

// Routes
app.use(config.apiPrefix, routes);

// OpenAPI Spec Endpoint
app.get(`${config.apiPrefix}/docs`, (_req, res) => {
  res.json(openApiSpec);
});

// 404 Fallback
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
