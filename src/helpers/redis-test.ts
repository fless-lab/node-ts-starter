import {
  init as initRedis,
  getClient,
} from '../framework/database/redis/redis';

async function testRedisConnection(): Promise<void> {
  try {
    initRedis();
    const client = getClient();
    await client.ping();
    console.info('Redis is successfully connected and working.');
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

export { testRedisConnection };
