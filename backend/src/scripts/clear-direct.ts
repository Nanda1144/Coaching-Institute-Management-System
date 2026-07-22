import { PrismaClient } from '@prisma/client';
// Use direct connection (no pgbouncer) for DDL operations
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } }
});

async function main() {
  const tables = [
    'material_downloads', 'material_search_logs', 'material_attachments',
    'assignment_reminders', 'submission_attachments', 'evaluations',
    'assignment_submissions', 'assignment_attachments', 'homework_attachments',
    'study_materials', 'material_categories', 'homeworks', 'assignments',
    'qr_scans', 'qr_sessions', 'fingerprint_attendances', 'face_recognitions',
    'attendance_corrections', 'attendances', 'timetables',
    'faculty_transfers', 'assignment_logs', 'chapters', 'holidays',
    'students', 'faculty', 'classrooms', 'batches', 'subjects',
    'semesters', 'courses', 'departments'
  ];
  for (const t of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${t}"`);
      console.log(`  OK: ${t}`);
    } catch(e: any) {
      // Try nullifying FK references first for faculty issue
      if (e.message?.includes('violates foreign key')) {
        try {
          await prisma.$executeRawUnsafe(`UPDATE "${t}" SET created_by_id = NULL, updated_by_id = NULL WHERE created_by_id IS NOT NULL OR updated_by_id IS NOT NULL`);
          await prisma.$executeRawUnsafe(`DELETE FROM "${t}"`);
          console.log(`  OK(after null): ${t}`);
        } catch(e2: any) {
          console.log(`  FAIL: ${t} - ${e2.message?.substring(0, 100)}`);
        }
      } else {
        console.log(`  FAIL: ${t} - ${e.message?.substring(0, 100)}`);
      }
    }
  }
  console.log('Done.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
