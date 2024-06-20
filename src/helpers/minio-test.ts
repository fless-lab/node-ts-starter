import { init as initMinio, getClient } from '../framework/storage/minio/minio';

async function testMinioConnection(): Promise<void> {
  try {
    const client = initMinio();
    // Example of checking MinIO server status by listing buckets
    await client.listBuckets();
    console.info('MinIO is successfully connected and working.');
  } catch (error) {
    console.error('MinIO connection error:', error);
    throw error;
  }
}

export { testMinioConnection };
