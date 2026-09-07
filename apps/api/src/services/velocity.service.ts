import { redis } from '../config/redis';

export class VelocityService {
  /**
   * Tracks a transaction attempt in Redis sliding window for a given user.
   * Window size is in seconds (e.g., 300s = 5 minutes).
   */
  static async recordAndCheckVelocity(
    userId: string,
    amount: number,
    windowSeconds: number = 300
  ): Promise<{ count: number; totalAmount: number }> {
    try {
      const now = Date.now();
      const cutoff = now - windowSeconds * 1000;
      const key = `velocity:user:${userId}:${windowSeconds}s`;

      const pipeline = redis.pipeline();
      // Remove elements older than cutoff
      pipeline.zremrangebyscore(key, 0, cutoff);
      // Add current transaction record score=timestamp, member=timestamp:amount:random
      const member = `${now}:${amount}:${Math.random().toString(36).substring(7)}`;
      pipeline.zadd(key, now, member);
      // Get count of remaining transactions in sliding window
      pipeline.zcard(key);
      // Get all members to compute aggregate sum
      pipeline.zrange(key, 0, -1);
      // Set key TTL to expire automatically if inactive
      pipeline.expire(key, windowSeconds * 2);

      const results = await pipeline.exec();
      if (!results) {
        return { count: 1, totalAmount: amount };
      }

      const count = (results[2][1] as number) || 1;
      const members = (results[3][1] as string[]) || [];

      let totalAmount = 0;
      for (const m of members) {
        const parts = m.split(':');
        if (parts[1]) {
          totalAmount += parseFloat(parts[1]);
        }
      }

      return { count, totalAmount };
    } catch (error) {
      console.warn('Redis velocity check fallback (connection error):', error);
      return { count: 1, totalAmount: amount };
    }
  }
}
