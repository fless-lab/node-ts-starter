import { DB } from '../framework';

async function testRedisConnection(): Promise<void> {
  try {
    const redis = DB.redis;
    redis.init();
    const client = redis.getClient();
    await client.ping();
    console.info('Redis is successfully connected and working.');
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

export { testRedisConnection };
