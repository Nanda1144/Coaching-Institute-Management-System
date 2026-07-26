import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  console.log('Seeding empty tables...');

  // Seed exams (6 rows)
  const examsExist = await pool.query('SELECT COUNT(*) as c FROM exams');
  if (parseInt(examsExist.rows[0].c) === 0) {
    await pool.query(`
      INSERT INTO exams (id, title, subject, batch, date, time, status, max_marks, type, location, created_at, updated_at)
      VALUES
        (gen_random_uuid()::text, 'Mid Term Examination', 'Mathematics', 'CSE-A', '2026-08-15', '09:00 AM', 'scheduled', 100, 'midterm', 'Hall A', NOW(), NOW()),
        (gen_random_uuid()::text, 'Final Examination', 'Physics', 'CSE-A', '2026-09-20', '09:00 AM', 'scheduled', 100, 'final', 'Hall B', NOW(), NOW()),
        (gen_random_uuid()::text, 'Weekly Test', 'Chemistry', 'CSE-B', '2026-07-30', '10:00 AM', 'scheduled', 50, 'weekly', 'Classroom 101', NOW(), NOW()),
        (gen_random_uuid()::text, 'Semester Exam', 'Data Structures', 'CSE-A', '2026-10-10', '09:00 AM', 'scheduled', 100, 'semester', 'Main Hall', NOW(), NOW()),
        (gen_random_uuid()::text, 'Practical Exam', 'Computer Lab', 'CSE-B', '2026-08-25', '02:00 PM', 'scheduled', 50, 'practical', 'Lab 1', NOW(), NOW()),
        (gen_random_uuid()::text, 'Quiz 1', 'English', 'MATH-A', '2026-07-28', '11:00 AM', 'scheduled', 20, 'quiz', 'Classroom 201', NOW(), NOW())
    `);
    console.log('  ✓ exams seeded');
  } else {
    console.log('  - exams already have data');
  }

  // Seed fee_transactions (10 rows)
  const feesExist = await pool.query('SELECT COUNT(*) as c FROM fee_transactions');
  if (parseInt(feesExist.rows[0].c) === 0) {
    const students = await pool.query('SELECT id, full_name, roll_number FROM students LIMIT 10');
    for (const s of students.rows) {
      await pool.query(`
        INSERT INTO fee_transactions (id, student, roll, description, amount, date, method, status, created_at, updated_at)
        VALUES (gen_random_uuid()::text, $1, $2, 'Tuition Fee - Semester 1', 25000, NOW(), 'online', 'paid', NOW(), NOW())
      `, [s.full_name, s.roll_number]);
    }
    console.log('  ✓ fee_transactions seeded');
  } else {
    console.log('  - fee_transactions already have data');
  }

  // Seed more parents
  const parentsExist = await pool.query('SELECT COUNT(*) as c FROM parents');
  if (parseInt(parentsExist.rows[0].c) < 10) {
    const students = await pool.query('SELECT id, full_name, roll_number FROM students LIMIT 10');
    for (const s of students.rows) {
      const existing = await pool.query('SELECT COUNT(*) as c FROM parents WHERE linked_roll = $1', [s.roll_number]);
      if (parseInt(existing.rows[0].c) === 0) {
        await pool.query(`
          INSERT INTO parents (id, full_name, email, phone, address, linked_student, linked_roll, relationship, password, role, status, created_at, updated_at)
          VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, 'Parent', '', 'PARENT', 'active', NOW(), NOW())
        `, [
          `Parent of ${s.full_name}`,
          `parent.${s.roll_number.toLowerCase()}@email.com`,
          `9${String(9000000000 + Math.floor(Math.random() * 999999999)).slice(0, 10)}`,
          '123 Main Street, City',
          s.full_name,
          s.roll_number
        ]);
      }
    }
    console.log('  ✓ additional parents seeded');
  } else {
    console.log('  - parents already have sufficient data');
  }

  // Seed fee_structure (5 rows)
  const structureExist = await pool.query('SELECT COUNT(*) as c FROM fee_structure');
  if (parseInt(structureExist.rows[0].c) === 0) {
    await pool.query(`
      INSERT INTO fee_structure (id, type, amount, due_date, semester, registration_fee, tuition_fee, examination_fee, miscellaneous_fee, total_fee, installment_count, status, created_at, updated_at)
      VALUES
        (gen_random_uuid()::text, 'Tuition Fee', 25000, '2026-08-15', '1', 5000, 15000, 3000, 2000, 25000, 2, 'active', NOW(), NOW()),
        (gen_random_uuid()::text, 'Laboratory Fee', 5000, '2026-08-20', '1', 0, 0, 0, 5000, 5000, 1, 'active', NOW(), NOW()),
        (gen_random_uuid()::text, 'Library Fee', 3000, '2026-08-10', '1', 0, 0, 0, 3000, 3000, 1, 'active', NOW(), NOW()),
        (gen_random_uuid()::text, 'Sports Fee', 2000, '2026-08-25', '1', 0, 0, 0, 2000, 2000, 1, 'active', NOW(), NOW()),
        (gen_random_uuid()::text, 'Development Fee', 10000, '2026-09-01', '1', 0, 5000, 0, 5000, 10000, 2, 'active', NOW(), NOW())
    `);
    console.log('  ✓ fee_structure seeded');
  } else {
    console.log('  - fee_structure already has data');
  }

  await pool.end();
  console.log('\nSeeding complete!');
}

seed().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
