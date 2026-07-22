import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgresql://postgres:%40cCnanda1411441@db.kwgvocscgumkaylchjtd.supabase.co:5432/postgres?sslmode=require' });

async function main() {
  try {
    const r = await pool.query('SELECT COUNT(*) as cnt FROM faculty');
    console.log('faculty count:', r.rows[0].cnt);
    const r2 = await pool.query('SELECT email FROM faculty LIMIT 10');
    console.log('emails:', r2.rows.map((r: any) => r.email).join(', '));
    const r3 = await pool.query("SELECT email FROM faculty WHERE email = 'admin@gmail.com'");
    console.log('admin found:', r3.rows.length > 0);
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  await pool.end();
}
main();
