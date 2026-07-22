import { Pool, PoolClient, QueryResult } from 'pg';
import { env } from './env';

const MAX_RETRIES = 10;
const RETRY_BASE_DELAY_MS = 2000;
const HEALTH_CHECK_INTERVAL_MS = 30000;
const RECONNECT_DELAY_MS = 5000;

class Database {
  private static instance: Database | null = null;
  private _pool: Pool;
  private _client: PoolClient | null = null;
  private _isConnected: boolean = false;
  private _healthCheckTimer: ReturnType<typeof setInterval> | null = null;
  private _reconnecting: boolean = false;

  private constructor() {
    this._pool = new Pool({
      connectionString: env.DIRECT_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED },
    });

    this._pool.on('error', (err) => {
      console.error('Unexpected pool error:', err.message);
      this._isConnected = false;
    });
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  get pool(): Pool {
    return this._pool;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  async connect(): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        this._client = await this._pool.connect();
        this._isConnected = true;
        this._reconnecting = false;
        this._startHealthCheck();
        console.log(`Database connected successfully (attempt ${attempt})`);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const delay = Math.min(RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1), 30000);
        console.error(
          `Database connection attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}. ` +
          `Retrying in ${delay}ms...`
        );

        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this._isConnected = false;
    console.error(`All ${MAX_RETRIES} database connection attempts failed. Last error: ${lastError?.message}`);
    throw lastError || new Error('Database connection failed after all retries');
  }

  async disconnect(): Promise<void> {
    this._stopHealthCheck();
    try {
      if (this._client) {
        this._client.release();
        this._client = null;
      }
      await this._pool.end();
      this._isConnected = false;
      console.log('Database disconnected successfully');
    } catch (err) {
      console.error('Error during database disconnection:', err);
    }
  }

  private _startHealthCheck(): void {
    this._stopHealthCheck();
    this._healthCheckTimer = setInterval(async () => {
      try {
        await this._pool.query('SELECT 1');
        if (!this._isConnected) {
          this._isConnected = true;
          this._reconnecting = false;
          console.log('Database connection restored');
        }
      } catch {
        this._isConnected = false;
        console.error('Database health check failed — connection lost');
        this._attemptReconnection();
      }
    }, HEALTH_CHECK_INTERVAL_MS);
  }

  private _stopHealthCheck(): void {
    if (this._healthCheckTimer) {
      clearInterval(this._healthCheckTimer);
      this._healthCheckTimer = null;
    }
  }

  private async _attemptReconnection(): Promise<void> {
    if (this._reconnecting) return;
    this._reconnecting = true;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this._pool.end();
      } catch {
        // ignore close errors
      }

      try {
        this._pool = new Pool({
          connectionString: env.DIRECT_URL,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
          ssl: { rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED },
        });
        this._client = await this._pool.connect();
        this._isConnected = true;
        this._reconnecting = false;
        this._startHealthCheck();
        console.log(`Database reconnected after ${attempt} attempt(s)`);
        return;
      } catch (err) {
        const delay = Math.min(RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1), 30000);
        console.error(
          `Reconnection attempt ${attempt}/${MAX_RETRIES} failed: ` +
          `${err instanceof Error ? err.message : String(err)}. Retrying in ${delay}ms...`
        );
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this._reconnecting = false;
    console.error('All reconnection attempts exhausted. Will retry on next health check.');
  }

  async healthCheck(): Promise<{ status: string; latency: number }> {
    const start = Date.now();
    try {
      await this._pool.query('SELECT 1');
      return { status: this._isConnected ? 'connected' : 'degraded', latency: Date.now() - start };
    } catch {
      return { status: 'disconnected', latency: Date.now() - start };
    }
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this._pool.query(text, params);
  }
}

const db = Database.getInstance();
export const pool = db.pool;
export const query = (text: string, params?: any[]) => db.query(text, params);
export const connectDatabase = () => db.connect();
export const disconnectDatabase = () => db.disconnect();
export const getDatabaseHealth = () => db.healthCheck();
export const isDatabaseConnected = () => db.isConnected;
