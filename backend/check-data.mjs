import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'db.kwgvocscgumkaylchjtd.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '@cCnanda1411441',
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 15000,
});

async function main() {
  const client = await pool.connect();
  console.log('Connected');

  const tables = ['students', 'batches', 'faculty', 'parents', 'exams', 'fee_transactions', 'fee_pending', 'fee_structure', 'notification_broadcasts'];
  for (const t of tables) {
    try {
      const r = await client.query(`SELECT COUNT(*) as cnt FROM "${t}"`);
      console.log(`${t}: ${r.rows[0].cnt} rows`);
      if (r.rows[0].cnt === '0') {
        if (['students', 'batches', 'faculty'].includes(t)) {
          const cols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='${t}' LIMIT 5`);
          console.log(`  columns: ${cols.rows.map(c => c.column_name).join(', ')}`);
        }
      }
    } catch (e) {
      console.log(`${t}: ERROR - ${e.message}`);
    }
  }

  client.release();
  await pool.end();
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
