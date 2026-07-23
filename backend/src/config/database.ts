import { Pool, PoolClient, QueryResult } from 'pg';
import { env } from './env';
import { lookup } from 'dns/promises';

const MAX_RETRIES = 10;
const RETRY_BASE_DELAY_MS = 4000;
const HEALTH_CHECK_INTERVAL_MS = 30000;
const RECONNECT_DELAY_MS = 5000;

function maskConnectionString(cs: string): string {
  try {
    return cs.replace(/\/\/[^:]+:[^@]+@/, '//USER:PASSWORD@');
  } catch {
    return cs;
  }
}

class Database {
  private static instance: Database | null = null;
  private _pool: Pool;
  private _client: PoolClient | null = null;
  private _isConnected: boolean = false;
  private _healthCheckTimer: ReturnType<typeof setInterval> | null = null;
  private _reconnecting: boolean = false;

  private constructor() {
    const poolConfig: import('pg').PoolConfig = {
      connectionString: env.DIRECT_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      ssl: env.DB_SSL_REJECT_UNAUTHORIZED
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false },
    };
    this._pool = new Pool(poolConfig);

    this._pool.on('error', (err) => {
      console.error('[DB] Unexpected pool error:', err.message);
      this._isConnected = false;
    });

    console.log('[DB] Pool created:', maskConnectionString(env.DIRECT_URL));
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

  private async _resolveHostname(): Promise<boolean> {
    try {
      const url = new URL(env.DIRECT_URL);
      const addresses = await lookup(url.hostname);
      console.log(`[DB] DNS resolved ${url.hostname} -> ${addresses.address}`);
      return true;
    } catch (err) {
      console.error(`[DB] DNS resolution failed: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }

  async connect(): Promise<void> {
    let lastError: Error | null = null;

    const dnsOk = await this._resolveHostname();
    if (!dnsOk) {
      console.warn('[DB] DNS resolution failed — the Supabase host may be unreachable from this network.');
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        this._client = await this._pool.connect();
        this._isConnected = true;
        this._reconnecting = false;
        this._startHealthCheck();
        console.log(`[DB] Connected successfully (attempt ${attempt})`);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const delay = Math.min(RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1), 30000);

        const msg = lastError.message;
        let hint = '';
        if (msg.includes('timeout')) {
          hint = ' — check firewall/VPN, or the Supabase DB may be paused (reactivate at supabase.com/dashboard)';
        } else if (msg.includes('ECONNREFUSED')) {
          hint = ' — connection refused, check if the DB host/port is correct and whitelisted';
        } else if (msg.includes('ENOTFOUND')) {
          hint = ' — DNS lookup failed, check network connectivity';
        } else if (msg.includes('password') || msg.includes('auth')) {
          hint = ' — check DATABASE_URL credentials';
        }
        console.error(
          `[DB] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${msg}${hint}. ` +
          `Retrying in ${delay}ms...`
        );

        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this._isConnected = false;
    console.error(`[DB] All ${MAX_RETRIES} connection attempts failed. Last error: ${lastError?.message}`);
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
      console.log('[DB] Disconnected successfully');
    } catch (err) {
      console.error('[DB] Error during disconnection:', err);
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
          console.log('[DB] Connection restored');
        }
      } catch {
        this._isConnected = false;
        console.error('[DB] Health check failed — connection lost');
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
        const poolConfig: import('pg').PoolConfig = {
          connectionString: env.DIRECT_URL,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 30000,
          keepAlive: true,
          keepAliveInitialDelayMillis: 10000,
          ssl: env.DB_SSL_REJECT_UNAUTHORIZED
            ? { rejectUnauthorized: true }
            : { rejectUnauthorized: false },
        };
        this._pool = new Pool(poolConfig);
        this._client = await this._pool.connect();
        this._isConnected = true;
        this._reconnecting = false;
        this._startHealthCheck();
        console.log(`[DB] Reconnected after ${attempt} attempt(s)`);
        return;
      } catch (err) {
        const delay = Math.min(RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1), 30000);
        console.error(
          `[DB] Reconnection attempt ${attempt}/${MAX_RETRIES} failed: ` +
          `${err instanceof Error ? err.message : String(err)}. Retrying in ${delay}ms...`
        );
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this._reconnecting = false;
    console.error('[DB] All reconnection attempts exhausted. Will retry on next health check.');
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
