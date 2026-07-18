// Debug script to check dept IDs after seed creates departments
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function pid(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(5, '0')}`;
}

async function main() {
  const depts = await prisma.department.findMany({ orderBy: { id: 'asc' } });
  console.log(`Departments in DB: ${depts.length}`);
  for (const d of depts) {
    console.log(`  ${d.id}: ${d.name}`);
  }

  const expectedIds: string[] = [];
  const DEPARTMENTS = [
    'Computer Science','Electronics','Mechanical','Civil',
    'Electrical','Biotechnology','Chemical','Aerospace',
    'Information Technology','Artificial Intelligence','Data Science',
    'Robotics','Automobile','Environmental Science','Business Administration',
  ];
  for (let i = 0; i < DEPARTMENTS.length; i++) {
    expectedIds.push(pid('dept', i + 1));
  }
  console.log(`\nExpected deptIds (${expectedIds.length}):`);
  for (const id of expectedIds) {
    const found = depts.find(d => d.id === id);
    console.log(`  ${id} -> ${found ? 'EXISTS: ' + found.name : 'MISSING!'}`);
  }

  const missingIds = expectedIds.filter(id => !depts.find(d => d.id === id));
  if (missingIds.length > 0) {
    console.log(`\n*** ${missingIds.length} department IDs MISSING from DB! ***`);
    console.log('Missing:', missingIds.join(', '));
  } else {
    console.log('\nAll department IDs match. FK issue must be elsewhere.');
  }

  // Also check if admin faculty exists
  const adminId = pid('fac', 1);
  const admin = await prisma.faculty.findUnique({ where: { id: adminId } });
  console.log(`\nAdmin faculty (${adminId}): ${admin ? admin.fullName : 'MISSING!'}`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
