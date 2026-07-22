import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const depts = await prisma.department.findMany({ select: { id: true, name: true } });
  console.log('Departments:', depts.length);
  for (const d of depts) console.log(`  ${d.id}: ${d.name}`);

  const fac = await prisma.faculty.findMany({ select: { id: true, fullName: true } });
  console.log(`Faculty: ${fac.length}`);

  const [attCnt] = await prisma.$queryRawUnsafe<[{cnt: number}]>('SELECT COUNT(*)::int as cnt FROM attendances');
  console.log(`Attendance: ${attCnt.cnt}`);

  const [ttCnt] = await prisma.$queryRawUnsafe<[{cnt: number}]>('SELECT COUNT(*)::int as cnt FROM timetables');
  console.log(`Timetable: ${ttCnt.cnt}`);

  const tables = [
    'departments','courses','semesters','subjects','batches','classrooms',
    'faculty','students','chapters','holidays','timetables','attendances',
    'assignments','homeworks','study_materials','material_categories',
    'assignment_submissions','evaluations','qr_sessions','qr_scans',
    'face_recognitions','fingerprint_attendances','attendance_corrections',
    'faculty_transfers','assignment_logs','assignment_reminders'
  ];
  for (const t of tables) {
    try {
      const [row] = await prisma.$queryRawUnsafe<[{cnt: number}]>(`SELECT COUNT(*)::int as cnt FROM "${t}"`);
      console.log(`  ${t}: ${row.cnt}`);
    } catch(e: any) {}
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
