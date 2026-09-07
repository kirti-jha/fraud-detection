import app from './app';
import { config } from './config/env';
import { checkDatabaseHealth } from './config/database';
import { checkRedisHealth } from './config/redis';

const startServer = async () => {
  try {
    console.log(`Starting FraudShield API Server in ${config.env} mode...`);

    const isDbConnected = await checkDatabaseHealth();
    if (isDbConnected) {
      console.log('✓ Connected to PostgreSQL Database');
    } else {
      console.warn('⚠ Could not establish initial connection to PostgreSQL');
    }

    const isRedisConnected = await checkRedisHealth();
    if (isRedisConnected) {
      console.log('✓ Connected to Redis Cache');
    } else {
      console.warn('⚠ Redis connection unavailable (will fallback gracefully)');
    }

    app.listen(config.port, () => {
      console.log(`🚀 FraudShield API running on http://localhost:${config.port}${config.apiPrefix}`);
      console.log(`🏥 Health Endpoint: http://localhost:${config.port}${config.apiPrefix}/health`);
    });
  } catch (error) {
    console.error('Fatal Server Initialization Error:', error);
    process.exit(1);
  }
};

startServer();
