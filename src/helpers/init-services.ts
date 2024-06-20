import { testDatabaseConnection } from './db-connection-test';
import { testRedisConnection } from './redis-test';
import { testMinioConnection } from './minio-test';

async function initServices(): Promise<void> {
  await testDatabaseConnection();
  await testRedisConnection();
  await testMinioConnection();
}

export { initServices };
