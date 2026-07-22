import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding auth users...\n');

  // ─── 1. Admin (Faculty) ───
  const adminPassword = await bcrypt.hash('admin@cims', 10);
  await prisma.faculty.upsert({
    where: { email: 'admin@gmail.com' },
    update: { password: adminPassword, role: 'SUPER_ADMIN', status: 'active' },
    create: {
      facultyId: 'FAC-ADMIN-01',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      gender: 'Male',
      dateOfBirth: new Date('1985-01-15'),
      email: 'admin@gmail.com',
      phone: '9000000001',
      employeeId: 'EMP-ADMIN-01',
      designation: 'System Administrator',
      department: 'Administration',
      specialization: ['Administration'],
      qualification: ['M.Tech'],
      experience: 10,
      joiningDate: new Date('2020-01-01'),
      employmentType: 'permanent',
      branch: 'Main Campus',
      campus: 'Main',
      address: { street: 'Admin Office', city: 'City', state: 'State', pincode: '123456' },
      emergencyContact: { name: 'Admin Contact', phone: '9000000002', relation: 'Spouse' },
      username: 'admin.cims',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      status: 'active',
    },
  });
  console.log('✓ Upserted admin@gmail.com (SUPER_ADMIN)');

  // ─── 2. College Management (Faculty) ───
  const mgmtPassword = await bcrypt.hash('collegemanagement@cims', 10);
  await prisma.faculty.upsert({
    where: { email: 'collegemanagement@gmail.com' },
    update: { password: mgmtPassword, role: 'ADMIN', status: 'active' },
    create: {
      facultyId: 'FAC-MGMT-01',
      firstName: 'College',
      lastName: 'Management',
      fullName: 'College Management',
      gender: 'Male',
      dateOfBirth: new Date('1980-06-20'),
      email: 'collegemanagement@gmail.com',
      phone: '9000000011',
      employeeId: 'EMP-MGMT-01',
      designation: 'College Administrator',
      department: 'Management',
      specialization: ['Management'],
      qualification: ['MBA'],
      experience: 15,
      joiningDate: new Date('2019-06-01'),
      employmentType: 'permanent',
      branch: 'Main Campus',
      campus: 'Main',
      address: { street: 'Management Block', city: 'City', state: 'State', pincode: '123456' },
      emergencyContact: { name: 'MGMT Contact', phone: '9000000012', relation: 'Spouse' },
      username: 'college.mgmt',
      password: mgmtPassword,
      role: 'ADMIN',
      permissions: ['*'],
      status: 'active',
    },
  });
  console.log('✓ Upserted collegemanagement@gmail.com (ADMIN)');

  // ─── 3. Student ───
  const studentPassword = await bcrypt.hash('student@cims', 10);
  await prisma.student.upsert({
    where: { email: 'student@gmail.com' },
    update: { password: studentPassword, status: 'active' },
    create: {
      studentId: 'STU-DEMO-001',
      firstName: 'Demo',
      lastName: 'Student',
      fullName: 'Demo Student',
      email: 'student@gmail.com',
      phone: '9000000021',
      rollNumber: 'R2024001',
      department: 'Computer Science',
      course: 'B.Tech',
      semester: 3,
      batch: '2024-2028',
      gender: 'Male',
      dateOfBirth: new Date('2002-05-10'),
      password: studentPassword,
      role: 'STUDENT',
      status: 'active',
    },
  });
  console.log('✓ Upserted student@gmail.com (STUDENT)');

  // ─── 4. Faculty ───
  const facultyPassword = await bcrypt.hash('faculty@cims', 10);
  await prisma.faculty.upsert({
    where: { email: 'faculty@gmail.com' },
    update: { password: facultyPassword, role: 'FACULTY', status: 'active' },
    create: {
      facultyId: 'FAC-DEMO-001',
      firstName: 'Demo',
      lastName: 'Faculty',
      fullName: 'Demo Faculty',
      gender: 'Male',
      dateOfBirth: new Date('1988-03-15'),
      email: 'faculty@gmail.com',
      phone: '9000000041',
      employeeId: 'EMP-DEMO-001',
      designation: 'Assistant Professor',
      department: 'Computer Science',
      specialization: ['Web Development'],
      qualification: ['M.Tech'],
      experience: 8,
      joiningDate: new Date('2018-06-01'),
      employmentType: 'permanent',
      branch: 'Main Campus',
      campus: 'Main',
      address: { street: 'Faculty Block', city: 'City', state: 'State', pincode: '123456' },
      emergencyContact: { name: 'Faculty Contact', phone: '9000000042', relation: 'Spouse' },
      username: 'demo.faculty',
      password: facultyPassword,
      role: 'FACULTY',
      permissions: ['*'],
      status: 'active',
    },
  });
  console.log('✓ Upserted faculty@gmail.com (FACULTY)');

  // ─── 5. Parent ───
  const parentPassword = await bcrypt.hash('parent@cims', 10);
  await prisma.parent.upsert({
    where: { email: 'parent@gmail.com' },
    update: { password: parentPassword, status: 'active' },
    create: {
      fullName: 'Demo Parent',
      email: 'parent@gmail.com',
      phone: '9000000031',
      password: parentPassword,
      role: 'PARENT',
      status: 'active',
    },
  });
  console.log('✓ Upserted parent@gmail.com (PARENT)');

  console.log('\nAll 4 auth users seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
