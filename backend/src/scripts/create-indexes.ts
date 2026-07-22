import { query } from '../config/database';

const indexes = [
  // Faculty
  `CREATE INDEX IF NOT EXISTS idx_faculty_is_deleted ON faculty (is_deleted)`,
  `CREATE INDEX IF NOT EXISTS idx_faculty_status ON faculty (status)`,
  `CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty (department)`,
  `CREATE INDEX IF NOT EXISTS idx_faculty_faculty_id ON faculty (faculty_id)`,

  // Students
  `CREATE INDEX IF NOT EXISTS idx_students_is_deleted ON students (is_deleted)`,
  `CREATE INDEX IF NOT EXISTS idx_students_batch_id ON students (batch_id)`,
  `CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students (roll_number)`,
  `CREATE INDEX IF NOT EXISTS idx_students_department ON students (department)`,

  // Timetables
  `CREATE INDEX IF NOT EXISTS idx_timetables_faculty_id ON timetables (faculty_id)`,
  `CREATE INDEX IF NOT EXISTS idx_timetables_day_of_week ON timetables (day_of_week)`,
  `CREATE INDEX IF NOT EXISTS idx_timetables_is_deleted ON timetables (is_deleted)`,
  `CREATE INDEX IF NOT EXISTS idx_timetables_start_time ON timetables (start_time)`,
  `CREATE INDEX IF NOT EXISTS idx_timetables_end_time ON timetables (end_time)`,
  `CREATE INDEX IF NOT EXISTS idx_timetables_classroom_id ON timetables (classroom_id)`,

  // Attendances
  `CREATE INDEX IF NOT EXISTS idx_attendances_student_id ON attendances (student_id)`,
  `CREATE INDEX IF NOT EXISTS idx_attendances_faculty_id ON attendances (faculty_id)`,
  `CREATE INDEX IF NOT EXISTS idx_attendances_date ON attendances (attendance_date)`,
  `CREATE INDEX IF NOT EXISTS idx_attendances_status ON attendances (attendance_status)`,

  // Assignments
  `CREATE INDEX IF NOT EXISTS idx_assignments_faculty_id ON assignments (faculty_id)`,
  `CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments (status)`,
  `CREATE INDEX IF NOT EXISTS idx_assignments_is_deleted ON assignments (is_deleted)`,

  // Submissions
  `CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON assignment_submissions (assignment_id)`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON assignment_submissions (student_id)`,

  // Evaluations
  `CREATE INDEX IF NOT EXISTS idx_evaluations_submission_id ON evaluations (submission_id)`,
  `CREATE INDEX IF NOT EXISTS idx_evaluations_faculty_id ON evaluations (faculty_id)`,

  // Fee transactions
  `CREATE INDEX IF NOT EXISTS idx_fee_transactions_student ON fee_transactions (roll_number)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_transactions_status ON fee_transactions (status)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_transactions_date ON fee_transactions (created_at)`,

  // Payments
  `CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments (student_id)`,
  `CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status)`,

  // Certificates
  `CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates (student_id)`,
  `CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates (status)`,

  // Branches
  `CREATE INDEX IF NOT EXISTS idx_branches_status ON branches (status)`,

  // Notifications
  `CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notification_broadcasts (created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_type ON notification_broadcasts (type)`,

  // Audit logs
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at)`,
];

async function createIndexes() {
  console.log('Creating database indexes...\n');
  let successCount = 0;
  let failCount = 0;
  for (const sql of indexes) {
    try {
      await query(sql);
      console.log(`  ✓ ${sql.split(' ON ')[1]?.replace('(', '').trim() || sql}`);
      successCount++;
    } catch (err: any) {
      console.error(`  ✗ ${err.message}`);
      failCount++;
    }
  }
  console.log(`\nDone. ${successCount} indexes created, ${failCount} failed.`);
  process.exit(0);
}

createIndexes().catch((err) => {
  console.error('Fatal error creating indexes:', err);
  process.exit(1);
});
