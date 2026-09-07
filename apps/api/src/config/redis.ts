import Redis from 'ioredis';
import { config } from './env';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  lazyConnect: true,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
});

redis.on('error', (err) => {
  if (config.env === 'development') {
    // Soft error logging for redis during local dev without breaking
    console.warn('Redis connection issue:', err.message);
  }
});

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    if (redis.status !== 'ready' && redis.status !== 'connecting') {
      await redis.connect();
    }
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch (error) {
    return false;
  }
};
