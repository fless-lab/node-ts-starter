import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  db: {
    uri: string;
    name: string;
  };
  redis: {
    host: string;
    port: number;
  };
  minio: {
    endpoint: string;
    accessKey: string;
    secretKey: string;
  };
}

const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3300,
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'mydatabase',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    accessKey: process.env.MINIO_ACCESS_KEY || 'your-access-key',
    secretKey: process.env.MINIO_SECRET_KEY || 'your-secret-key',
  }
};

export default config;
