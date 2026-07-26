import { Pool } from 'pg';
const pool = new Pool({
  connectionString: 'postgresql://postgres:%40cCnanda1411441@db.kwgvocscgumkaylchjtd.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});
const tables = ['batches','branches','certificates','courses','departments','exams','faculty','faculty_transfers','fee_structure','fee_transactions','holidays','payments','parents','students','subjects','timetables','uploads','study_materials','assignments','attendance','evaluations','homeworks','submissions','notifications','semesters','classrooms'];
try {
  for (const t of tables) {
    try {
      const r = await pool.query(`SELECT COUNT(*) as c FROM "${t}"`);
      console.log(`${t}: ${r.rows[0].c}`);
    } catch(e) { console.log(`${t}: ERROR - ${e.message}`); }
  }
} catch(e) { console.error('Fatal:', e.message); }
await pool.end();
