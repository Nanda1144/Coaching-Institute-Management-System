import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const hashed = await bcrypt.hash('password123', 10);
  const result = await prisma.student.updateMany({
    where: { password: null },
    data: { password: hashed, role: 'STUDENT' },
  });
  console.log(`Updated ${result.count} students with password`);

  // Also create a test parent
  const existingParent = await prisma.parent.findUnique({ where: { email: 'parent@college.edu' } });
  if (!existingParent) {
    const student = await prisma.student.findFirst();
    if (student) {
      await prisma.parent.create({
        data: {
          fullName: 'Test Parent',
          email: 'parent@college.edu',
          phone: '8888888888',
          password: hashed,
          role: 'PARENT',
          status: 'active',
          linkedStudent: student.fullName,
          linkedRoll: student.rollNumber,
          relationship: 'Father',
        },
      });
      console.log('Created test parent: parent@college.edu / password123');
    }
  }
  await prisma.$disconnect();
}
main().catch(console.error);
