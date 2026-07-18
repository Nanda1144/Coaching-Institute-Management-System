import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tables = [
    'assignment_reminders','material_downloads','material_search_logs',
    'material_attachments','study_materials','material_categories',
    'submission_attachments','evaluations','assignment_submissions',
    'assignment_attachments','homework_attachments','homeworks','assignments',
    'qr_scans','qr_sessions','fingerprint_attendances','face_recognitions',
    'attendance_corrections','attendances','timetables','holidays',
    'faculty_transfers','assignment_logs','chapters','students','faculty',
    'classrooms','batches','subjects','semesters','courses','departments'
  ];
  for (const t of tables) {
    try {
      const [row] = await prisma.$queryRawUnsafe<[{cnt: number}]>('SELECT COUNT(*)::int as cnt FROM "' + t + '"');
      console.log(`${t}: ${row.cnt}`);
    } catch(e: any) {
      console.log(`${t}: ERROR - ${e.message?.substring(0, 80)}`);
    }
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
