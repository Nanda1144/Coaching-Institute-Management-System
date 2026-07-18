import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing all data in FK-safe order...');
  const tables = [
    'material_downloads', 'material_search_logs', 'material_attachments',
    'assignment_reminders', 'submission_attachments', 'evaluations',
    'assignment_submissions', 'assignment_attachments', 'homework_attachments',
    'study_materials', 'material_categories', 'homeworks', 'assignments',
    'qr_scans', 'qr_sessions', 'fingerprint_attendances', 'face_recognitions',
    'attendance_corrections', 'attendances', 'timetables',
    'faculty_transfers', 'assignment_logs', 'chapters',
    'students', 'faculty', 'classrooms', 'batches', 'subjects',
    'semesters', 'courses', 'departments'
  ];
  for (const t of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${t}"`);
      console.log(`  CLEARED: ${t}`);
    } catch(e: any) {
      console.log(`  SKIP: ${t} - ${e.message?.substring(0, 80)}`);
    }
  }
  console.log('All data cleared.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
