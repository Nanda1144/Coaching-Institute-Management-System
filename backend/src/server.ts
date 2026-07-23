import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase, isDatabaseConnected } from './config/database';

// Global error handlers — never crash the process
process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Server] Unhandled Rejection caught:', reason instanceof Error ? reason.message : reason);
});

process.on('uncaughtException', (err: Error) => {
  console.error('[Server] Uncaught Exception caught:', err.message);
});

async function startServer(): Promise<void> {
  const server = app.listen(env.PORT, () => {
    console.log(`[Server] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // Attempt database connection in background — don't block server start
  // If DB is down, the health check system will keep retrying
  connectDatabase()
    .then(() => {
      console.log('[Server] Initial database connection established');
    })
    .catch((err: Error) => {
      console.error('[Server] Initial database connection failed (server still running):', err.message);
      console.error('[Server] Health check system will retry connection automatically.');

      // Helpful diagnostic
      const url = env.DIRECT_URL.replace(/\/\/[^:]+:[^@]+@/, '//USER:PASSWORD@');
      console.error('[Server] Check that:');
      console.error('  1. Supabase project is NOT paused — visit https://supabase.com/dashboard');
      console.error('  2. Your network can reach Supabase (no firewall/VPN blocking)');
      console.error(`  3. Connection string is correct: ${url}`);
    });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('[Server] HTTP server closed');
      await disconnectDatabase();
      process.exit(0);
    });

    // Force exit after 10s if graceful shutdown fails
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
