import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requireEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  DIRECT_URL: process.env.DIRECT_URL || requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '500', 10),
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'dev-cookie-secret-change-in-production',
  DB_SSL_REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
  SKIP_AUTH: process.env.SKIP_AUTH || 'false',
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || 'noreply@ciiims.edu',
  BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || 'CIMS',
  CLOUD_PROVIDER: process.env.CLOUD_PROVIDER || 'local',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  PHONEPE_MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || '',
  PHONEPE_SALT_KEY: process.env.PHONEPE_SALT_KEY || '',
  PHONEPE_SALT_INDEX: process.env.PHONEPE_SALT_INDEX || '1',
  PHONEPE_BASE_URL: process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/hermes',
} as const;

if (env.NODE_ENV === 'production') {
  const defaults = ['super-secret-key-change-in-production', 'refresh-secret-key-change-in-production'];
  if (defaults.includes(env.JWT_SECRET) || defaults.includes(env.JWT_REFRESH_SECRET) || env.COOKIE_SECRET === 'dev-cookie-secret-change-in-production') {
    throw new Error('Default secrets detected in production. Set JWT_SECRET, JWT_REFRESH_SECRET, and COOKIE_SECRET in .env');
  }
  if (env.SKIP_AUTH === 'true') {
    throw new Error('SKIP_AUTH must not be enabled in production');
  }
}
