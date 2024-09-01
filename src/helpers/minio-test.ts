import { logger } from '../common/shared';
import { S3 } from '../core/framework';

async function testMinioConnection(): Promise<void> {
  try {
    const client = S3.minio.init();
    // Example of checking MinIO server status by listing buckets
    await client.listBuckets();
    logger.info('MinIO is successfully connected and working.');
  } catch (error) {
    logger.error('MinIO connection error:', error as Error);
    throw error;
  }
}

export { testMinioConnection };
