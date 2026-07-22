import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';

// Global error handlers — never crash the process
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection caught (server continues):', reason instanceof Error ? reason.message : reason);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception caught (server continues):', err.message);
});

async function startServer(): Promise<void> {
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // Attempt database connection in background — don't block server start
  // If DB is down, the health check system will keep retrying
  connectDatabase()
    .then(() => {
      console.log('Initial database connection established');
    })
    .catch((err: Error) => {
      console.error('Initial database connection failed (server still running):', err.message);
      console.error('Health check system will retry connection automatically.');
    });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed');
      await disconnectDatabase();
      process.exit(0);
    });

    // Force exit after 10s if graceful shutdown fails
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
