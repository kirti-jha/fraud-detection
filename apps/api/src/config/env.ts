import dotenv from 'dotenv';
import path from 'path';

// Load .env from workspace root if exists, otherwise default envs
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-fraudshield',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret-key-fraudshield',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'fraudshield',
    password: process.env.POSTGRES_PASSWORD || 'fraudshield_pass',
    database: process.env.POSTGRES_DB || 'fraudshield_db',
    url: process.env.DATABASE_URL || 'postgresql://fraudshield:fraudshield_pass@localhost:5432/fraudshield_db',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  mlService: {
    url: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};
