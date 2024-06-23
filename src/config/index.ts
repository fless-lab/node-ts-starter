import dotenv from 'dotenv';

dotenv.config();

interface Config {
  runningProd: boolean;
  app: string;
  port: number;
  enableClientAuth: boolean;
  basicAuthUser: string;
  basicAuthPass: string;
  bcrypt: {
    saltRounds: number;
  };
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpireTime: string;
    refreshTokenExpireTime: string;
    tokenIssuer: string;
  };
  rate: {
    limit: number;
    max: number;
  };
  bruteForce: {
    freeRetries: number;
    minWait: number;
    maxWait: number;
    lifetime: number;
  };
  db: {
    uri: string;
    name: string;
    clientPort: number;
  };
  redis: {
    host: string;
    port: number;
    serverPort: number;
    tokenExpireTime: number;
    blacklistExpireTime: number;
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
  runningProd: process.env.NODE_ENV === 'production',
  app: process.env.APP_NAME || 'myapp',
  port: parseInt(process.env.PORT || '9095', 10),
  enableClientAuth: process.env.ENABLE_CLIENT_AUTH === 'true',
  basicAuthUser: process.env.BASIC_AUTH_USER || 'admin',
  basicAuthPass: process.env.BASIC_AUTH_PASS || 'secret',
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    accessTokenExpireTime: process.env.ACCESS_TOKEN_EXPIRE_TIME || '1h',
    refreshTokenExpireTime: process.env.REFRESH_TOKEN_EXPIRE_TIME || '7d',
    tokenIssuer: process.env.TOKEN_ISSUER || 'your-issuer',
  },
  rate: {
    limit: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes in milliseconds
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  bruteForce: {
    freeRetries: parseInt(process.env.BRUTE_FORCE_FREE_RETRIES || '5', 10),
    minWait: parseInt(process.env.BRUTE_FORCE_MIN_WAIT || '300000', 10), // 5 minutes
    maxWait: parseInt(process.env.BRUTE_FORCE_MAX_WAIT || '3600000', 10), // 1 hour
    lifetime: parseInt(process.env.BRUTE_FORCE_LIFETIME || '86400', 10), // 1 day in seconds
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'mydatabase',
    clientPort: parseInt(process.env.MONGO_CLIENT_PORT || '9005', 10),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    serverPort: parseInt(process.env.REDIS_SERVER_PORT || '9079', 10),
    tokenExpireTime: parseInt(
      process.env.REDIS_TOKEN_EXPIRE_TIME || '31536000',
      10,
    ), // 1 year in seconds
    blacklistExpireTime: parseInt(
      process.env.REDIS_BLACKLIST_EXPIRE_TIME || '2592000',
      10,
    ), // 1 month in seconds
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
