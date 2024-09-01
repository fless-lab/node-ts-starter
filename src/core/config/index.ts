import dotenv from 'dotenv';

dotenv.config();

interface Config {
  runningProd: boolean;
  app: string;
  port: number;
  enableClientAuth: boolean;
  basicAuthUser: string;
  basicAuthPass: string;
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
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    fromName: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  session: {
    secret: string;
  };
  viewEngines: string[];
  defaultViewEngine: string;
  otp: {
    length: number;
    expiration: number;
    purposes: Record<
      string,
      { code: string; title: string; description: string; message: string }
    >;
  };
}

export const config: Config = {
  runningProd: process.env.NODE_ENV === 'production',
  app: process.env.APP_NAME || 'myapp',
  port: parseInt(process.env.PORT || '9095', 10),
  enableClientAuth: process.env.ENABLE_CLIENT_AUTH === 'true',
  basicAuthUser: process.env.BASIC_AUTH_USER || 'admin',
  basicAuthPass: process.env.BASIC_AUTH_PASS || 'secret',
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
    ),
    blacklistExpireTime: parseInt(
      process.env.REDIS_BLACKLIST_EXPIRE_TIME || '2592000',
      10,
    ),
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio-access-key',
    secretKey: process.env.MINIO_SECRET_KEY || 'minio-secret-key',
    apiPort: parseInt(process.env.MINIO_API_PORT || '9500', 10),
    consolePort: parseInt(process.env.MINIO_CONSOLE_PORT || '9050', 10),
  },
  mail: {
    host:
      process.env.NODE_ENV === 'production'
        ? process.env.SMTP_HOST || ''
        : process.env.MAILDEV_HOST || 'localhost',
    port: parseInt(
      process.env.NODE_ENV === 'production'
        ? process.env.SMTP_PORT || '587'
        : process.env.MAILDEV_PORT || '1025',
      10,
    ),
    user:
      process.env.NODE_ENV === 'production' ? process.env.SMTP_USER || '' : '',
    pass:
      process.env.NODE_ENV === 'production' ? process.env.SMTP_PASS || '' : '',
    from: process.env.FROM_EMAIL || 'no-reply@myapp.com',
    fromName: process.env.FROM_NAME || 'Your Service Name',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
  },
  viewEngines: ['ejs', 'pug', 'handlebars', 'nunjucks'], // Supported view engines
  defaultViewEngine: process.env.VIEW_ENGINE || 'ejs',
  otp: {
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
    expiration: parseInt(process.env.OTP_EXPIRATION || '5') * 60 * 1000,
    purposes: {
      ACCOUNT_VERIFICATION: {
        code: 'ACCOUNT_VERIFICATION',
        title: 'Account Verification OTP',
        description: 'Verify your account',
        message: 'Your OTP code for account verification is:',
      },
      FORGOT_PASSWORD: {
        code: 'FORGOT_PASSWORD',
        title: 'Password Reset OTP',
        description: 'Reset your password',
        message: 'Your OTP code for resetting your password is:',
      },
      TWO_FACTOR_AUTHENTICATION: {
        code: 'TWO_FACTOR_AUTHENTICATION',
        title: 'Two-Factor Authentication OTP',
        description: 'Two-factor authentication',
        message: 'Your OTP code for two-factor authentication is:',
      },
      EMAIL_UPDATE: {
        code: 'EMAIL_UPDATE',
        title: 'Email Update OTP',
        description: 'Update your email address',
        message: 'Your OTP code for updating your email address is:',
      },
      PHONE_VERIFICATION: {
        code: 'PHONE_VERIFICATION',
        title: 'Phone Verification OTP',
        description: 'Verify your phone number',
        message: 'Your OTP code for phone verification is:',
      },
      TRANSACTION_CONFIRMATION: {
        code: 'TRANSACTION_CONFIRMATION',
        title: 'Transaction Confirmation OTP',
        description: 'Confirm your transaction',
        message: 'Your OTP code for transaction confirmation is:',
      },
      ACCOUNT_RECOVERY: {
        code: 'ACCOUNT_RECOVERY',
        title: 'Account Recovery OTP',
        description: 'Recover your account',
        message: 'Your OTP code for account recovery is:',
      },
      CHANGE_SECURITY_SETTINGS: {
        code: 'CHANGE_SECURITY_SETTINGS',
        title: 'Security Settings Change OTP',
        description: 'Change your security settings',
        message: 'Your OTP code for changing security settings is:',
      },
      LOGIN_CONFIRMATION: {
        code: 'LOGIN_CONFIRMATION',
        title: 'Login Confirmation OTP',
        description: 'Confirm your login',
        message: 'Your OTP code for login confirmation is:',
      },
    },
  },
};
