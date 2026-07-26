const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:%40cCnanda1411441@db.kwgvocscgumkaylchjtd.supabase.co:5432/postgres',
  connectionTimeoutMillis: 15000,
  ssl: { rejectUnauthorized: false },
});
(async () => {
  try {
    const r = await pool.query('SELECT 1 as test');
    console.log('DB SUCCESS:', JSON.stringify(r.rows[0]));
    const r2 = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' LIMIT 10");
    console.log('Tables:', r2.rows.map(r => r.table_name).join(', '));
    const r3 = await pool.query("SELECT COUNT(*) as cnt FROM faculty");
    console.log('Faculty count:', r3.rows[0].cnt);
  } catch(e) {
    console.error('DB FAILED:', e.message);
    console.error('Code:', e.code);
  }
  await pool.end();
})();
