import Redis from 'ioredis';
import { config } from '../../../config';

let redisClient: Redis | null = null;

function init(): void {
  redisClient = new Redis({
    port: config.redis.port, // Redis port from config
    host: config.redis.host, // Redis host from config
  });

  redisClient.on('connect', () => {
    console.info('Client connected to Redis...');
  });

  redisClient.on('ready', () => {
    console.info('Client connected to Redis and ready to use...');
  });

  redisClient.on('error', (err) => {
    console.error(err.message);
  });

  redisClient.on('end', () => {
    console.warn('Client disconnected from Redis');
  });

  process.on('SIGINT', () => {
    console.log('On client quit');
    if (redisClient) {
      redisClient.quit();
    }
  });
}

function getClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call init() first.');
  }
  return redisClient;
}

async function close(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    console.warn('Redis connection is disconnected.');
  } else {
    console.warn('No Redis connection found to close.');
  }
}

export { init, getClient, close };
