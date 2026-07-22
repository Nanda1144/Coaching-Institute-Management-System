import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  // Check admin
  const admin = await prisma.faculty.findUnique({ where: { email: 'admin@college.edu' }, select: { email: true, password: true, role: true, username: true } });
  console.log('Admin:', admin?.email, admin?.role, 'pw exists:', !!admin?.password);
  if (admin?.password) {
    const match = await bcrypt.compare('password123', admin.password);
    console.log('Password match:', match);
    const match2 = await bcrypt.compare('Admin@123', admin.password);
    console.log('Admin@123 match:', match2);
  }

  // Check a student
  const student = await prisma.student.findFirst({ select: { email: true, password: true, role: true } });
  console.log('First student:', student?.email, 'pw exists:', !!student?.password, 'role:', student?.role);

  // Check a parent
  const parent = await prisma.parent.findFirst({ select: { email: true, password: true, role: true } });
  console.log('First parent:', parent?.email, 'pw exists:', !!parent?.password, 'role:', parent?.role);
  
  await prisma.$disconnect();
}
main().catch(console.error);
