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
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID || '',
  EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID || '',
  EMAILJS_USER_ID: process.env.EMAILJS_USER_ID || '',
  EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY || '',
  CLOUD_PROVIDER: process.env.CLOUD_PROVIDER || 'local',
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
