import pg from 'pg';
import { readFileSync } from 'fs';

const { Pool } = pg;

const pool = new Pool({
  host: 'db.kwgvocscgumkaylchjtd.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '@cCnanda1411441',
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 20000,
});

async function main() {
  const client = await pool.connect();
  console.log('Connected');

  const sql = readFileSync('prisma/migrations/20260720000000_add_admin_entities/migration.sql', 'utf-8');

  try {
    await client.query(sql);
    console.log('Migration SQL executed successfully');
  } catch (err) {
    console.error('Migration SQL error:', err.message);
  }

  // Verify
  const r = await client.query(
    `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public' AND tablename IN ('parents','exams','fee_transactions','fee_pending','fee_structure','notification_broadcasts')`
  );
  console.log('Tables now exist:', JSON.stringify(r.rows.map(r => r.tablename)));

  client.release();
  await pool.end();
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
