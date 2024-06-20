import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  enableClientAuth: boolean;
  basicAuthUser: string;
  basicAuthPass: string;
  db: {
    uri: string;
    name: string;
    clientPort: number;
  };
  redis: {
    host: string;
    port: number;
    serverPort: number;
  };
  minio: {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    apiPort: number;
    consolePort: number;
  };
  maildev: {
    host: string;
    port: number;
    smtpPort: number;
    webappPort: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '9095', 10),
  enableClientAuth: process.env.ENABLE_CLIENT_AUTH === 'true',
  basicAuthUser: process.env.BASIC_AUTH_USER || 'admin',
  basicAuthPass: process.env.BASIC_AUTH_PASS || 'secret',
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'mydatabase',
    clientPort: parseInt(process.env.MONGO_CLIENT_PORT || '9005', 10),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    serverPort: parseInt(process.env.REDIS_SERVER_PORT || '9079', 10),
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio-access-key',
    secretKey: process.env.MINIO_SECRET_KEY || 'minio-secret-key',
    apiPort: parseInt(process.env.MINIO_API_PORT || '9500', 10),
    consolePort: parseInt(process.env.MINIO_CONSOLE_PORT || '9050', 10),
  },
  maildev: {
    host: process.env.MAILDEV_HOST || 'localhost',
    port: parseInt(process.env.MAILDEV_PORT || '1025', 10),
    smtpPort: parseInt(process.env.MAILDEV_SMTP || '9025', 10),
    webappPort: parseInt(process.env.MAILDEV_WEBAPP_PORT || '9080', 10),
  },
};

export default config;
