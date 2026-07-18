import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete in FK-safe order, nullifying self-refs first
  const deletions: [string, string[]?][] = [
    ['material_downloads'],
    ['material_search_logs'],
    ['material_attachments'],
    ['assignment_reminders'],
    ['submission_attachments'],
    ['evaluations'],
    ['assignment_submissions'],
    ['assignment_attachments'],
    ['homework_attachments'],
    ['study_materials'],
    ['material_categories'],
    ['homeworks'],
    ['assignments'],
    ['qr_scans'],
    ['qr_sessions'],
    ['fingerprint_attendances'],
    ['face_recognitions'],
    ['attendance_corrections'],
    ['attendances'],
    ['timetables'],
    ['faculty_transfers'],
    ['assignment_logs'],
    ['chapters'],
    ['holidays'],
    ['students'],
    ['faculty', ['created_by_id', 'updated_by_id']],  // nullify self-refs first
    ['classrooms'],
    ['batches'],
    ['subjects'],
    ['semesters'],
    ['courses'],
    ['departments'],
  ];

  for (const [table, nullableRefs] of deletions) {
    try {
      // Nullify FK refs if needed (for self-referencing tables)
      if (nullableRefs) {
        const setClause = nullableRefs.map(c => `"${c}" = NULL`).join(', ');
        await prisma.$executeRawUnsafe(`UPDATE "${table}" SET ${setClause} WHERE ${nullableRefs.map(c => `"${c}" IS NOT NULL`).join(' OR ')}`);
      }
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
      console.log(`  OK: ${table}`);
    } catch(e: any) {
      console.log(`  FAIL: ${table} - ${e.message?.substring(0, 120)}`);
    }
  }
  console.log('All tables cleared.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
