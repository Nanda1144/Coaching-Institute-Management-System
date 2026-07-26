import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
});

async function link() {
  console.log('Linking parents to students...');

  const parents = await pool.query('SELECT id, linked_roll FROM parents WHERE linked_roll IS NOT NULL');
  let linked = 0;

  for (const p of parents.rows) {
    const student = await pool.query('SELECT id FROM students WHERE roll_number = $1', [p.linked_roll]);
    if (student.rows.length > 0) {
      const existing = await pool.query(
        'SELECT COUNT(*) as c FROM parent_students WHERE parent_id = $1 AND student_id = $2',
        [p.id, student.rows[0].id]
      );
      if (parseInt(existing.rows[0].c) === 0) {
        await pool.query(
          'INSERT INTO parent_students (parent_id, student_id, relationship, created_at) VALUES ($1, $2, $3, NOW())',
          [p.id, student.rows[0].id, 'Parent']
        );
        linked++;
      }
    }
  }

  console.log(`  ✓ ${linked} parent-student links created`);
  await pool.end();
}

link().catch(e => { console.error('Failed:', e.message); process.exit(1); });
