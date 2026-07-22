import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres.kwgvocscgumkaylchjtd:%40cCnanda1411441@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 10000,
});

try {
  const r = await pool.query(
    `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public' AND tablename IN ('parents','exams','fee_transactions','fee_pending','fee_structure','notification_broadcasts')`
  );
  console.log('Tables found:', JSON.stringify(r.rows.map(r => r.tablename)));
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await pool.end();
}
