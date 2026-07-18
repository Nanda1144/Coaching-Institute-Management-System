import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${t}" CASCADE`);
      console.log(`  OK: ${t}`);
    } catch(e: any) {
      console.log(`  FAIL: ${t} - ${e.message?.substring(0, 120)}`);
    }
  }
  console.log('Done.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
