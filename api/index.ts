import app from '../backend/src/app';

console.log('[API] Serverless function loaded');
console.log('[API] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING');
console.log('[API] JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING');
console.log('[API] JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'SET' : 'MISSING');
console.log('[API] CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('[API] NODE_ENV:', process.env.NODE_ENV);

export default app;
