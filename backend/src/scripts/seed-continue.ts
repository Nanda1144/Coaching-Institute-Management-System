import { prisma } from '../config/database';
import bcrypt from 'bcrypt';
import {
  AttendanceMethod,
  AttendanceStatus,
  AssignmentVisibility,
  AssignmentStatus,
  HomeworkStatus,
  MaterialType,
  MaterialVisibility,
  ReminderType,
  ReminderStatus,
  NotificationChannel,
  ReminderFrequency,
} from '@prisma/client';

async function main() {
  const existingFaculty = await prisma.faculty.findFirst();
  if (!existingFaculty) {
    console.error('Please run seed.ts first to create base data.');
    process.exit(1);
  }

  const adminFaculty = await prisma.faculty.findUnique({ where: { email: 'admin@college.edu' } });
  if (!adminFaculty) {
    console.error('Admin user not found. Run seed.ts first.');
    process.exit(1);
  }

  const departments = await prisma.department.findMany();
  const courses = await prisma.course.findMany();
  const semesters = await prisma.semester.findMany();
  const subjects = await prisma.subject.findMany();
  const batches = await prisma.batch.findMany();
  const classrooms = await prisma.classroom.findMany();
  const existingStudents = await prisma.student.findMany();

  if (departments.length === 0 || subjects.length === 0 || batches.length === 0) {
    console.error('Base data missing. Run seed.ts first.');
    process.exit(1);
  }

  const facultyPassword = await bcrypt.hash('Faculty@123', 10);
  const adminId = adminFaculty.id;

  const newFaculty = await prisma.$transaction(async (tx) => {
    const facultyData = [
      { facultyId: 'FAC-2001', firstName: 'Amit', lastName: 'Gupta', fullName: 'Amit Gupta', gender: 'Male', dateOfBirth: new Date('1983-02-14'), email: 'amit.gupta@college.edu', phone: '9000000101', employeeId: 'EMP-2001', designation: 'Professor', department: 'Computer Science', specialization: ['AI', 'ML'], qualification: ['Ph.D.', 'M.Tech'], experience: 14, joiningDate: new Date('2013-06-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Staff Colony', city: 'City', state: 'State' }, emergencyContact: { name: 'Neha Gupta', phone: '9000000201', relation: 'Spouse' }, username: 'amit.gupta', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2002', firstName: 'Priya', lastName: 'Singh', fullName: 'Priya Singh', gender: 'Female', dateOfBirth: new Date('1987-07-08'), email: 'priya.singh@college.edu', phone: '9000000102', employeeId: 'EMP-2002', designation: 'Associate Professor', department: 'Computer Science', specialization: ['Networking', 'Security'], qualification: ['Ph.D.', 'M.Tech'], experience: 11, joiningDate: new Date('2016-07-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Faculty Apartments', city: 'City', state: 'State' }, emergencyContact: { name: 'Raj Singh', phone: '9000000202', relation: 'Spouse' }, username: 'priya.singh', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2003', firstName: 'Rahul', lastName: 'Verma', fullName: 'Rahul Verma', gender: 'Male', dateOfBirth: new Date('1986-09-12'), email: 'rahul.verma@college.edu', phone: '9000000103', employeeId: 'EMP-2003', designation: 'Assistant Professor', department: 'Electronics', specialization: ['Communication', 'Signal Processing'], qualification: ['M.Tech', 'B.Tech'], experience: 9, joiningDate: new Date('2017-07-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Faculty Quarters', city: 'City', state: 'State' }, emergencyContact: { name: 'Sonia Verma', phone: '9000000203', relation: 'Spouse' }, username: 'rahul.verma', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2004', firstName: 'Neha', lastName: 'Joshi', fullName: 'Neha Joshi', gender: 'Female', dateOfBirth: new Date('1991-04-25'), email: 'neha.joshi@college.edu', phone: '9000000104', employeeId: 'EMP-2004', designation: 'Assistant Professor', department: 'Electronics', specialization: ['VLSI', 'Embedded'], qualification: ['M.Tech', 'B.Tech'], experience: 7, joiningDate: new Date('2019-07-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Faculty Hostel', city: 'City', state: 'State' }, emergencyContact: { name: 'Ravi Joshi', phone: '9000000204', relation: 'Brother' }, username: 'neha.joshi', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2005', firstName: 'Deepak', lastName: 'Patel', fullName: 'Deepak Patel', gender: 'Male', dateOfBirth: new Date('1984-11-30'), email: 'deepak.patel@college.edu', phone: '9000000105', employeeId: 'EMP-2005', designation: 'Professor', department: 'Mechanical', specialization: ['Design', 'Manufacturing'], qualification: ['Ph.D.', 'M.Tech'], experience: 15, joiningDate: new Date('2012-06-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Staff Colony', city: 'City', state: 'State' }, emergencyContact: { name: 'Kavita Patel', phone: '9000000205', relation: 'Spouse' }, username: 'deepak.patel', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2006', firstName: 'Sunita', lastName: 'Reddy', fullName: 'Sunita Reddy', gender: 'Female', dateOfBirth: new Date('1989-08-18'), email: 'sunita.reddy@college.edu', phone: '9000000106', employeeId: 'EMP-2006', designation: 'Associate Professor', department: 'Mechanical', specialization: ['Thermal', 'Automotive'], qualification: ['Ph.D.', 'M.Tech'], experience: 10, joiningDate: new Date('2017-07-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Faculty Apartments', city: 'City', state: 'State' }, emergencyContact: { name: 'Vikram Reddy', phone: '9000000206', relation: 'Spouse' }, username: 'sunita.reddy', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2007', firstName: 'Vijay', lastName: 'Kumar', fullName: 'Vijay Kumar', gender: 'Male', dateOfBirth: new Date('1985-05-05'), email: 'vijay.kumar@college.edu', phone: '9000000107', employeeId: 'EMP-2007', designation: 'Professor', department: 'Civil', specialization: ['Structural', 'Construction'], qualification: ['Ph.D.', 'M.Tech'], experience: 16, joiningDate: new Date('2011-06-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Staff Colony', city: 'City', state: 'State' }, emergencyContact: { name: 'Anita Kumar', phone: '9000000207', relation: 'Spouse' }, username: 'vijay.kumar', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2008', firstName: 'Kavita', lastName: 'Sharma', fullName: 'Kavita Sharma', gender: 'Female', dateOfBirth: new Date('1992-12-01'), email: 'kavita.sharma@college.edu', phone: '9000000108', employeeId: 'EMP-2008', designation: 'Assistant Professor', department: 'Civil', specialization: ['Geotechnical', 'Environmental'], qualification: ['M.Tech', 'B.Tech'], experience: 5, joiningDate: new Date('2020-07-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Faculty Hostel', city: 'City', state: 'State' }, emergencyContact: { name: 'Mohan Sharma', phone: '9000000208', relation: 'Father' }, username: 'kavita.sharma', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2009', firstName: 'Manoj', lastName: 'Tiwari', fullName: 'Manoj Tiwari', gender: 'Male', dateOfBirth: new Date('1981-10-20'), email: 'manoj.tiwari@college.edu', phone: '9000000109', employeeId: 'EMP-2009', designation: 'Professor', department: 'Computer Science', specialization: ['Data Science', 'Big Data'], qualification: ['Ph.D.', 'M.Tech'], experience: 17, joiningDate: new Date('2010-06-01'), employmentType: 'permanent', branch: 'Main Campus', campus: 'Main', address: { street: 'Staff Colony', city: 'City', state: 'State' }, emergencyContact: { name: 'Pooja Tiwari', phone: '9000000209', relation: 'Spouse' }, username: 'manoj.tiwari', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
      { facultyId: 'FAC-2010', firstName: 'Pooja', lastName: 'Mehta', fullName: 'Pooja Mehta', gender: 'Female', dateOfBirth: new Date('1993-03-14'), email: 'pooja.mehta@college.edu', phone: '9000000110', employeeId: 'EMP-2010', designation: 'Assistant Professor', department: 'Electronics', specialization: ['IoT', 'Robotics'], qualification: ['M.Tech', 'B.Tech'], experience: 4, joiningDate: new Date('2021-07-01'), employmentType: 'contract', branch: 'Main Campus', campus: 'Main', address: { street: 'Faculty Hostel', city: 'City', state: 'State' }, emergencyContact: { name: 'Suresh Mehta', phone: '9000000210', relation: 'Father' }, username: 'pooja.mehta', password: facultyPassword, role: 'FACULTY', permissions: [], status: 'active' },
    ];
    const created = await Promise.all(
      facultyData.map((f) =>
        tx.faculty.upsert({
          where: { email: f.email },
          update: {},
          create: f,
        })
      )
    );
    return created;
  });
  console.log(`Created ${newFaculty.length} additional faculty`);

  const allFaculty = await prisma.faculty.findMany();
  const csDept = departments.find((d) => d.code === 'CS')!;
  const ecDept = departments.find((d) => d.code === 'EC')!;
  const meDept = departments.find((d) => d.code === 'ME')!;
  const ceDept = departments.find((d) => d.code === 'CE')!;
  const bTech = courses.find((c) => c.code === 'BTECH')!;
  const sem3 = semesters.find((s) => s.semester === 3)!;
  const sem4 = semesters.find((s) => s.semester === 4)!;
  const sem5 = semesters.find((s) => s.semester === 5)!;
  const csSubjectIds = subjects.filter((s) => s.department === 'Computer Science').map((s) => s.id);

  const batchMap = new Map(batches.map((b) => [b.id, b]));

  const newStudents = await prisma.$transaction(async (tx) => {
    const studentData: any[] = [];
    const deptStudents: Record<string, number> = { 'Computer Science': 0, 'Electronics': 0, 'Mechanical': 0, 'Civil': 0 };

    let rollSuffix = 11;
    for (let i = 0; i < 50; i++) {
      const deptNames = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
      const dept = deptNames[i % 4];
      deptStudents[dept]!++;

      const deptCode = dept === 'Computer Science' ? 'CS' : dept === 'Electronics' ? 'EC' : dept === 'Mechanical' ? 'ME' : 'CE';
      const batchCandidate = batches.find((b) => b.department === dept);
      if (!batchCandidate) continue;

      const firstNames = ['Rohan', 'Sakshi', 'Mohit', 'Anjali', 'Karan', 'Nisha', 'Akash', 'Tanya', 'Gaurav', 'Pallavi', 'Aditya', 'Shipra', 'Rajat', 'Ishita', 'Naveen', 'Shreya', 'Dinesh', 'Swati', 'Himanshu', 'Ankita'];
      const lastNames = ['Arora', 'Chopra', 'Saxena', 'Bhatia', 'Kapoor', 'Malhotra', 'Sethi', 'Khanna', 'Mehra', 'Grover', 'Bajaj', 'Wadhwa', 'Gill', 'Bhat', 'Rana', 'Kohli', 'Tandon', 'Bajpai', 'Sareen', 'Luthra'];
      const fName = firstNames[i % firstNames.length];
      const lName = lastNames[i % lastNames.length];
      const rollStr = `${deptCode}${String(rollSuffix).padStart(4, '0')}`;
      const studentId = `STU-2024${String(rollSuffix).padStart(3, '0')}`;
      const gender = i % 2 === 0 ? 'Male' : 'Female';

      studentData.push({
        studentId,
        firstName: fName,
        lastName: lName,
        fullName: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}.${rollSuffix}@college.edu`,
        phone: `8000000${String(rollSuffix).padStart(3, '0')}`,
        rollNumber: rollStr,
        department: dept,
        course: 'B.Tech',
        semester: 3,
        batch: batchCandidate.batchName,
        batchId: batchCandidate.id,
        section: i % 2 === 0 ? 'A' : 'B',
        gender,
        dateOfBirth: new Date(2002 + (i % 4), (i % 12), ((i % 28) + 1)),
        address: { city: 'City', state: 'State' },
      });
      rollSuffix++;
    }

    const created = await Promise.all(
      studentData.map((s) => tx.student.create({ data: s }))
    );
    return created;
  });
  console.log(`Created ${newStudents.length} additional students`);

  const allStudents = [...existingStudents, ...newStudents];

  const csFaculty = allFaculty.filter((f) => f.department === 'Computer Science' && f.role !== 'SUPER_ADMIN');
  const csClassroom = classrooms.find((c) => c.classroomCode === 'LAB-CS1') || classrooms[0];

  const attendanceRecords = await prisma.$transaction(async (tx) => {
    const records: any[] = [];
    const attendanceDate = new Date('2025-04-01');
    const statuses: AttendanceStatus[] = [AttendanceStatus.present, AttendanceStatus.present, AttendanceStatus.present, AttendanceStatus.absent, AttendanceStatus.late, AttendanceStatus.present, AttendanceStatus.present, AttendanceStatus.half_day, AttendanceStatus.present, AttendanceStatus.present];

    let count = 0;
    for (const student of allStudents.slice(0, 20)) {
      const batch = batchMap.get(student.batchId || '');
      if (!batch) continue;

      const subj = subjects.find((s) => s.department === student.department) || subjects[count % subjects.length];
      if (!subj) continue;

      const faculty = allFaculty.find((f) => f.department === student.department && f.role !== 'SUPER_ADMIN') || allFaculty[0];

      const attDate = new Date(attendanceDate);
      attDate.setDate(attDate.getDate() + count);

      records.push({
        attendanceCode: `ATT-2025-${String(count + 1).padStart(4, '0')}`,
        studentId: student.id,
        facultyId: faculty.id,
        subjectId: subj.id,
        batchId: batch.id,
        classroomId: csClassroom.id,
        attendanceDate: attDate,
        startTime: new Date(attDate.getFullYear(), attDate.getMonth(), attDate.getDate(), 9, 0, 0),
        endTime: new Date(attDate.getFullYear(), attDate.getMonth(), attDate.getDate(), 10, 0, 0),
        attendanceMethod: AttendanceMethod.manual,
        attendanceStatus: statuses[count % statuses.length],
        createdById: faculty.id,
        updatedById: faculty.id,
      });
      count++;
      if (count >= 20) break;
    }

    const created = await Promise.all(
      records.map((r) => tx.attendance.create({ data: r }))
    );
    return created;
  });
  console.log(`Created ${attendanceRecords.length} attendance records`);

  const csDeptId = csDept.id;
  const bTechId = bTech.id;
  const firstFaculty = allFaculty.find((f) => f.role === 'FACULTY' && f.department === 'Computer Science')!;
  const csBatch = batches.find((b) => b.department === 'Computer Science')!;
  const csSubject = subjects.find((s) => s.department === 'Computer Science')!;

  const assignments = await prisma.$transaction(async (tx) => {
    const assignmentData = [
      { assignmentCode: 'ASSGN-001', title: 'Data Structures Assignment 1', description: 'Implement linked list operations', instructions: 'Write code in C++', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 100, passingMarks: 40, publishDate: new Date('2025-03-01'), dueDate: new Date('2025-03-15'), dueTime: new Date('2025-03-15T23:59:59Z'), allowLateSubmission: true, maxFileSize: 5, maxAttempts: 2, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-002', title: 'DBMS Assignment 1', description: 'Design an ER diagram for library management', instructions: 'Submit as PDF', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 50, passingMarks: 20, publishDate: new Date('2025-03-05'), dueDate: new Date('2025-03-20'), dueTime: new Date('2025-03-20T23:59:59Z'), allowLateSubmission: false, maxFileSize: 10, maxAttempts: 1, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-003', title: 'Operating Systems Assignment', description: 'Write a shell script for process management', instructions: 'Test on Linux environment', departmentId: csDeptId, courseId: bTechId, semesterId: sem4.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 80, passingMarks: 32, publishDate: new Date('2025-03-10'), dueDate: new Date('2025-03-25'), dueTime: new Date('2025-03-25T23:59:59Z'), allowLateSubmission: true, maxFileSize: 5, maxAttempts: 3, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-004', title: 'Computer Networks Assignment', description: 'Configure a small network using Cisco Packet Tracer', instructions: 'Submit .pkt file', departmentId: csDeptId, courseId: bTechId, semesterId: sem5.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 100, passingMarks: 40, publishDate: new Date('2025-03-15'), dueDate: new Date('2025-04-01'), dueTime: new Date('2025-04-01T23:59:59Z'), allowLateSubmission: false, maxFileSize: 20, maxAttempts: 1, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-005', title: 'Data Structures Assignment 2', description: 'Implement tree traversal algorithms', instructions: 'Use recursive approach', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 100, passingMarks: 40, publishDate: new Date('2025-03-20'), dueDate: new Date('2025-04-05'), dueTime: new Date('2025-04-05T23:59:59Z'), allowLateSubmission: true, maxFileSize: 5, maxAttempts: 2, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-006', title: 'DBMS Assignment 2', description: 'Write SQL queries for employee database', instructions: 'Write 20 queries covering joins, subqueries', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 50, passingMarks: 20, publishDate: new Date('2025-03-25'), dueDate: new Date('2025-04-10'), dueTime: new Date('2025-04-10T23:59:59Z'), allowLateSubmission: false, maxFileSize: 2, maxAttempts: 1, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-007', title: 'Software Engineering Assignment', description: 'Prepare SRS document for a library system', instructions: 'Follow IEEE standards', departmentId: csDeptId, courseId: bTechId, semesterId: sem5.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 100, passingMarks: 40, publishDate: new Date('2025-04-01'), dueDate: new Date('2025-04-20'), dueTime: new Date('2025-04-20T23:59:59Z'), allowLateSubmission: true, maxFileSize: 15, maxAttempts: 2, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-008', title: 'Web Development Assignment', description: 'Build a personal portfolio website', instructions: 'Use HTML, CSS, JavaScript', departmentId: csDeptId, courseId: bTechId, semesterId: sem5.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 80, passingMarks: 32, publishDate: new Date('2025-04-05'), dueDate: new Date('2025-04-25'), dueTime: new Date('2025-04-25T23:59:59Z'), allowLateSubmission: false, maxFileSize: 10, maxAttempts: 1, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-009', title: 'Machine Learning Assignment', description: 'Implement linear regression from scratch', instructions: 'Use Python, submit .ipynb', departmentId: csDeptId, courseId: bTechId, semesterId: sem5.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 100, passingMarks: 40, publishDate: new Date('2025-04-10'), dueDate: new Date('2025-04-30'), dueTime: new Date('2025-04-30T23:59:59Z'), allowLateSubmission: true, maxFileSize: 20, maxAttempts: 3, visibility: AssignmentVisibility.visible, status: AssignmentStatus.active, createdById: firstFaculty.id, updatedById: firstFaculty.id },
      { assignmentCode: 'ASSGN-010', title: 'Data Structures Assignment 3', description: 'Implement graph algorithms (BFS, DFS)', instructions: 'Use adjacency list representation', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, batchId: csBatch.id, facultyId: firstFaculty.id, totalMarks: 100, passingMarks: 40, publishDate: new Date('2025-04-15'), dueDate: new Date('2025-05-01'), dueTime: new Date('2025-05-01T23:59:59Z'), allowLateSubmission: true, maxFileSize: 5, maxAttempts: 2, visibility: AssignmentVisibility.hidden, status: AssignmentStatus.archived, createdById: firstFaculty.id, updatedById: firstFaculty.id },
    ];
    const created = await Promise.all(
      assignmentData.map((a) => tx.assignment.create({ data: a }))
    );
    return created;
  });
  console.log(`Created ${assignments.length} assignments`);

  const homeworkFaculty = allFaculty.find((f) => f.email === 'ravi.sharma@college.edu') || firstFaculty;

  const homeworks = await prisma.$transaction(async (tx) => {
    const homeworkData = [
      { title: 'Practice Problems - Linked Lists', description: 'Solve 10 problems on linked lists from the textbook', departmentId: csDeptId, courseId: bTechId, batchId: csBatch.id, subjectId: csSubject.id, facultyId: homeworkFaculty.id, dueDate: new Date('2025-04-10'), status: HomeworkStatus.active, createdById: homeworkFaculty.id, updatedById: homeworkFaculty.id },
      { title: 'SQL Practice', description: 'Practice 15 SQL queries on the sample database', departmentId: csDeptId, courseId: bTechId, batchId: csBatch.id, subjectId: csSubject.id, facultyId: homeworkFaculty.id, dueDate: new Date('2025-04-15'), status: HomeworkStatus.active, createdById: homeworkFaculty.id, updatedById: homeworkFaculty.id },
      { title: 'Sorting Algorithms', description: 'Implement bubble, selection, insertion, merge, and quick sort', departmentId: csDeptId, courseId: bTechId, batchId: csBatch.id, subjectId: csSubject.id, facultyId: homeworkFaculty.id, dueDate: new Date('2025-04-20'), status: HomeworkStatus.active, createdById: homeworkFaculty.id, updatedById: homeworkFaculty.id },
      { title: 'Network Topologies', description: 'Draw and explain different network topologies with examples', departmentId: csDeptId, courseId: bTechId, batchId: csBatch.id, subjectId: csSubject.id, facultyId: homeworkFaculty.id, dueDate: new Date('2025-04-25'), status: HomeworkStatus.active, createdById: homeworkFaculty.id, updatedById: homeworkFaculty.id },
      { title: 'OS Concepts Review', description: 'Write short notes on process scheduling algorithms', departmentId: csDeptId, courseId: bTechId, batchId: csBatch.id, subjectId: csSubject.id, facultyId: homeworkFaculty.id, dueDate: new Date('2025-04-30'), status: HomeworkStatus.active, createdById: homeworkFaculty.id, updatedById: homeworkFaculty.id },
    ];
    const created = await Promise.all(
      homeworkData.map((h) => tx.homework.create({ data: h }))
    );
    return created;
  });
  console.log(`Created ${homeworks.length} homework records`);

  const csChapter = await prisma.chapter.findFirst({ where: { subjectId: csSubject.id } });
  const chapterId = csChapter?.id || (await prisma.chapter.create({
    data: { chapterName: 'Introduction', subjectId: csSubject.id, description: 'Basic concepts', chapterNumber: 1 },
  })).id;

  const studyMaterials = await prisma.$transaction(async (tx) => {
    const materialData = [
      { materialCode: 'MAT-001', title: 'Data Structures Notes - Unit 1', description: 'Introduction to data structures', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.PDF, visibility: MaterialVisibility.PUBLIC, fileName: 'ds_unit1.pdf', originalFileName: 'Data_Structures_Unit1.pdf', fileUrl: '/uploads/materials/ds_unit1.pdf', fileExtension: '.pdf', mimeType: 'application/pdf', fileSize: 2048000, isPublic: true, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-002', title: 'DBMS Lecture Slides', description: 'Complete DBMS lecture slides', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.PPT, visibility: MaterialVisibility.FACULTY_ONLY, fileName: 'dbms_slides.pptx', originalFileName: 'DBMS_Lecture_Slides.pptx', fileUrl: '/uploads/materials/dbms_slides.pptx', fileExtension: '.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', fileSize: 5120000, isPublic: false, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-003', title: 'Algorithm Analysis Video', description: 'Video lecture on algorithm analysis', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.VIDEO, visibility: MaterialVisibility.STUDENTS_ONLY, fileName: 'algorithm_analysis.mp4', originalFileName: 'Algorithm_Analysis.mp4', fileUrl: '/uploads/materials/algorithm_analysis.mp4', fileExtension: '.mp4', mimeType: 'video/mp4', fileSize: 52428800, isPublic: false, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-004', title: 'Programming Assignment Guide', description: 'Guide for programming assignments', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.DOCX, visibility: MaterialVisibility.BATCH_ONLY, fileName: 'assignment_guide.docx', originalFileName: 'Assignment_Guide.docx', fileUrl: '/uploads/materials/assignment_guide.docx', fileExtension: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileSize: 1024000, isPublic: false, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-005', title: 'Sample Code - Sorting', description: 'Implementation of sorting algorithms', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.NOTES, visibility: MaterialVisibility.PUBLIC, fileName: 'sorting_code.txt', originalFileName: 'Sorting_Algorithms.txt', fileUrl: '/uploads/materials/sorting_code.txt', fileExtension: '.txt', mimeType: 'text/plain', fileSize: 51200, isPublic: true, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-006', title: 'Network Security Notes', description: 'Basic network security concepts', departmentId: csDeptId, courseId: bTechId, semesterId: sem5.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.PDF, visibility: MaterialVisibility.PUBLIC, fileName: 'network_security.pdf', originalFileName: 'Network_Security.pdf', fileUrl: '/uploads/materials/network_security.pdf', fileExtension: '.pdf', mimeType: 'application/pdf', fileSize: 3072000, isPublic: true, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-007', title: 'Database Schema Diagram', description: 'ER diagram examples', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.IMAGE, visibility: MaterialVisibility.PUBLIC, fileName: 'er_diagram.png', originalFileName: 'ER_Diagram.png', fileUrl: '/uploads/materials/er_diagram.png', fileExtension: '.png', mimeType: 'image/png', fileSize: 204800, isPublic: true, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-008', title: 'OS Lab Manual', description: 'Operating systems lab manual', departmentId: csDeptId, courseId: bTechId, semesterId: sem4.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.PDF, visibility: MaterialVisibility.STUDENTS_ONLY, fileName: 'os_lab_manual.pdf', originalFileName: 'OS_Lab_Manual.pdf', fileUrl: '/uploads/materials/os_lab_manual.pdf', fileExtension: '.pdf', mimeType: 'application/pdf', fileSize: 4096000, isPublic: false, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-009', title: 'Project Template ZIP', description: 'Project template files', departmentId: csDeptId, courseId: bTechId, semesterId: sem5.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.ZIP, visibility: MaterialVisibility.PUBLIC, fileName: 'project_template.zip', originalFileName: 'Project_Template.zip', fileUrl: '/uploads/materials/project_template.zip', fileExtension: '.zip', mimeType: 'application/zip', fileSize: 10485760, isPublic: true, status: 'active', createdBy: homeworkFaculty.id },
      { materialCode: 'MAT-010', title: 'Interview Preparation Guide', description: 'Common technical interview questions', departmentId: csDeptId, courseId: bTechId, semesterId: sem3.id, subjectId: csSubject.id, chapterId, batchId: csBatch.id, uploadedById: homeworkFaculty.id, materialType: MaterialType.PDF, visibility: MaterialVisibility.PUBLIC, fileName: 'interview_guide.pdf', originalFileName: 'Interview_Guide.pdf', fileUrl: '/uploads/materials/interview_guide.pdf', fileExtension: '.pdf', mimeType: 'application/pdf', fileSize: 1536000, isPublic: true, status: 'active', createdBy: homeworkFaculty.id },
    ];
    const created = await Promise.all(
      materialData.map((m) => tx.studyMaterial.create({ data: m }))
    );
    return created;
  });
  console.log(`Created ${studyMaterials.length} study materials`);

  const transferAdmin = adminFaculty;

  const facultyTransfers = await prisma.$transaction(async (tx) => {
    const transferFaculty = newFaculty.filter((f) => f.department !== 'Administration');
    const transferData = [
      { facultyId: transferFaculty[0]!.id, fromBranch: 'Main Campus', fromDepartment: 'Computer Science', toBranch: 'East Campus', toDepartment: 'Computer Science', transferDate: new Date('2025-06-01'), reason: 'Department restructuring', approvedBy: transferAdmin.id, status: 'approved', performedBy: transferAdmin.id },
      { facultyId: transferFaculty[1]!.id, fromBranch: 'Main Campus', fromDepartment: 'Computer Science', toBranch: 'West Campus', toDepartment: 'Information Technology', transferDate: new Date('2025-07-01'), reason: 'New department formation', approvedBy: transferAdmin.id,       status: 'pending' as any, performedBy: transferAdmin.id },
      { facultyId: transferFaculty[2]!.id, fromBranch: 'Main Campus', fromDepartment: 'Electronics', toBranch: 'East Campus', toDepartment: 'Electronics', transferDate: new Date('2025-06-15'), reason: 'Campus expansion', approvedBy: transferAdmin.id, status: 'approved' as any, performedBy: transferAdmin.id },
      { facultyId: transferFaculty[3]!.id, fromBranch: 'Main Campus', fromDepartment: 'Electronics', toBranch: 'South Campus', toDepartment: 'Electronics & Communication', transferDate: new Date('2025-08-01'), reason: 'Voluntary transfer request', status: 'pending' as any, performedBy: transferAdmin.id },
      { facultyId: transferFaculty[4]!.id, fromBranch: 'Main Campus', fromDepartment: 'Mechanical', toBranch: 'West Campus', toDepartment: 'Mechanical', transferDate: new Date('2025-05-01'), reason: 'Administrative decision', approvedBy: transferAdmin.id, status: 'approved' as any, performedBy: transferAdmin.id },
    ];
    const created = await Promise.all(
      transferData.map((t) => tx.facultyTransfer.create({ data: t }))
    );
    return created;
  });
  console.log(`Created ${facultyTransfers.length} faculty transfers`);

  const reminderFaculty = firstFaculty;
  const firstAssignment = assignments[0]!;
  const firstStudent = allStudents.find((s) => s.department === 'Computer Science')!;

  const reminders = await prisma.$transaction(async (tx) => {
    const reminderData = [
      { assignmentId: firstAssignment.id, studentId: firstStudent.id, reminderDate: new Date('2025-03-14'), reminderTime: new Date('2025-03-14T09:00:00Z'), reminderType: ReminderType.upcoming_deadline, status: ReminderStatus.sent, notificationChannel: NotificationChannel.email, frequency: ReminderFrequency.once, sentAt: new Date('2025-03-14T09:00:00Z'), createdById: reminderFaculty.id },
      { assignmentId: firstAssignment.id, studentId: firstStudent.id, reminderDate: new Date('2025-03-16'), reminderTime: new Date('2025-03-16T10:00:00Z'), reminderType: ReminderType.overdue, status: ReminderStatus.sent, notificationChannel: NotificationChannel.email, frequency: ReminderFrequency.once, sentAt: new Date('2025-03-16T10:00:00Z'), createdById: reminderFaculty.id },
      { assignmentId: assignments[3]!.id, studentId: firstStudent.id, reminderDate: new Date('2025-03-30'), reminderTime: new Date('2025-03-30T09:00:00Z'), reminderType: ReminderType.upcoming_deadline, status: ReminderStatus.pending, notificationChannel: NotificationChannel.sms, frequency: ReminderFrequency.once, createdById: reminderFaculty.id },
      { assignmentId: assignments[4]!.id, studentId: firstStudent.id, reminderDate: new Date('2025-04-04'), reminderTime: new Date('2025-04-04T09:00:00Z'), reminderType: ReminderType.upcoming_deadline, status: ReminderStatus.pending, notificationChannel: NotificationChannel.email, frequency: ReminderFrequency.daily, createdById: reminderFaculty.id },
      { assignmentId: assignments[6]!.id, studentId: firstStudent.id, reminderDate: new Date('2025-04-19'), reminderTime: new Date('2025-04-19T09:00:00Z'), reminderType: ReminderType.upcoming_deadline, status: ReminderStatus.pending, notificationChannel: NotificationChannel.all, frequency: ReminderFrequency.weekly, createdById: reminderFaculty.id },
    ];
    const created = await Promise.all(
      reminderData.map((r) => tx.assignmentReminder.create({ data: r }))
    );
    return created;
  });
  console.log(`Created ${reminders.length} reminders`);

  console.log('\n--- Seed Continue Summary ---');
  console.log(`New Faculty: ${newFaculty.length}`);
  console.log(`New Students: ${newStudents.length}`);
  console.log(`Attendance Records: ${attendanceRecords.length}`);
  console.log(`Assignments: ${assignments.length}`);
  console.log(`Homework Records: ${homeworks.length}`);
  console.log(`Study Materials: ${studyMaterials.length}`);
  console.log(`Faculty Transfers: ${facultyTransfers.length}`);
  console.log(`Reminders: ${reminders.length}`);
  console.log('--- Seed Continue Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed continue error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
