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
    apiPort: number;
    consolePort: number;
    accessKey: string;
    secretKey: string;
  };
  maildev: {
    host: string;
    port: number;
  };
}

const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3300,
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'mydatabase',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    apiPort: process.env.MINIO_API_PORT
      ? parseInt(process.env.MINIO_API_PORT, 10)
      : 9000,
    consolePort: process.env.MINIO_CONSOLE_PORT
      ? parseInt(process.env.MINIO_CONSOLE_PORT, 10)
      : 9001,
    accessKey: process.env.MINIO_ACCESS_KEY || 'your-access-key',
    secretKey: process.env.MINIO_SECRET_KEY || 'your-secret-key',
  },
  maildev: {
    host: process.env.MAILDEV_HOST || 'localhost',
    port: process.env.MAILDEV_PORT
      ? parseInt(process.env.MAILDEV_PORT, 10)
      : 1025,
  },
};

export default config;
