import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.faculty.findMany({
    where: { username: { in: ['admin', 'hod', 'faculty'] } },
    select: { username: true, role: true, email: true, password: true },
  });
  for (const u of users) {
    console.log(`${u.username} | ${u.role} | ${u.email} | password hash exists: ${!!u.password}`);
  }
  if (users.length < 3) {
    console.log('Some expected users missing');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
