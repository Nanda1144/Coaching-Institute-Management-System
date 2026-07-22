import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const usersData = [
    {
      facultyId: 'FAC-0001',
      firstName: 'Super',
      lastName: 'Admin',
      fullName: 'Super Admin',
      gender: 'Male',
      dateOfBirth: new Date('1985-01-15'),
      email: 'admin@college.edu',
      phone: '9999999999',
      employeeId: 'EMP-0001',
      designation: 'Administrator',
      department: 'Administration',
      specialization: ['Administration'],
      qualification: ['Ph.D.'],
      experience: 15,
      joiningDate: new Date('2020-01-01'),
      employmentType: 'permanent',
      branch: 'Main Campus',
      campus: 'Main',
      address: { street: 'College Road', city: 'City', state: 'State', pincode: '123456' },
      emergencyContact: { name: 'Emergency Contact', phone: '9999999998', relation: 'Spouse' },
      username: 'admin',
      password: 'Admin@123',
      role: 'SUPER_ADMIN',
      permissions: ['ALL'],
      status: 'active',
    },
    {
      facultyId: 'FAC-0002',
      firstName: 'Head',
      lastName: 'OfDepartment',
      fullName: 'Head OfDepartment',
      gender: 'Male',
      dateOfBirth: new Date('1980-06-20'),
      email: 'hod@college.edu',
      phone: '9999999997',
      employeeId: 'EMP-0002',
      designation: 'Professor & HOD',
      department: 'Computer Science',
      specialization: ['Computer Science'],
      qualification: ['Ph.D.', 'M.Tech'],
      experience: 18,
      joiningDate: new Date('2015-06-01'),
      employmentType: 'permanent',
      branch: 'Main Campus',
      campus: 'Main',
      address: { street: 'Staff Colony', city: 'City', state: 'State', pincode: '123456' },
      emergencyContact: { name: 'HOD Spouse', phone: '9999999996', relation: 'Spouse' },
      username: 'hod',
      password: 'Hod@123',
      role: 'HOD',
      permissions: ['MANAGE_DEPARTMENT', 'MANAGE_FACULTY'],
      status: 'active',
    },
    {
      facultyId: 'FAC-0003',
      firstName: 'Faculty',
      lastName: 'User',
      fullName: 'Faculty User',
      gender: 'Female',
      dateOfBirth: new Date('1988-03-15'),
      email: 'faculty@college.edu',
      phone: '9999999995',
      employeeId: 'EMP-0003',
      designation: 'Assistant Professor',
      department: 'Computer Science',
      specialization: ['Programming', 'Web Development'],
      qualification: ['M.Tech', 'B.Tech'],
      experience: 8,
      joiningDate: new Date('2018-07-01'),
      employmentType: 'permanent',
      branch: 'Main Campus',
      campus: 'Main',
      address: { street: 'Faculty Block', city: 'City', state: 'State', pincode: '123456' },
      emergencyContact: { name: 'Faculty Spouse', phone: '9999999994', relation: 'Spouse' },
      username: 'faculty',
      password: 'Faculty@123',
      role: 'FACULTY',
      permissions: ['READ_STUDENT', 'READ_FACULTY', 'READ_NOTIFICATION', 'READ_MATERIAL', 'READ_EVALUATION', 'CREATE_ATTENDANCE', 'CREATE_ASSIGNMENT', 'CREATE_MATERIAL', 'GRADE_SUBMISSION'],
      status: 'active',
    },
    {
      facultyId: 'FAC-0004',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      gender: 'Male',
      dateOfBirth: new Date('1990-11-25'),
      email: 'john@college.edu',
      phone: '9999999993',
      employeeId: 'EMP-0004',
      designation: 'Assistant Professor',
      department: 'Electronics',
      specialization: ['Electronics', 'IoT'],
      qualification: ['M.Tech', 'B.Tech'],
      experience: 6,
      joiningDate: new Date('2019-07-01'),
      employmentType: 'permanent',
      branch: 'Main Campus',
      campus: 'Main',
      address: { street: 'Faculty Hostel', city: 'City', state: 'State', pincode: '123456' },
      emergencyContact: { name: 'Jane Doe', phone: '9999999992', relation: 'Spouse' },
      username: 'john.doe',
      password: 'John@123',
      role: 'FACULTY',
      permissions: ['READ_STUDENT', 'READ_FACULTY', 'READ_NOTIFICATION', 'READ_MATERIAL', 'READ_EVALUATION', 'CREATE_ATTENDANCE', 'CREATE_ASSIGNMENT', 'CREATE_MATERIAL', 'GRADE_SUBMISSION'],
      status: 'active',
    },
  ];

  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.faculty.upsert({
      where: { email: userData.email },
      update: {
        password: hashedPassword,
        role: userData.role,
        status: userData.status,
      },
      create: {
        ...userData,
        password: hashedPassword,
      },
    });

    console.log(`Upserted user: ${user.email} (${user.role})`);
  }

  console.log('\nAll 4 users upserted successfully.');
}

main()
  .catch((e) => {
    console.error('Seed users error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
