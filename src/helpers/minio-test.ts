import { S3 } from '../framework';

async function testMinioConnection(): Promise<void> {
  try {
    const client = S3.minio.init();
    // Example of checking MinIO server status by listing buckets
    await client.listBuckets();
    console.info('MinIO is successfully connected and working.');
  } catch (error) {
    console.error('MinIO connection error:', error);
    throw error;
  }
}

export { testMinioConnection };
