/* ──────────────────────────────────────────────────────────
   Mock API Adapter — intercepts all API calls and returns
   instant mock data (20+ rows per table) when backend is
   unavailable. No network latency.
   ────────────────────────────────────────────────────────── */

function mockDelay(ms = 0) {
  return new Promise((r) => setTimeout(r, ms))
}

let mockEnabled = false

export function isMockEnabled() {
  return mockEnabled
}

export function enableMock(enabled = true) {
  mockEnabled = enabled
}

/* ─── FACULTY (25 rows) ─── */

const facultyRows = [
  { id: 'FAC-001', facultyId: 'FAC-001', profileImage: '', fullName: 'Dr. Rajesh Kumar', department: 'Computer Science', designation: 'Professor', qualification: ['Ph.D. Computer Science'], email: 'rajesh.kumar@college.edu', phone: '9876543210', status: 'Active', joiningDate: '2019-08-15T00:00:00Z', joinDate: '2019-08-15', branch: 'Main Campus', experience: 14, gender: 'Male' },
  { id: 'FAC-002', facultyId: 'FAC-002', profileImage: '', fullName: 'Prof. Sunita Sharma', department: 'Mathematics', designation: 'Associate Professor', qualification: ['Ph.D. Mathematics'], email: 'sunita.sharma@college.edu', phone: '9876543211', status: 'Active', joiningDate: '2020-01-10T00:00:00Z', branch: 'Main Campus', experience: 10, gender: 'Female' },
  { id: 'FAC-003', facultyId: 'FAC-003', profileImage: '', fullName: 'Dr. Amit Verma', department: 'Physics', designation: 'Professor', qualification: ['Ph.D. Physics'], email: 'amit.verma@college.edu', phone: '9876543212', status: 'Active', joiningDate: '2018-06-20T00:00:00Z', branch: 'Science Block', experience: 16, gender: 'Male' },
  { id: 'FAC-004', facultyId: 'FAC-004', profileImage: '', fullName: 'Prof. Priya Patel', department: 'Computer Science', designation: 'Assistant Professor', qualification: ['M.Tech CSE'], email: 'priya.patel@college.edu', phone: '9876543213', status: 'Active', joiningDate: '2021-03-05T00:00:00Z', branch: 'Main Campus', experience: 7, gender: 'Female' },
  { id: 'FAC-005', facultyId: 'FAC-005', profileImage: '', fullName: 'Dr. Vikram Singh', department: 'Electronics', designation: 'Professor', qualification: ['Ph.D. Electronics'], email: 'vikram.singh@college.edu', phone: '9876543214', status: 'Inactive', joiningDate: '2017-11-12T00:00:00Z', branch: 'Engineering Block', experience: 18, gender: 'Male' },
  { id: 'FAC-006', facultyId: 'FAC-006', profileImage: '', fullName: 'Prof. Anjali Gupta', department: 'Chemistry', designation: 'Associate Professor', qualification: ['Ph.D. Chemistry'], email: 'anjali.gupta@college.edu', phone: '9876543215', status: 'Active', joiningDate: '2022-07-18T00:00:00Z', branch: 'Science Block', experience: 9, gender: 'Female' },
  { id: 'FAC-007', facultyId: 'FAC-007', profileImage: '', fullName: 'Dr. Suresh Reddy', department: 'Mathematics', designation: 'Professor', qualification: ['Ph.D. Mathematics'], email: 'suresh.reddy@college.edu', phone: '9876543216', status: 'Active', joiningDate: '2020-09-22T00:00:00Z', branch: 'Main Campus', experience: 20, gender: 'Male' },
  { id: 'FAC-008', facultyId: 'FAC-008', profileImage: '', fullName: 'Prof. Meera Nair', department: 'English', designation: 'Lecturer', qualification: ['M.A. English'], email: 'meera.nair@college.edu', phone: '9876543217', status: 'Active', joiningDate: '2021-05-30T00:00:00Z', branch: 'Arts Block', experience: 5, gender: 'Female' },
  { id: 'FAC-009', facultyId: 'FAC-009', profileImage: '', fullName: 'Dr. Arjun Joshi', department: 'Physics', designation: 'Associate Professor', qualification: ['Ph.D. Physics'], email: 'arjun.joshi@college.edu', phone: '9876543218', status: 'Inactive', joiningDate: '2016-02-14T00:00:00Z', branch: 'Science Block', experience: 12, gender: 'Male' },
  { id: 'FAC-010', facultyId: 'FAC-010', profileImage: '', fullName: 'Prof. Deepa Krishnan', department: 'Computer Science', designation: 'Assistant Professor', qualification: ['Ph.D. Machine Learning'], email: 'deepa.krishnan@college.edu', phone: '9876543219', status: 'Active', joiningDate: '2023-01-08T00:00:00Z', branch: 'Main Campus', experience: 6, gender: 'Female' },
  { id: 'FAC-011', facultyId: 'FAC-011', profileImage: '', fullName: 'Dr. Manoj Tiwari', department: 'Mechanical', designation: 'Professor', qualification: ['Ph.D. Mechanical Engg.'], email: 'manoj.tiwari@college.edu', phone: '9876543220', status: 'Active', joiningDate: '2015-09-01T00:00:00Z', branch: 'Engineering Block', experience: 22, gender: 'Male' },
  { id: 'FAC-012', facultyId: 'FAC-012', profileImage: '', fullName: 'Prof. Neha Gupta', department: 'Biotechnology', designation: 'Associate Professor', qualification: ['Ph.D. Biotechnology'], email: 'neha.gupta@college.edu', phone: '9876543221', status: 'On Leave', joiningDate: '2020-03-15T00:00:00Z', branch: 'Science Block', experience: 11, gender: 'Female' },
  { id: 'FAC-013', facultyId: 'FAC-013', profileImage: '', fullName: 'Dr. Karan Mehta', department: 'Business Administration', designation: 'Professor', qualification: ['Ph.D. Management'], email: 'karan.mehta@college.edu', phone: '9876543222', status: 'Active', joiningDate: '2018-11-20T00:00:00Z', branch: 'Management Block', experience: 15, gender: 'Male' },
  { id: 'FAC-014', facultyId: 'FAC-014', profileImage: '', fullName: 'Prof. Ritu Agarwal', department: 'Electronics', designation: 'Assistant Professor', qualification: ['M.Tech ECE'], email: 'ritu.agarwal@college.edu', phone: '9876543223', status: 'Active', joiningDate: '2022-01-10T00:00:00Z', branch: 'Engineering Block', experience: 4, gender: 'Female' },
  { id: 'FAC-015', facultyId: 'FAC-015', profileImage: '', fullName: 'Dr. Pradeep Jain', department: 'Civil', designation: 'Professor', qualification: ['Ph.D. Civil Engg.'], email: 'pradeep.jain@college.edu', phone: '9876543224', status: 'Active', joiningDate: '2014-07-01T00:00:00Z', branch: 'Engineering Block', experience: 25, gender: 'Male' },
  { id: 'FAC-016', facultyId: 'FAC-016', profileImage: '', fullName: 'Prof. Swati Deshmukh', department: 'Chemistry', designation: 'Assistant Professor', qualification: ['Ph.D. Organic Chemistry'], email: 'swati.deshmukh@college.edu', phone: '9876543225', status: 'On Leave', joiningDate: '2021-08-16T00:00:00Z', branch: 'Science Block', experience: 5, gender: 'Female' },
  { id: 'FAC-017', facultyId: 'FAC-017', profileImage: '', fullName: 'Dr. Rohan Bose', department: 'Computer Science', designation: 'Associate Professor', qualification: ['Ph.D. Computer Science'], email: 'rohan.bose@college.edu', phone: '9876543226', status: 'Active', joiningDate: '2019-04-22T00:00:00Z', branch: 'Main Campus', experience: 13, gender: 'Male' },
  { id: 'FAC-018', facultyId: 'FAC-018', profileImage: '', fullName: 'Prof. Kavita Sinha', department: 'Mathematics', designation: 'Lecturer', qualification: ['M.Sc. Mathematics'], email: 'kavita.sinha@college.edu', phone: '9876543227', status: 'Inactive', joiningDate: '2023-06-05T00:00:00Z', branch: 'Main Campus', experience: 2, gender: 'Female' },
  { id: 'FAC-019', facultyId: 'FAC-019', profileImage: '', fullName: 'Dr. Akash Dave', department: 'Mechanical', designation: 'Associate Professor', qualification: ['Ph.D. Mechanical Engg.'], email: 'akash.dave@college.edu', phone: '9876543228', status: 'Active', joiningDate: '2017-02-28T00:00:00Z', branch: 'Engineering Block', experience: 14, gender: 'Male' },
  { id: 'FAC-020', facultyId: 'FAC-020', profileImage: '', fullName: 'Prof. Ishita Roy', department: 'Business Administration', designation: 'Assistant Professor', qualification: ['MBA Finance'], email: 'ishita.roy@college.edu', phone: '9876543229', status: 'Active', joiningDate: '2022-11-14T00:00:00Z', branch: 'Management Block', experience: 8, gender: 'Female' },
  { id: 'FAC-021', facultyId: 'FAC-021', profileImage: '', fullName: 'Dr. Farhan Ali', department: 'Biotechnology', designation: 'Professor', qualification: ['Ph.D. Genetics'], email: 'farhan.ali@college.edu', phone: '9876543230', status: 'Active', joiningDate: '2016-05-09T00:00:00Z', branch: 'Science Block', experience: 17, gender: 'Male' },
  { id: 'FAC-022', facultyId: 'FAC-022', profileImage: '', fullName: 'Prof. Nidhi Kapoor', department: 'English', designation: 'Associate Professor', qualification: ['M.A. Literature'], email: 'nidhi.kapoor@college.edu', phone: '9876543231', status: 'Active', joiningDate: '2020-10-01T00:00:00Z', branch: 'Arts Block', experience: 9, gender: 'Female' },
  { id: 'FAC-023', facultyId: 'FAC-023', profileImage: '', fullName: 'Dr. Vivek Saxena', department: 'Civil', designation: 'Associate Professor', qualification: ['Ph.D. Structural Engg.'], email: 'vivek.saxena@college.edu', phone: '9876543232', status: 'On Leave', joiningDate: '2018-08-12T00:00:00Z', branch: 'Engineering Block', experience: 11, gender: 'Male' },
  { id: 'FAC-024', facultyId: 'FAC-024', profileImage: '', fullName: 'Prof. Tanvi Shah', department: 'Electronics', designation: 'Lecturer', qualification: ['M.Tech VLSI'], email: 'tanvi.shah@college.edu', phone: '9876543233', status: 'Active', joiningDate: '2023-03-20T00:00:00Z', branch: 'Engineering Block', experience: 3, gender: 'Female' },
  { id: 'FAC-025', facultyId: 'FAC-025', profileImage: '', fullName: 'Dr. Sameer Bhat', department: 'Computer Science', designation: 'Professor', qualification: ['Ph.D. AI & Robotics'], email: 'sameer.bhat@college.edu', phone: '9876543234', status: 'Active', joiningDate: '2013-12-01T00:00:00Z', branch: 'Main Campus', experience: 19, gender: 'Male' },
]

/* ─── TIMETABLE (25 rows) ─── */

const timetableRows = [
  { id: 'TT-001', startTime: '2026-07-17T08:00:00', endTime: '2026-07-17T09:00:00', course: 'B.Tech CSE', subjectName: 'Data Structures', facultyName: 'Dr. Rajesh Kumar', classroom: 'CS-101', roomNumber: 'CS-101', batchName: 'CSE-A', department: 'Computer Science', status: 'ongoing' },
  { id: 'TT-002', startTime: '2026-07-17T09:00:00', endTime: '2026-07-17T10:00:00', course: 'B.Tech CSE', subjectName: 'Algorithms', facultyName: 'Dr. Rajesh Kumar', classroom: 'CS-102', batchName: 'CSE-A', department: 'Computer Science', status: 'scheduled' },
  { id: 'TT-003', startTime: '2026-07-17T10:00:00', endTime: '2026-07-17T11:00:00', course: 'B.Sc Math', subjectName: 'Linear Algebra', facultyName: 'Prof. Sunita Sharma', classroom: 'M-101', batchName: 'MATH-A', department: 'Mathematics', status: 'scheduled' },
  { id: 'TT-004', startTime: '2026-07-17T11:00:00', endTime: '2026-07-17T12:00:00', course: 'B.Sc Physics', subjectName: 'Quantum Mechanics', facultyName: 'Dr. Amit Verma', classroom: 'P-201', batchName: 'PHY-A', department: 'Physics', status: 'scheduled' },
  { id: 'TT-005', startTime: '2026-07-17T08:00:00', endTime: '2026-07-17T09:00:00', course: 'B.Tech ECE', subjectName: 'Digital Logic', facultyName: 'Dr. Vikram Singh', classroom: 'EC-101', batchName: 'ECE-A', department: 'Electronics', status: 'scheduled' },
  { id: 'TT-006', startTime: '2026-07-17T09:00:00', endTime: '2026-07-17T10:00:00', course: 'B.Sc Chemistry', subjectName: 'Organic Chemistry', facultyName: 'Prof. Anjali Gupta', classroom: 'CH-101', batchName: 'CHEM-A', department: 'Chemistry', status: 'completed' },
  { id: 'TT-007', startTime: '2026-07-17T10:00:00', endTime: '2026-07-17T11:00:00', course: 'B.Tech CSE', subjectName: 'Database Systems', facultyName: 'Prof. Priya Patel', classroom: 'CS-103', batchName: 'CSE-B', department: 'Computer Science', status: 'cancelled' },
  { id: 'TT-008', startTime: '2026-07-17T11:00:00', endTime: '2026-07-17T12:00:00', course: 'B.Tech ME', subjectName: 'Thermodynamics', facultyName: 'Dr. Manoj Tiwari', classroom: 'ME-101', batchName: 'MECH-A', department: 'Mechanical', status: 'scheduled' },
  { id: 'TT-009', startTime: '2026-07-17T14:00:00', endTime: '2026-07-17T15:00:00', course: 'B.Tech CE', subjectName: 'Structural Analysis', facultyName: 'Dr. Pradeep Jain', classroom: 'CE-101', batchName: 'CIVIL-A', department: 'Civil', status: 'scheduled' },
  { id: 'TT-010', startTime: '2026-07-17T15:00:00', endTime: '2026-07-17T16:00:00', course: 'BBA', subjectName: 'Financial Management', facultyName: 'Dr. Karan Mehta', classroom: 'MG-101', batchName: 'BBA-A', department: 'Business Administration', status: 'scheduled' },
  { id: 'TT-011', startTime: '2026-07-17T08:00:00', endTime: '2026-07-17T09:00:00', course: 'B.Sc Math', subjectName: 'Calculus', facultyName: 'Dr. Suresh Reddy', classroom: 'M-102', batchName: 'MATH-A', department: 'Mathematics', status: 'ongoing' },
  { id: 'TT-012', startTime: '2026-07-17T09:00:00', endTime: '2026-07-17T10:00:00', course: 'B.Sc Math', subjectName: 'Statistics', facultyName: 'Dr. Suresh Reddy', classroom: 'M-103', batchName: 'MATH-B', department: 'Mathematics', status: 'scheduled' },
  { id: 'TT-013', startTime: '2026-07-17T10:00:00', endTime: '2026-07-17T11:00:00', course: 'B.Tech CSE', subjectName: 'Machine Learning', facultyName: 'Prof. Deepa Krishnan', classroom: 'CS-104', batchName: 'CSE-A', department: 'Computer Science', status: 'scheduled' },
  { id: 'TT-014', startTime: '2026-07-17T11:00:00', endTime: '2026-07-17T12:00:00', course: 'B.Tech CSE', subjectName: 'Computer Networks', facultyName: 'Dr. Rohan Bose', classroom: 'CS-105', batchName: 'CSE-B', department: 'Computer Science', status: 'completed' },
  { id: 'TT-015', startTime: '2026-07-17T14:00:00', endTime: '2026-07-17T15:00:00', course: 'B.Tech ECE', subjectName: 'Microprocessors', facultyName: 'Prof. Ritu Agarwal', classroom: 'EC-102', batchName: 'ECE-A', department: 'Electronics', status: 'scheduled' },
  { id: 'TT-016', startTime: '2026-07-17T15:00:00', endTime: '2026-07-17T16:00:00', course: 'B.Tech ECE', subjectName: 'VLSI Design', facultyName: 'Prof. Tanvi Shah', classroom: 'EC-103', batchName: 'ECE-B', department: 'Electronics', status: 'scheduled' },
  { id: 'TT-017', startTime: '2026-07-17T08:00:00', endTime: '2026-07-17T09:00:00', course: 'B.Sc Physics', subjectName: 'Electromagnetism', facultyName: 'Dr. Arjun Joshi', classroom: 'P-202', batchName: 'PHY-B', department: 'Physics', status: 'completed' },
  { id: 'TT-018', startTime: '2026-07-17T09:00:00', endTime: '2026-07-17T10:00:00', course: 'B.Sc Chemistry', subjectName: 'Inorganic Chemistry', facultyName: 'Prof. Swati Deshmukh', classroom: 'CH-102', batchName: 'CHEM-B', department: 'Chemistry', status: 'scheduled' },
  { id: 'TT-019', startTime: '2026-07-17T10:00:00', endTime: '2026-07-17T11:00:00', course: 'B.Tech ME', subjectName: 'Fluid Mechanics', facultyName: 'Dr. Akash Dave', classroom: 'ME-102', batchName: 'MECH-B', department: 'Mechanical', status: 'scheduled' },
  { id: 'TT-020', startTime: '2026-07-17T11:00:00', endTime: '2026-07-17T12:00:00', course: 'B.Tech CE', subjectName: 'Geotechnical Engg.', facultyName: 'Dr. Vivek Saxena', classroom: 'CE-102', batchName: 'CIVIL-B', department: 'Civil', status: 'scheduled' },
  { id: 'TT-021', startTime: '2026-07-17T14:00:00', endTime: '2026-07-17T15:00:00', course: 'B.Sc Biotech', subjectName: 'Molecular Biology', facultyName: 'Prof. Neha Gupta', classroom: 'BT-101', batchName: 'BT-A', department: 'Biotechnology', status: 'scheduled' },
  { id: 'TT-022', startTime: '2026-07-17T15:00:00', endTime: '2026-07-17T16:00:00', course: 'B.Sc Biotech', subjectName: 'Genetics', facultyName: 'Dr. Farhan Ali', classroom: 'BT-102', batchName: 'BT-A', department: 'Biotechnology', status: 'scheduled' },
  { id: 'TT-023', startTime: '2026-07-17T08:00:00', endTime: '2026-07-17T09:00:00', course: 'B.A English', subjectName: 'British Literature', facultyName: 'Prof. Meera Nair', classroom: 'EN-101', batchName: 'ENG-A', department: 'English', status: 'scheduled' },
  { id: 'TT-024', startTime: '2026-07-17T09:00:00', endTime: '2026-07-17T10:00:00', course: 'B.A English', subjectName: 'Linguistics', facultyName: 'Prof. Nidhi Kapoor', classroom: 'EN-102', batchName: 'ENG-B', department: 'English', status: 'scheduled' },
  { id: 'TT-025', startTime: '2026-07-17T10:00:00', endTime: '2026-07-17T11:00:00', course: 'BBA', subjectName: 'Marketing Management', facultyName: 'Prof. Ishita Roy', classroom: 'MG-102', batchName: 'BBA-B', department: 'Business Administration', status: 'scheduled' },
]

/* ─── ATTENDANCE RECORDS (20+ rows) ─── */

const attendanceRows = [
  { id: 'ATT-001', studentName: 'Aarav Sharma', rollNumber: 'CS2001', department: 'Computer Science', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:55:00', attendanceMethod: 'face', date: '2026-07-17' },
  { id: 'ATT-002', studentName: 'Priya Patel', rollNumber: 'CS2002', department: 'Computer Science', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:58:00', attendanceMethod: 'fingerprint', date: '2026-07-17' },
  { id: 'ATT-003', studentName: 'Rohan Verma', rollNumber: 'CS2003', department: 'Computer Science', attendanceStatus: 'late', attendanceDate: '2026-07-17T09:15:00', attendanceMethod: 'manual', date: '2026-07-17' },
  { id: 'ATT-004', studentName: 'Sneha Reddy', rollNumber: 'EC2001', department: 'Electronics', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:50:00', attendanceMethod: 'face', date: '2026-07-17' },
  { id: 'ATT-005', studentName: 'Arjun Nair', rollNumber: 'EC2002', department: 'Electronics', attendanceStatus: 'absent', attendanceDate: '2026-07-17T00:00:00', attendanceMethod: '--', date: '2026-07-17' },
  { id: 'ATT-006', studentName: 'Meera Joshi', rollNumber: 'MA2001', department: 'Mathematics', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:52:00', attendanceMethod: 'qr', date: '2026-07-17' },
  { id: 'ATT-007', studentName: 'Vikram Singh', rollNumber: 'MA2002', department: 'Mathematics', attendanceStatus: 'leave', attendanceDate: '2026-07-17T00:00:00', attendanceMethod: '--', date: '2026-07-17' },
  { id: 'ATT-008', studentName: 'Ananya Gupta', rollNumber: 'PH2001', department: 'Physics', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:47:00', attendanceMethod: 'fingerprint', date: '2026-07-17' },
  { id: 'ATT-009', studentName: 'Karan Mehta', rollNumber: 'PH2002', department: 'Physics', attendanceStatus: 'late', attendanceDate: '2026-07-17T09:22:00', attendanceMethod: 'manual', date: '2026-07-17' },
  { id: 'ATT-010', studentName: 'Divya Krishnan', rollNumber: 'CH2001', department: 'Chemistry', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:59:00', attendanceMethod: 'face', date: '2026-07-17' },
  { id: 'ATT-011', studentName: 'Rahul Desai', rollNumber: 'CH2002', department: 'Chemistry', attendanceStatus: 'absent', attendanceDate: '2026-07-17T00:00:00', attendanceMethod: '--', date: '2026-07-17' },
  { id: 'ATT-012', studentName: 'Neha Kapoor', rollNumber: 'CS2004', department: 'Computer Science', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:53:00', attendanceMethod: 'qr', date: '2026-07-17' },
  { id: 'ATT-013', studentName: 'Aditya Mishra', rollNumber: 'EC2003', department: 'Electronics', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:56:00', attendanceMethod: 'fingerprint', date: '2026-07-17' },
  { id: 'ATT-014', studentName: 'Pooja Iyer', rollNumber: 'CS2005', department: 'Computer Science', attendanceStatus: 'leave', attendanceDate: '2026-07-17T00:00:00', attendanceMethod: '--', date: '2026-07-17' },
  { id: 'ATT-015', studentName: 'Siddharth Rao', rollNumber: 'MA2003', department: 'Mathematics', attendanceStatus: 'late', attendanceDate: '2026-07-17T09:10:00', attendanceMethod: 'manual', date: '2026-07-17' },
  { id: 'ATT-016', studentName: 'Ishita Jain', rollNumber: 'EC2004', department: 'Electronics', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:48:00', attendanceMethod: 'face', date: '2026-07-17' },
  { id: 'ATT-017', studentName: 'Manish Yadav', rollNumber: 'PH2003', department: 'Physics', attendanceStatus: 'absent', attendanceDate: '2026-07-17T00:00:00', attendanceMethod: '--', date: '2026-07-17' },
  { id: 'ATT-018', studentName: 'Kavya Nambiar', rollNumber: 'CH2003', department: 'Chemistry', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:51:00', attendanceMethod: 'qr', date: '2026-07-17' },
  { id: 'ATT-019', studentName: 'Gaurav Bhatia', rollNumber: 'CS2006', department: 'Computer Science', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:57:00', attendanceMethod: 'fingerprint', date: '2026-07-17' },
  { id: 'ATT-020', studentName: 'Anjali Menon', rollNumber: 'EC2005', department: 'Electronics', attendanceStatus: 'late', attendanceDate: '2026-07-17T09:18:00', attendanceMethod: 'manual', date: '2026-07-17' },
  { id: 'ATT-021', studentName: 'Ravi Kumar', rollNumber: 'ME2001', department: 'Mechanical', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:54:00', attendanceMethod: 'face', date: '2026-07-17' },
  { id: 'ATT-022', studentName: 'Simran Kaur', rollNumber: 'ME2002', department: 'Mechanical', attendanceStatus: 'absent', attendanceDate: '2026-07-17T00:00:00', attendanceMethod: '--', date: '2026-07-17' },
  { id: 'ATT-023', studentName: 'Amit Patel', rollNumber: 'CE2001', department: 'Civil', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:49:00', attendanceMethod: 'fingerprint', date: '2026-07-17' },
  { id: 'ATT-024', studentName: 'Pooja Singh', rollNumber: 'CE2002', department: 'Civil', attendanceStatus: 'late', attendanceDate: '2026-07-17T09:05:00', attendanceMethod: 'manual', date: '2026-07-17' },
  { id: 'ATT-025', studentName: 'Mohit Agarwal', rollNumber: 'BT2001', department: 'Biotechnology', attendanceStatus: 'present', attendanceDate: '2026-07-17T08:46:00', attendanceMethod: 'qr', date: '2026-07-17' },
]

/* ─── ATTENDANCE STATS ─── */

const attendanceStatsData = {
  totalStudents: facultyRows.length,
  presentToday: 16,
  absentToday: 4,
  lateArrivals: 4,
  halfDay: 1,
  leaveRequests: 2,
  attendancePercentage: 86,
  total: facultyRows.length,
  present: 16,
  absent: 4,
  late: 4,
  leave: 2,
  byMonth: [
    { month: 'Jan', year: '2026', percentage: 82, present: 240, absent: 40, late: 18, total: 300 },
    { month: 'Feb', year: '2026', percentage: 85, present: 255, absent: 35, late: 10, total: 300 },
    { month: 'Mar', year: '2026', percentage: 88, present: 264, absent: 24, late: 12, total: 300 },
    { month: 'Apr', year: '2026', percentage: 84, present: 252, absent: 38, late: 10, total: 300 },
    { month: 'May', year: '2026', percentage: 86, present: 258, absent: 30, late: 12, total: 300 },
    { month: 'Jun', year: '2026', percentage: 87, present: 261, absent: 28, late: 11, total: 300 },
    { month: 'Jul', year: '2026', percentage: 86, present: 172, absent: 18, late: 10, total: 200 },
  ],
  bySubject: [
    { subjectName: 'Computer Science', present: 95, absent: 8, late: 5, total: 108, percentage: 88 },
    { subjectName: 'Mathematics', present: 88, absent: 10, late: 6, total: 104, percentage: 85 },
    { subjectName: 'Physics', present: 80, absent: 10, late: 4, total: 94, percentage: 85 },
    { subjectName: 'Chemistry', present: 75, absent: 12, late: 3, total: 90, percentage: 83 },
    { subjectName: 'Electronics', present: 90, absent: 6, late: 8, total: 104, percentage: 87 },
    { subjectName: 'Mechanical', present: 70, absent: 8, late: 2, total: 80, percentage: 88 },
    { subjectName: 'Civil', present: 65, absent: 10, late: 5, total: 80, percentage: 81 },
    { subjectName: 'Biotechnology', present: 50, absent: 5, late: 3, total: 58, percentage: 86 },
  ],
}

/* ─── ASSIGNMENTS (20 rows) ─── */

const assignmentRows = [
  { id: 'ASG-001', title: 'Data Structures Lab', assignmentTitle: 'Data Structures Lab', course: 'B.Tech CSE', subject: 'Data Structures', batch: 'CSE-A', facultyName: 'Dr. Rajesh Kumar', dueDate: '2026-07-25T00:00:00Z', createdDate: '2026-07-10T00:00:00Z', createdAt: '2026-07-10T00:00:00Z', status: 'active', totalMarks: 100, maxMarks: 100, description: 'Implement binary search tree operations.', deadline: '2026-07-25T00:00:00Z' },
  { id: 'ASG-002', title: 'Algorithm Analysis', assignmentTitle: 'Algorithm Analysis', course: 'B.Tech CSE', subject: 'Algorithms', batch: 'CSE-A', facultyName: 'Dr. Rajesh Kumar', dueDate: '2026-07-28T00:00:00Z', createdDate: '2026-07-12T00:00:00Z', status: 'active', totalMarks: 50, description: 'Solve recurrence relations and analyze sorting algorithms.', deadline: '2026-07-28T00:00:00Z' },
  { id: 'ASG-003', title: 'Linear Algebra Problem Set', assignmentTitle: 'Linear Algebra Problem Set', course: 'B.Sc Math', subject: 'Linear Algebra', batch: 'MATH-A', facultyName: 'Prof. Sunita Sharma', dueDate: '2026-07-24T00:00:00Z', createdDate: '2026-07-08T00:00:00Z', status: 'active', totalMarks: 30, description: 'Solve problems on vector spaces and linear transformations.', deadline: '2026-07-24T00:00:00Z' },
  { id: 'ASG-004', title: 'Quantum Physics Essay', assignmentTitle: 'Quantum Physics Essay', course: 'B.Sc Physics', subject: 'Quantum Mechanics', batch: 'PHY-A', facultyName: 'Dr. Amit Verma', dueDate: '2026-08-01T00:00:00Z', createdDate: '2026-07-15T00:00:00Z', status: 'active', totalMarks: 20, description: 'Write an essay on the principles of quantum entanglement.', deadline: '2026-08-01T00:00:00Z' },
  { id: 'ASG-005', title: 'Digital Logic Design', assignmentTitle: 'Digital Logic Design', course: 'B.Tech ECE', subject: 'Digital Logic', batch: 'ECE-A', facultyName: 'Dr. Vikram Singh', dueDate: '2026-07-30T00:00:00Z', createdDate: '2026-07-14T00:00:00Z', status: 'active', totalMarks: 75, description: 'Design a 4-bit adder circuit using logic gates.', deadline: '2026-07-30T00:00:00Z' },
  { id: 'ASG-006', title: 'Organic Chemistry Lab Report', assignmentTitle: 'Organic Chemistry Lab Report', course: 'B.Sc Chemistry', subject: 'Organic Chemistry', batch: 'CHEM-A', facultyName: 'Prof. Anjali Gupta', dueDate: '2026-07-26T00:00:00Z', createdDate: '2026-07-11T00:00:00Z', status: 'active', totalMarks: 50, description: 'Submit lab report on qualitative analysis of organic compounds.', deadline: '2026-07-26T00:00:00Z' },
  { id: 'ASG-007', title: 'Database Design Project', assignmentTitle: 'Database Design Project', course: 'B.Tech CSE', subject: 'Database Systems', batch: 'CSE-B', facultyName: 'Prof. Priya Patel', dueDate: '2026-08-05T00:00:00Z', createdDate: '2026-07-18T00:00:00Z', status: 'active', totalMarks: 100, description: 'Design and implement a database for a library management system.', deadline: '2026-08-05T00:00:00Z' },
  { id: 'ASG-008', title: 'Thermodynamics Problems', assignmentTitle: 'Thermodynamics Problems', course: 'B.Tech ME', subject: 'Thermodynamics', batch: 'MECH-A', facultyName: 'Dr. Manoj Tiwari', dueDate: '2026-07-27T00:00:00Z', createdDate: '2026-07-13T00:00:00Z', status: 'active', totalMarks: 40, description: 'Solve first and second law of thermodynamics problems.', deadline: '2026-07-27T00:00:00Z' },
  { id: 'ASG-009', title: 'Structural Analysis', assignmentTitle: 'Structural Analysis', course: 'B.Tech CE', subject: 'Structural Analysis', batch: 'CIVIL-A', facultyName: 'Dr. Pradeep Jain', dueDate: '2026-07-31T00:00:00Z', createdDate: '2026-07-16T00:00:00Z', status: 'active', totalMarks: 60, description: 'Analyze determinate and indeterminate structures.', deadline: '2026-07-31T00:00:00Z' },
  { id: 'ASG-010', title: 'Finance Case Study', assignmentTitle: 'Finance Case Study', course: 'BBA', subject: 'Financial Management', batch: 'BBA-A', facultyName: 'Dr. Karan Mehta', dueDate: '2026-08-02T00:00:00Z', createdDate: '2026-07-17T00:00:00Z', status: 'active', totalMarks: 30, description: 'Analyze the financial statements of a publicly traded company.', deadline: '2026-08-02T00:00:00Z' },
  { id: 'ASG-011', title: 'Calculus Assignment', assignmentTitle: 'Calculus Assignment', course: 'B.Sc Math', subject: 'Calculus', batch: 'MATH-A', facultyName: 'Dr. Suresh Reddy', dueDate: '2026-07-23T00:00:00Z', createdDate: '2026-07-09T00:00:00Z', status: 'completed', totalMarks: 25, description: 'Solve problems on integration techniques.', deadline: '2026-07-23T00:00:00Z' },
  { id: 'ASG-012', title: 'ML Model Implementation', assignmentTitle: 'ML Model Implementation', course: 'B.Tech CSE', subject: 'Machine Learning', batch: 'CSE-A', facultyName: 'Prof. Deepa Krishnan', dueDate: '2026-08-10T00:00:00Z', createdDate: '2026-07-20T00:00:00Z', status: 'active', totalMarks: 100, description: 'Implement a linear regression model on a real dataset.', deadline: '2026-08-10T00:00:00Z' },
  { id: 'ASG-013', title: 'Network Protocol Analysis', assignmentTitle: 'Network Protocol Analysis', course: 'B.Tech CSE', subject: 'Computer Networks', batch: 'CSE-B', facultyName: 'Dr. Rohan Bose', dueDate: '2026-08-03T00:00:00Z', createdDate: '2026-07-19T00:00:00Z', status: 'active', totalMarks: 50, description: 'Analyze TCP/IP packet captures using Wireshark.', deadline: '2026-08-03T00:00:00Z' },
  { id: 'ASG-014', title: 'Microprocessor Programming', assignmentTitle: 'Microprocessor Programming', course: 'B.Tech ECE', subject: 'Microprocessors', batch: 'ECE-A', facultyName: 'Prof. Ritu Agarwal', dueDate: '2026-07-29T00:00:00Z', createdDate: '2026-07-14T00:00:00Z', status: 'active', totalMarks: 80, description: 'Write assembly programs for 8085 microprocessor.', deadline: '2026-07-29T00:00:00Z' },
  { id: 'ASG-015', title: 'VLSI Layout Design', assignmentTitle: 'VLSI Layout Design', course: 'B.Tech ECE', subject: 'VLSI Design', batch: 'ECE-B', facultyName: 'Prof. Tanvi Shah', dueDate: '2026-08-07T00:00:00Z', createdDate: '2026-07-21T00:00:00Z', status: 'active', totalMarks: 100, description: 'Design CMOS inverter layout using EDA tools.', deadline: '2026-08-07T00:00:00Z' },
  { id: 'ASG-016', title: 'Electromagnetism Problems', assignmentTitle: 'Electromagnetism Problems', course: 'B.Sc Physics', subject: 'Electromagnetism', batch: 'PHY-B', facultyName: 'Dr. Arjun Joshi', dueDate: '2026-07-22T00:00:00Z', createdDate: '2026-07-07T00:00:00Z', status: 'completed', totalMarks: 35, description: 'Solve Maxwell equation problems.', deadline: '2026-07-22T00:00:00Z' },
  { id: 'ASG-017', title: 'Inorganic Chemistry Quiz', assignmentTitle: 'Inorganic Chemistry Quiz', course: 'B.Sc Chemistry', subject: 'Inorganic Chemistry', batch: 'CHEM-B', facultyName: 'Prof. Swati Deshmukh', dueDate: '2026-07-24T00:00:00Z', createdDate: '2026-07-10T00:00:00Z', status: 'active', totalMarks: 20, description: 'Quiz on periodic table trends and bonding.', deadline: '2026-07-24T00:00:00Z' },
  { id: 'ASG-018', title: 'Fluid Mechanics Lab', assignmentTitle: 'Fluid Mechanics Lab', course: 'B.Tech ME', subject: 'Fluid Mechanics', batch: 'MECH-B', facultyName: 'Dr. Akash Dave', dueDate: '2026-08-04T00:00:00Z', createdDate: '2026-07-18T00:00:00Z', status: 'active', totalMarks: 60, description: 'Perform flow measurement experiments and submit report.', deadline: '2026-08-04T00:00:00Z' },
  { id: 'ASG-019', title: 'Geotechnical Lab Report', assignmentTitle: 'Geotechnical Lab Report', course: 'B.Tech CE', subject: 'Geotechnical Engg.', batch: 'CIVIL-B', facultyName: 'Dr. Vivek Saxena', dueDate: '2026-08-06T00:00:00Z', createdDate: '2026-07-20T00:00:00Z', status: 'active', totalMarks: 50, description: 'Submit report on soil classification tests.', deadline: '2026-08-06T00:00:00Z' },
  { id: 'ASG-020', title: 'Molecular Biology Assignment', assignmentTitle: 'Molecular Biology Assignment', course: 'B.Sc Biotech', subject: 'Molecular Biology', batch: 'BT-A', facultyName: 'Prof. Neha Gupta', dueDate: '2026-07-30T00:00:00Z', createdDate: '2026-07-15T00:00:00Z', status: 'active', totalMarks: 40, description: 'Describe DNA replication and transcription mechanisms.', deadline: '2026-07-30T00:00:00Z' },
]

/* ─── HOLIDAYS (22 rows) ─── */

const holidayRows = [
  { id: 'HOL-001', name: 'Republic Day', holidayName: 'Republic Day', date: '2026-01-26T00:00:00Z', holidayDate: '2026-01-26', day: 'Monday', type: 'national', department: 'All', status: 'upcoming', description: 'Celebration of the Constitution of India' },
  { id: 'HOL-002', name: 'Maha Shivaratri', date: '2026-02-19T00:00:00Z', day: 'Thursday', type: 'festival', department: 'All', status: 'upcoming', description: 'Festival dedicated to Lord Shiva' },
  { id: 'HOL-003', name: 'Holi', date: '2026-03-06T00:00:00Z', day: 'Friday', type: 'festival', department: 'All', status: 'upcoming', description: 'Festival of colors' },
  { id: 'HOL-004', name: 'Good Friday', date: '2026-04-03T00:00:00Z', day: 'Friday', type: 'national', department: 'All', status: 'upcoming', description: 'Christian holiday commemorating crucifixion' },
  { id: 'HOL-005', name: 'Ambedkar Jayanti', date: '2026-04-14T00:00:00Z', day: 'Tuesday', type: 'national', department: 'All', status: 'upcoming', description: 'Birth anniversary of Dr. B.R. Ambedkar' },
  { id: 'HOL-006', name: 'Summer Break', date: '2026-05-01T00:00:00Z', day: 'Friday', type: 'academic', department: 'All', status: 'upcoming', description: 'Summer vacation begins' },
  { id: 'HOL-007', name: 'Independence Day', date: '2026-08-15T00:00:00Z', day: 'Saturday', type: 'national', department: 'All', status: 'upcoming', description: 'Independence Day celebrations' },
  { id: 'HOL-008', name: 'Raksha Bandhan', date: '2026-08-28T00:00:00Z', day: 'Friday', type: 'festival', department: 'All', status: 'upcoming', description: 'Festival celebrating sibling bond' },
  { id: 'HOL-009', name: 'Ganesh Chaturthi', date: '2026-09-10T00:00:00Z', day: 'Thursday', type: 'festival', department: 'All', status: 'upcoming', description: 'Festival honoring Lord Ganesha' },
  { id: 'HOL-010', name: 'Gandhi Jayanti', date: '2026-10-02T00:00:00Z', day: 'Friday', type: 'national', department: 'All', status: 'upcoming', description: 'Birth anniversary of Mahatma Gandhi' },
  { id: 'HOL-011', name: 'Dussehra', date: '2026-10-21T00:00:00Z', day: 'Wednesday', type: 'festival', department: 'All', status: 'upcoming', description: 'Victory of good over evil' },
  { id: 'HOL-012', name: 'Diwali', date: '2026-11-09T00:00:00Z', day: 'Monday', type: 'festival', department: 'All', status: 'upcoming', description: 'Festival of lights' },
  { id: 'HOL-013', name: 'Guru Nanak Jayanti', date: '2026-11-24T00:00:00Z', day: 'Tuesday', type: 'national', department: 'All', status: 'upcoming', description: 'Birth anniversary of Guru Nanak' },
  { id: 'HOL-014', name: 'Christmas', date: '2026-12-25T00:00:00Z', day: 'Friday', type: 'national', department: 'All', status: 'upcoming', description: 'Christmas celebrations' },
  { id: 'HOL-015', name: 'Winter Break', date: '2026-12-28T00:00:00Z', day: 'Monday', type: 'academic', department: 'All', status: 'upcoming', description: 'Winter vacation begins' },
  { id: 'HOL-016', name: 'Foundation Day', date: '2026-09-15T00:00:00Z', day: 'Tuesday', type: 'event', department: 'All', status: 'upcoming', description: 'College foundation day celebrations' },
  { id: 'HOL-017', name: 'Sports Day', date: '2026-08-30T00:00:00Z', day: 'Sunday', type: 'event', department: 'All', status: 'upcoming', description: 'Annual sports day' },
  { id: 'HOL-018', name: 'Annual Day', date: '2026-12-20T00:00:00Z', day: 'Sunday', type: 'event', department: 'All', status: 'upcoming', description: 'Annual day celebrations' },
  { id: 'HOL-019', name: 'Technical Fest', date: '2026-10-15T00:00:00Z', day: 'Thursday', type: 'event', department: 'All', status: 'upcoming', description: 'Inter-college technical festival' },
  { id: 'HOL-020', name: 'Research Symposium', date: '2026-11-15T00:00:00Z', day: 'Sunday', type: 'event', department: 'All', status: 'upcoming', description: 'Annual research symposium' },
  { id: 'HOL-021', name: 'Eid-ul-Fitr', date: '2026-04-12T00:00:00Z', day: 'Sunday', type: 'festival', department: 'All', status: 'upcoming', description: 'Festival marking end of Ramadan' },
  { id: 'HOL-022', name: 'Eid-ul-Adha', date: '2026-06-18T00:00:00Z', day: 'Thursday', type: 'festival', department: 'All', status: 'upcoming', description: 'Festival of sacrifice' },
]

/* ─── DASHBOARD STATS ─── */

const adminDashboardData = {
  totalFaculty: facultyRows.length,
  activeFaculty: facultyRows.filter((f) => f.status === 'Active').length,
  totalDepartments: 8,
  assignedCourses: 12,
  totalClasses: 18,
  todayClasses: 18,
  pendingAssignments: 15,
  upcomingHolidays: 5,
  pendingLeaves: 3,
}

const facultyDashboardData = {
  myClasses: 4,
  myStudents: 120,
  mySubjects: 3,
  todayAttendanceRate: 86,
  todayAttendance: 86,
  assignmentsDue: 2,
  assignments: 2,
  pendingEvaluations: 5,
  pendingWork: 5,
}

/* ─── MATERIALS (20 rows) ─── */

const materialRows = [
  { id: 'MAT-001', title: 'Data Structures Lecture Notes', name: 'Data Structures Lecture Notes', type: 'pdf', fileType: 'pdf', category: 'Lecture Notes', url: '/mock/materials/ds-notes.pdf', fileUrl: '/mock/materials/ds-notes.pdf', fileSize: 2048000, size: 2048000, facultyName: 'Dr. Rajesh Kumar', uploadedBy: 'Dr. Rajesh Kumar', course: 'B.Tech CSE', subject: 'Data Structures', uploadedAt: '2026-07-10T00:00:00Z', createdAt: '2026-07-10T00:00:00Z', downloads: 45, downloadCount: 45, description: 'Comprehensive notes on data structures' },
  { id: 'MAT-002', title: 'Algorithm Textbook', name: 'Algorithm Textbook', type: 'pdf', fileType: 'pdf', category: 'Textbooks', url: '/mock/materials/algos.pdf', fileSize: 5120000, facultyName: 'Dr. Rajesh Kumar', course: 'B.Tech CSE', subject: 'Algorithms', uploadedAt: '2026-06-15T00:00:00Z', downloads: 120, description: 'Introduction to Algorithms' },
  { id: 'MAT-003', title: 'Linear Algebra Video', name: 'Linear Algebra Video', type: 'video', fileType: 'mp4', category: 'Recorded Lectures', url: '/mock/materials/la-video.mp4', fileSize: 102400000, facultyName: 'Prof. Sunita Sharma', course: 'B.Sc Math', subject: 'Linear Algebra', uploadedAt: '2026-07-05T00:00:00Z', downloads: 89, description: 'Recorded lecture on vector spaces' },
  { id: 'MAT-004', title: 'Quantum Mechanics Lab Manual', name: 'Quantum Mechanics Lab Manual', type: 'pdf', fileType: 'pdf', category: 'Lab Manuals', url: '/mock/materials/qm-lab.pdf', fileSize: 1536000, facultyName: 'Dr. Amit Verma', course: 'B.Sc Physics', subject: 'Quantum Mechanics', uploadedAt: '2026-07-01T00:00:00Z', downloads: 34, description: 'Lab manual for quantum mechanics experiments' },
  { id: 'MAT-005', title: 'Digital Logic Workbook', name: 'Digital Logic Workbook', type: 'pdf', category: 'Workbooks', url: '/mock/materials/dl-workbook.pdf', fileSize: 3072000, facultyName: 'Dr. Vikram Singh', course: 'B.Tech ECE', subject: 'Digital Logic', uploadedAt: '2026-07-08T00:00:00Z', downloads: 56, description: 'Practice workbook with logic design problems' },
  { id: 'MAT-006', title: 'Organic Chemistry Slides', name: 'Organic Chemistry Slides', type: 'pdf', category: 'Lecture Slides', url: '/mock/materials/oc-slides.pdf', fileSize: 5120000, facultyName: 'Prof. Anjali Gupta', course: 'B.Sc Chemistry', subject: 'Organic Chemistry', uploadedAt: '2026-07-12T00:00:00Z', downloads: 67, description: 'Lecture slides for organic chemistry' },
  { id: 'MAT-007', title: 'Database Systems Reference', name: 'Database Systems Reference', type: 'pdf', category: 'Reference Material', url: '/mock/materials/db-ref.pdf', fileSize: 4096000, facultyName: 'Prof. Priya Patel', course: 'B.Tech CSE', subject: 'Database Systems', uploadedAt: '2026-06-20T00:00:00Z', downloads: 78, description: 'SQL reference guide' },
  { id: 'MAT-008', title: 'Thermodynamics Formula Sheet', name: 'Thermodynamics Formula Sheet', type: 'pdf', category: 'Formula Sheets', url: '/mock/materials/thermo-formulas.pdf', fileSize: 512000, facultyName: 'Dr. Manoj Tiwari', course: 'B.Tech ME', subject: 'Thermodynamics', uploadedAt: '2026-07-15T00:00:00Z', downloads: 92, description: 'Quick reference for thermodynamics formulas' },
  { id: 'MAT-009', title: 'Structural Analysis Videos', name: 'Structural Analysis Videos', type: 'video', category: 'Recorded Lectures', url: '/mock/materials/sa-videos.mp4', fileSize: 204800000, facultyName: 'Dr. Pradeep Jain', course: 'B.Tech CE', subject: 'Structural Analysis', uploadedAt: '2026-07-03T00:00:00Z', downloads: 45, description: 'Video series on structural analysis methods' },
  { id: 'MAT-010', title: 'Financial Management Notes', name: 'Financial Management Notes', type: 'pdf', category: 'Lecture Notes', url: '/mock/materials/fm-notes.pdf', fileSize: 2048000, facultyName: 'Dr. Karan Mehta', course: 'BBA', subject: 'Financial Management', uploadedAt: '2026-07-11T00:00:00Z', downloads: 34, description: 'Lecture notes on financial management' },
  { id: 'MAT-011', title: 'Calculus Problem Set', name: 'Calculus Problem Set', type: 'pdf', category: 'Assignments', url: '/mock/materials/calc-problems.pdf', fileSize: 1024000, facultyName: 'Dr. Suresh Reddy', course: 'B.Sc Math', subject: 'Calculus', uploadedAt: '2026-07-06T00:00:00Z', downloads: 55, description: 'Practice problems for calculus' },
  { id: 'MAT-012', title: 'Machine Learning Cheat Sheet', name: 'Machine Learning Cheat Sheet', type: 'pdf', category: 'Formula Sheets', url: '/mock/materials/ml-cheatsheet.pdf', fileSize: 768000, facultyName: 'Prof. Deepa Krishnan', course: 'B.Tech CSE', subject: 'Machine Learning', uploadedAt: '2026-07-18T00:00:00Z', downloads: 110, description: 'Comprehensive ML algorithms reference' },
  { id: 'MAT-013', title: 'Computer Networks Lab Manual', name: 'Computer Networks Lab Manual', type: 'pdf', category: 'Lab Manuals', url: '/mock/materials/cn-lab.pdf', fileSize: 2048000, facultyName: 'Dr. Rohan Bose', course: 'B.Tech CSE', subject: 'Computer Networks', uploadedAt: '2026-07-09T00:00:00Z', downloads: 23, description: 'Cisco packet tracer lab exercises' },
  { id: 'MAT-014', title: 'Microprocessor Programming Guide', name: 'Microprocessor Programming Guide', type: 'pdf', category: 'Reference Material', url: '/mock/materials/mp-guide.pdf', fileSize: 3072000, facultyName: 'Prof. Ritu Agarwal', course: 'B.Tech ECE', subject: 'Microprocessors', uploadedAt: '2026-07-14T00:00:00Z', downloads: 41, description: '8085 programming guide with examples' },
  { id: 'MAT-015', title: 'VLSI Design Textbook', name: 'VLSI Design Textbook', type: 'pdf', category: 'Textbooks', url: '/mock/materials/vlsi-book.pdf', fileSize: 8192000, facultyName: 'Prof. Tanvi Shah', course: 'B.Tech ECE', subject: 'VLSI Design', uploadedAt: '2026-06-25T00:00:00Z', downloads: 67, description: 'Comprehensive VLSI design textbook' },
  { id: 'MAT-016', title: 'Electromagnetism Lecture Recordings', name: 'Electromagnetism Lecture Recordings', type: 'video', category: 'Recorded Lectures', url: '/mock/materials/em-lectures.mp4', fileSize: 307200000, facultyName: 'Dr. Arjun Joshi', course: 'B.Sc Physics', subject: 'Electromagnetism', uploadedAt: '2026-06-28T00:00:00Z', downloads: 38, description: 'Complete lecture recording series' },
  { id: 'MAT-017', title: 'Inorganic Chemistry Notes', name: 'Inorganic Chemistry Notes', type: 'pdf', category: 'Lecture Notes', url: '/mock/materials/ic-notes.pdf', fileSize: 2560000, facultyName: 'Prof. Swati Deshmukh', course: 'B.Sc Chemistry', subject: 'Inorganic Chemistry', uploadedAt: '2026-07-13T00:00:00Z', downloads: 44, description: 'Detailed inorganic chemistry notes' },
  { id: 'MAT-018', title: 'Fluid Mechanics Lab Videos', name: 'Fluid Mechanics Lab Videos', type: 'video', category: 'Recorded Lectures', url: '/mock/materials/fm-videos.mp4', fileSize: 153600000, facultyName: 'Dr. Akash Dave', course: 'B.Tech ME', subject: 'Fluid Mechanics', uploadedAt: '2026-07-16T00:00:00Z', downloads: 29, description: 'Lab demonstration videos' },
  { id: 'MAT-019', title: 'Genetics Research Papers', name: 'Genetics Research Papers', type: 'pdf', category: 'Research Material', url: '/mock/materials/genetics-papers.pdf', fileSize: 6144000, facultyName: 'Dr. Farhan Ali', course: 'B.Sc Biotech', subject: 'Genetics', uploadedAt: '2026-07-02T00:00:00Z', downloads: 56, description: 'Collection of seminal genetics research papers' },
  { id: 'MAT-020', title: 'British Literature Anthology', name: 'British Literature Anthology', type: 'pdf', category: 'Textbooks', url: '/mock/materials/bl-anthology.pdf', fileSize: 10240000, facultyName: 'Prof. Meera Nair', course: 'B.A English', subject: 'British Literature', uploadedAt: '2026-06-30T00:00:00Z', downloads: 33, description: 'Anthology of British literary works' },
]

/* ─── NOTIFICATIONS (20 rows) ─── */

const notificationRows = [
  { id: 'NOTIF-001', type: 'low-attendance', title: 'Low Attendance Alert', description: 'Aarav Sharma has below 75% attendance this month', studentName: 'Aarav Sharma', rollNumber: 'CS2001', severity: 'high', date: '2026-07-17T00:00:00Z' },
  { id: 'NOTIF-002', type: 'correction-request', title: 'Correction Requested', description: 'Priya Patel requested attendance correction for Jul 15', studentName: 'Priya Patel', rollNumber: 'CS2002', severity: 'medium', date: '2026-07-16T00:00:00Z' },
  { id: 'NOTIF-003', type: 'leave-request', title: 'Leave Application', description: 'Rohan Verma applied for 3 days medical leave', studentName: 'Rohan Verma', rollNumber: 'CS2003', severity: 'high', date: '2026-07-17T00:00:00Z' },
  { id: 'NOTIF-004', type: 'low-attendance', title: 'Attendance Warning', description: 'Sneha Reddy attendance dropped to 70%', studentName: 'Sneha Reddy', rollNumber: 'EC2001', severity: 'high', date: '2026-07-15T00:00:00Z' },
  { id: 'NOTIF-005', type: 'correction-request', title: 'Bulk Correction', description: 'Arjun Nair requested correction for last week records', studentName: 'Arjun Nair', rollNumber: 'EC2002', severity: 'low', date: '2026-07-14T00:00:00Z' },
  { id: 'NOTIF-006', type: 'leave-request', title: 'Leave Approved', description: 'Meera Joshi leave request for Jul 20 approved', studentName: 'Meera Joshi', rollNumber: 'MA2001', severity: 'medium', date: '2026-07-17T00:00:00Z' },
  { id: 'NOTIF-007', type: 'low-attendance', title: 'Attendance Concern', description: 'Vikram Singh attendance at 68% - needs counseling', studentName: 'Vikram Singh', rollNumber: 'MA2002', severity: 'high', date: '2026-07-16T00:00:00Z' },
  { id: 'NOTIF-008', type: 'correction-request', title: 'Mark Correction', description: 'Ananya Gupta marked absent on Jul 12 was actually present', studentName: 'Ananya Gupta', rollNumber: 'PH2001', severity: 'medium', date: '2026-07-15T00:00:00Z' },
  { id: 'NOTIF-009', type: 'leave-request', title: 'Emergency Leave', description: 'Karan Mehta applied for emergency leave', studentName: 'Karan Mehta', rollNumber: 'PH2002', severity: 'high', date: '2026-07-17T00:00:00Z' },
  { id: 'NOTIF-010', type: 'low-attendance', title: 'Attendance Update', description: 'Divya Krishnan improved attendance to 82%', studentName: 'Divya Krishnan', rollNumber: 'CH2001', severity: 'medium', date: '2026-07-14T00:00:00Z' },
  { id: 'NOTIF-011', type: 'correction-request', title: 'System Correction', description: 'Rahul Desai attendance auto-corrected for Jul 10', studentName: 'Rahul Desai', rollNumber: 'CH2002', severity: 'low', date: '2026-07-13T00:00:00Z' },
  { id: 'NOTIF-012', type: 'leave-request', title: 'Leave Extension', description: 'Neha Kapoor extended leave until Jul 25', studentName: 'Neha Kapoor', rollNumber: 'CS2004', severity: 'medium', date: '2026-07-16T00:00:00Z' },
  { id: 'NOTIF-013', type: 'low-attendance', title: 'Attendance Reminder', description: 'Multiple students in ECE below 75% attendance', studentName: 'Batch ECE-A', rollNumber: 'EC', severity: 'high', date: '2026-07-17T00:00:00Z' },
  { id: 'NOTIF-014', type: 'correction-request', title: 'Weekend Correction', description: 'Aditya Mishra requested correction for Jul 13 (Saturday)', studentName: 'Aditya Mishra', rollNumber: 'EC2003', severity: 'low', date: '2026-07-15T00:00:00Z' },
  { id: 'NOTIF-015', type: 'leave-request', title: 'Study Leave', description: 'Pooja Iyer applied for 5 days study leave', studentName: 'Pooja Iyer', rollNumber: 'CS2005', severity: 'medium', date: '2026-07-17T00:00:00Z' },
  { id: 'NOTIF-016', type: 'low-attendance', title: 'Attendance Improvement', description: 'Siddharth Rao attendance back to 80%', studentName: 'Siddharth Rao', rollNumber: 'MA2003', severity: 'low', date: '2026-07-14T00:00:00Z' },
  { id: 'NOTIF-017', type: 'correction-request', title: 'Late Mark Correction', description: 'Ishita Jain late mark on Jul 14 should be present', studentName: 'Ishita Jain', rollNumber: 'EC2004', severity: 'medium', date: '2026-07-16T00:00:00Z' },
  { id: 'NOTIF-018', type: 'leave-request', title: 'Medical Leave', description: 'Manish Yadav applied for 2 weeks medical leave', studentName: 'Manish Yadav', rollNumber: 'PH2003', severity: 'high', date: '2026-07-17T00:00:00Z' },
  { id: 'NOTIF-019', type: 'low-attendance', title: 'Department Report', description: 'Chemistry department attendance lowest this month at 78%', studentName: 'Chemistry Dept', rollNumber: 'CH', severity: 'medium', date: '2026-07-15T00:00:00Z' },
  { id: 'NOTIF-020', type: 'correction-request', title: 'Bulk Attendance Fix', description: 'Gaurav Bhatia requested bulk correction for last month', studentName: 'Gaurav Bhatia', rollNumber: 'CS2006', severity: 'low', date: '2026-07-14T00:00:00Z' },
]

/* ─── CORRECTION REQUESTS (20 rows) ─── */

const correctionRows = [
  { id: 'COR-001', studentName: 'Aarav Sharma', rollNumber: 'CS2001', department: 'Computer Science', subject: 'Data Structures', attendanceDate: '2026-07-15T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'I was present in class but marked absent by mistake', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-16T10:30:00Z' },
  { id: 'COR-002', studentName: 'Priya Patel', rollNumber: 'CS2002', department: 'Computer Science', subject: 'Algorithms', attendanceDate: '2026-07-14T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Medical appointment with doctor note attached', attachment: '/mock/attachments/doc-note.pdf', approvalStatus: 'approved', createdAt: '2026-07-14T09:00:00Z', reviewedBy: 'Dr. Rajesh Kumar', reviewedAt: '2026-07-15T14:00:00Z', remarks: 'Valid medical certificate provided' },
  { id: 'COR-003', studentName: 'Rohan Verma', rollNumber: 'CS2003', department: 'Computer Science', subject: 'Database Systems', attendanceDate: '2026-07-13T00:00:00Z', currentStatus: 'late', requestedStatus: 'present', reason: 'Bus arrived late due to traffic', attachment: null, approvalStatus: 'rejected', createdAt: '2026-07-13T11:00:00Z', reviewedBy: 'Prof. Priya Patel', reviewedAt: '2026-07-14T10:00:00Z', remarks: 'Late arrival is not grounds for correction' },
  { id: 'COR-004', studentName: 'Sneha Reddy', rollNumber: 'EC2001', department: 'Electronics', subject: 'Digital Logic', attendanceDate: '2026-07-12T00:00:00Z', currentStatus: 'absent', requestedStatus: 'leave', reason: 'Was participating in inter-college competition', attachment: '/mock/attachments/competition-letter.pdf', approvalStatus: 'pending', createdAt: '2026-07-15T08:00:00Z' },
  { id: 'COR-005', studentName: 'Meera Joshi', rollNumber: 'MA2001', department: 'Mathematics', subject: 'Linear Algebra', attendanceDate: '2026-07-14T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Submitted assignment late due to illness', attachment: null, approvalStatus: 'approved', createdAt: '2026-07-15T15:00:00Z', reviewedBy: 'Prof. Sunita Sharma', reviewedAt: '2026-07-16T09:00:00Z', remarks: 'Student was actually present' },
  { id: 'COR-006', studentName: 'Karan Mehta', rollNumber: 'PH2002', department: 'Physics', subject: 'Quantum Mechanics', attendanceDate: '2026-07-11T00:00:00Z', currentStatus: 'absent', requestedStatus: 'half_day', reason: 'Left early due to family emergency', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-12T10:00:00Z' },
  { id: 'COR-007', studentName: 'Divya Krishnan', rollNumber: 'CH2001', department: 'Chemistry', subject: 'Organic Chemistry', attendanceDate: '2026-07-10T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Attendance system error - was present throughout', attachment: '/mock/attachments/proof-photo.jpg', approvalStatus: 'approved', createdAt: '2026-07-10T16:00:00Z', reviewedBy: 'Prof. Anjali Gupta', reviewedAt: '2026-07-11T10:00:00Z', remarks: 'Verified via CCTV footage' },
  { id: 'COR-008', studentName: 'Rahul Desai', rollNumber: 'CH2002', department: 'Chemistry', subject: 'Inorganic Chemistry', attendanceDate: '2026-07-09T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Was present but biometric didn\'t register', attachment: null, approvalStatus: 'rejected', createdAt: '2026-07-10T09:00:00Z', reviewedBy: 'Prof. Swati Deshmukh', reviewedAt: '2026-07-11T08:00:00Z', remarks: 'No supporting evidence provided' },
  { id: 'COR-009', studentName: 'Neha Kapoor', rollNumber: 'CS2004', department: 'Computer Science', subject: 'Machine Learning', attendanceDate: '2026-07-08T00:00:00Z', currentStatus: 'absent', requestedStatus: 'leave', reason: 'Attended machine learning workshop at IIT', attachment: '/mock/attachments/workshop-cert.pdf', approvalStatus: 'pending', createdAt: '2026-07-09T14:00:00Z' },
  { id: 'COR-010', studentName: 'Aditya Mishra', rollNumber: 'EC2003', department: 'Electronics', subject: 'Microprocessors', attendanceDate: '2026-07-07T00:00:00Z', currentStatus: 'late', requestedStatus: 'present', reason: 'Train delay', attachment: '/mock/attachments/train-ticket.pdf', approvalStatus: 'approved', createdAt: '2026-07-08T11:00:00Z', reviewedBy: 'Prof. Ritu Agarwal', reviewedAt: '2026-07-09T10:00:00Z', remarks: 'Valid train delay proof submitted' },
  { id: 'COR-011', studentName: 'Pooja Iyer', rollNumber: 'CS2005', department: 'Computer Science', subject: 'Computer Networks', attendanceDate: '2026-07-06T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Network lab attendance not recorded', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-07T08:30:00Z' },
  { id: 'COR-012', studentName: 'Siddharth Rao', rollNumber: 'MA2003', department: 'Mathematics', subject: 'Statistics', attendanceDate: '2026-07-05T00:00:00Z', currentStatus: 'absent', requestedStatus: 'half_day', reason: 'Medical checkup in the morning, came for later classes', attachment: '/mock/attachments/medical-slip.pdf', approvalStatus: 'approved', createdAt: '2026-07-05T16:00:00Z', reviewedBy: 'Dr. Suresh Reddy', reviewedAt: '2026-07-06T09:00:00Z', remarks: 'Half day approved with medical proof' },
  { id: 'COR-013', studentName: 'Ishita Jain', rollNumber: 'EC2004', department: 'Electronics', subject: 'VLSI Design', attendanceDate: '2026-07-04T00:00:00Z', currentStatus: 'present', requestedStatus: 'absent', reason: 'Actually was absent - marked present by error', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-05T10:00:00Z' },
  { id: 'COR-014', studentName: 'Manish Yadav', rollNumber: 'PH2003', department: 'Physics', subject: 'Electromagnetism', attendanceDate: '2026-07-03T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Lab experiment ran late, came in after attendance', attachment: null, approvalStatus: 'rejected', createdAt: '2026-07-04T15:00:00Z', reviewedBy: 'Dr. Arjun Joshi', reviewedAt: '2026-07-05T11:00:00Z', remarks: 'Late arrival policy applies' },
  { id: 'COR-015', studentName: 'Kavya Nambiar', rollNumber: 'CH2003', department: 'Chemistry', subject: 'Physical Chemistry', attendanceDate: '2026-07-02T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Was present but QR code scan failed', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-03T09:00:00Z' },
  { id: 'COR-016', studentName: 'Gaurav Bhatia', rollNumber: 'CS2006', department: 'Computer Science', subject: 'Operating Systems', attendanceDate: '2026-06-30T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'System glitch - was present whole day', attachment: '/mock/attachments/cctv-footage.jpg', approvalStatus: 'pending', createdAt: '2026-07-01T12:00:00Z' },
  { id: 'COR-017', studentName: 'Anjali Menon', rollNumber: 'EC2005', department: 'Electronics', subject: 'Signal Processing', attendanceDate: '2026-06-28T00:00:00Z', currentStatus: 'leave', requestedStatus: 'present', reason: 'Leave was pre-approved but I attended class', attachment: null, approvalStatus: 'pending', createdAt: '2026-06-29T10:00:00Z' },
  { id: 'COR-018', studentName: 'Ravi Kumar', rollNumber: 'ME2001', department: 'Mechanical', subject: 'Thermodynamics', attendanceDate: '2026-06-27T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Transport strike - came on foot but was present', attachment: null, approvalStatus: 'approved', createdAt: '2026-06-28T08:00:00Z', reviewedBy: 'Dr. Manoj Tiwari', reviewedAt: '2026-06-29T10:00:00Z', remarks: 'Valid reason accepted' },
  { id: 'COR-019', studentName: 'Simran Kaur', rollNumber: 'ME2002', department: 'Mechanical', subject: 'Fluid Mechanics', attendanceDate: '2026-06-26T00:00:00Z', currentStatus: 'absent', requestedStatus: 'half_day', reason: 'Had a job interview in the morning', attachment: '/mock/attachments/interview-call.pdf', approvalStatus: 'approved', createdAt: '2026-06-26T14:00:00Z', reviewedBy: 'Dr. Akash Dave', reviewedAt: '2026-06-27T09:00:00Z', remarks: 'Half day approved - interview call letter verified' },
  { id: 'COR-020', studentName: 'Amit Patel', rollNumber: 'CE2001', department: 'Civil', subject: 'Structural Analysis', attendanceDate: '2026-06-25T00:00:00Z', currentStatus: 'absent', requestedStatus: 'present', reason: 'Site visit was educational - should be counted as present', attachment: '/mock/attachments/site-visit-report.pdf', approvalStatus: 'pending', createdAt: '2026-06-26T11:00:00Z' },
]

/* ─── HISTORY RECORDS (25 rows) ─── */

const historyRows = [
  { id: 'HIST-001', date: '2026-07-17T00:00:00Z', studentName: 'Aarav Sharma', rollNumber: 'CS2001', department: 'Computer Science', course: 'B.Tech CSE', batch: 'CSE-A', subject: 'Data Structures', status: 'present', method: 'face', faculty: 'Dr. Rajesh Kumar', time: '08:55' },
  { id: 'HIST-002', date: '2026-07-17T00:00:00Z', studentName: 'Priya Patel', rollNumber: 'CS2002', department: 'Computer Science', course: 'B.Tech CSE', batch: 'CSE-A', subject: 'Data Structures', status: 'present', method: 'fingerprint', faculty: 'Dr. Rajesh Kumar', time: '08:58' },
  { id: 'HIST-003', date: '2026-07-17T00:00:00Z', studentName: 'Rohan Verma', rollNumber: 'CS2003', department: 'Computer Science', course: 'B.Tech CSE', batch: 'CSE-A', subject: 'Data Structures', status: 'late', method: 'manual', faculty: 'Dr. Rajesh Kumar', time: '09:15' },
  { id: 'HIST-004', date: '2026-07-16T00:00:00Z', studentName: 'Sneha Reddy', rollNumber: 'EC2001', department: 'Electronics', course: 'B.Tech ECE', batch: 'ECE-A', subject: 'Digital Logic', status: 'present', method: 'face', faculty: 'Dr. Vikram Singh', time: '08:50' },
  { id: 'HIST-005', date: '2026-07-16T00:00:00Z', studentName: 'Arjun Nair', rollNumber: 'EC2002', department: 'Electronics', course: 'B.Tech ECE', batch: 'ECE-A', subject: 'Digital Logic', status: 'absent', method: 'manual', faculty: 'Dr. Vikram Singh', time: '--' },
  { id: 'HIST-006', date: '2026-07-16T00:00:00Z', studentName: 'Meera Joshi', rollNumber: 'MA2001', department: 'Mathematics', course: 'B.Sc Math', batch: 'MATH-A', subject: 'Linear Algebra', status: 'present', method: 'qr', faculty: 'Prof. Sunita Sharma', time: '08:52' },
  { id: 'HIST-007', date: '2026-07-16T00:00:00Z', studentName: 'Vikram Singh', rollNumber: 'MA2002', department: 'Mathematics', course: 'B.Sc Math', batch: 'MATH-A', subject: 'Linear Algebra', status: 'leave', method: 'manual', faculty: 'Prof. Sunita Sharma', time: '--' },
  { id: 'HIST-008', date: '2026-07-15T00:00:00Z', studentName: 'Ananya Gupta', rollNumber: 'PH2001', department: 'Physics', course: 'B.Sc Physics', batch: 'PHY-A', subject: 'Quantum Mechanics', status: 'present', method: 'fingerprint', faculty: 'Dr. Amit Verma', time: '08:47' },
  { id: 'HIST-009', date: '2026-07-15T00:00:00Z', studentName: 'Karan Mehta', rollNumber: 'PH2002', department: 'Physics', course: 'B.Sc Physics', batch: 'PHY-A', subject: 'Quantum Mechanics', status: 'late', method: 'manual', faculty: 'Dr. Amit Verma', time: '09:22' },
  { id: 'HIST-010', date: '2026-07-15T00:00:00Z', studentName: 'Divya Krishnan', rollNumber: 'CH2001', department: 'Chemistry', course: 'B.Sc Chemistry', batch: 'CHEM-A', subject: 'Organic Chemistry', status: 'present', method: 'face', faculty: 'Prof. Anjali Gupta', time: '08:59' },
  { id: 'HIST-011', date: '2026-07-15T00:00:00Z', studentName: 'Rahul Desai', rollNumber: 'CH2002', department: 'Chemistry', course: 'B.Sc Chemistry', batch: 'CHEM-A', subject: 'Organic Chemistry', status: 'absent', method: 'manual', faculty: 'Prof. Anjali Gupta', time: '--' },
  { id: 'HIST-012', date: '2026-07-14T00:00:00Z', studentName: 'Neha Kapoor', rollNumber: 'CS2004', department: 'Computer Science', course: 'B.Tech CSE', batch: 'CSE-B', subject: 'Database Systems', status: 'present', method: 'qr', faculty: 'Prof. Priya Patel', time: '08:53' },
  { id: 'HIST-013', date: '2026-07-14T00:00:00Z', studentName: 'Aditya Mishra', rollNumber: 'EC2003', department: 'Electronics', course: 'B.Tech ECE', batch: 'ECE-A', subject: 'Microprocessors', status: 'half_day', method: 'manual', faculty: 'Prof. Ritu Agarwal', time: '--' },
  { id: 'HIST-014', date: '2026-07-14T00:00:00Z', studentName: 'Pooja Iyer', rollNumber: 'CS2005', department: 'Computer Science', course: 'B.Tech CSE', batch: 'CSE-B', subject: 'Database Systems', status: 'leave', method: 'manual', faculty: 'Prof. Priya Patel', time: '--' },
  { id: 'HIST-015', date: '2026-07-14T00:00:00Z', studentName: 'Siddharth Rao', rollNumber: 'MA2003', department: 'Mathematics', course: 'B.Sc Math', batch: 'MATH-B', subject: 'Statistics', status: 'late', method: 'manual', faculty: 'Dr. Suresh Reddy', time: '09:10' },
  { id: 'HIST-016', date: '2026-07-14T00:00:00Z', studentName: 'Ishita Jain', rollNumber: 'EC2004', department: 'Electronics', course: 'B.Tech ECE', batch: 'ECE-B', subject: 'VLSI Design', status: 'present', method: 'face', faculty: 'Prof. Tanvi Shah', time: '08:48' },
  { id: 'HIST-017', date: '2026-07-13T00:00:00Z', studentName: 'Manish Yadav', rollNumber: 'PH2003', department: 'Physics', course: 'B.Sc Physics', batch: 'PHY-B', subject: 'Electromagnetism', status: 'absent', method: 'manual', faculty: 'Dr. Arjun Joshi', time: '--' },
  { id: 'HIST-018', date: '2026-07-13T00:00:00Z', studentName: 'Kavya Nambiar', rollNumber: 'CH2003', department: 'Chemistry', course: 'B.Sc Chemistry', batch: 'CHEM-B', subject: 'Inorganic Chemistry', status: 'present', method: 'qr', faculty: 'Prof. Swati Deshmukh', time: '08:51' },
  { id: 'HIST-019', date: '2026-07-13T00:00:00Z', studentName: 'Gaurav Bhatia', rollNumber: 'CS2006', department: 'Computer Science', course: 'B.Tech CSE', batch: 'CSE-B', subject: 'Computer Networks', status: 'present', method: 'fingerprint', faculty: 'Dr. Rohan Bose', time: '08:57' },
  { id: 'HIST-020', date: '2026-07-13T00:00:00Z', studentName: 'Anjali Menon', rollNumber: 'EC2005', department: 'Electronics', course: 'B.Tech ECE', batch: 'ECE-B', subject: 'VLSI Design', status: 'late', method: 'manual', faculty: 'Prof. Tanvi Shah', time: '09:18' },
  { id: 'HIST-021', date: '2026-07-12T00:00:00Z', studentName: 'Ravi Kumar', rollNumber: 'ME2001', department: 'Mechanical', course: 'B.Tech ME', batch: 'MECH-A', subject: 'Thermodynamics', status: 'present', method: 'face', faculty: 'Dr. Manoj Tiwari', time: '08:54' },
  { id: 'HIST-022', date: '2026-07-12T00:00:00Z', studentName: 'Simran Kaur', rollNumber: 'ME2002', department: 'Mechanical', course: 'B.Tech ME', batch: 'MECH-A', subject: 'Thermodynamics', status: 'absent', method: 'manual', faculty: 'Dr. Manoj Tiwari', time: '--' },
  { id: 'HIST-023', date: '2026-07-12T00:00:00Z', studentName: 'Amit Patel', rollNumber: 'CE2001', department: 'Civil', course: 'B.Tech CE', batch: 'CIVIL-A', subject: 'Structural Analysis', status: 'present', method: 'fingerprint', faculty: 'Dr. Pradeep Jain', time: '08:49' },
  { id: 'HIST-024', date: '2026-07-12T00:00:00Z', studentName: 'Pooja Singh', rollNumber: 'CE2002', department: 'Civil', course: 'B.Tech CE', batch: 'CIVIL-A', subject: 'Structural Analysis', status: 'late', method: 'manual', faculty: 'Dr. Pradeep Jain', time: '09:05' },
  { id: 'HIST-025', date: '2026-07-12T00:00:00Z', studentName: 'Mohit Agarwal', rollNumber: 'BT2001', department: 'Biotechnology', course: 'B.Sc Biotech', batch: 'BT-A', subject: 'Molecular Biology', status: 'present', method: 'qr', faculty: 'Prof. Neha Gupta', time: '08:46' },
]

/* ─── RECENT ACTIVITIES (20 rows) ─── */

const recentActivityRows = [
  { type: 'joined', description: 'Dr. Rajesh Kumar joined as Professor', timestamp: '2026-07-17T08:00:00Z', facultyName: 'Dr. Rajesh Kumar' },
  { type: 'profile_update', description: 'Prof. Sunita Sharma updated profile information', timestamp: '2026-07-16T14:30:00Z', facultyName: 'Prof. Sunita Sharma' },
  { type: 'course_assignment', description: 'Dr. Amit Verma assigned to Physics department', timestamp: '2026-07-16T10:00:00Z', facultyName: 'Dr. Amit Verma' },
  { type: 'joined', description: 'Prof. Priya Patel joined as Assistant Professor', timestamp: '2026-07-15T09:00:00Z', facultyName: 'Prof. Priya Patel' },
  { type: 'profile_update', description: 'Dr. Vikram Singh updated contact information', timestamp: '2026-07-15T11:00:00Z', facultyName: 'Dr. Vikram Singh' },
  { type: 'course_assignment', description: 'Prof. Anjali Gupta assigned to Chemistry department', timestamp: '2026-07-14T15:00:00Z', facultyName: 'Prof. Anjali Gupta' },
  { type: 'joined', description: 'Dr. Suresh Reddy joined as Professor', timestamp: '2026-07-14T08:00:00Z', facultyName: 'Dr. Suresh Reddy' },
  { type: 'profile_update', description: 'Prof. Meera Nair updated profile photo', timestamp: '2026-07-13T16:00:00Z', facultyName: 'Prof. Meera Nair' },
  { type: 'course_assignment', description: 'Dr. Arjun Joshi assigned to Physics department', timestamp: '2026-07-13T12:00:00Z', facultyName: 'Dr. Arjun Joshi' },
  { type: 'joined', description: 'Prof. Deepa Krishnan joined as Assistant Professor', timestamp: '2026-07-12T09:00:00Z', facultyName: 'Prof. Deepa Krishnan' },
  { type: 'profile_update', description: 'Dr. Manoj Tiwari updated qualification details', timestamp: '2026-07-12T14:00:00Z', facultyName: 'Dr. Manoj Tiwari' },
  { type: 'course_assignment', description: 'Prof. Neha Gupta assigned to Biotechnology', timestamp: '2026-07-11T11:00:00Z', facultyName: 'Prof. Neha Gupta' },
  { type: 'joined', description: 'Dr. Karan Mehta joined as Professor', timestamp: '2026-07-11T08:00:00Z', facultyName: 'Dr. Karan Mehta' },
  { type: 'profile_update', description: 'Prof. Ritu Agarwal updated specialization', timestamp: '2026-07-10T15:00:00Z', facultyName: 'Prof. Ritu Agarwal' },
  { type: 'course_assignment', description: 'Dr. Pradeep Jain assigned to Civil department', timestamp: '2026-07-10T10:00:00Z', facultyName: 'Dr. Pradeep Jain' },
  { type: 'joined', description: 'Prof. Swati Deshmukh joined as Assistant Professor', timestamp: '2026-07-09T09:00:00Z', facultyName: 'Prof. Swati Deshmukh' },
  { type: 'profile_update', description: 'Dr. Rohan Bose updated research publications', timestamp: '2026-07-09T13:00:00Z', facultyName: 'Dr. Rohan Bose' },
  { type: 'course_assignment', description: 'Prof. Kavita Sinha assigned to Mathematics', timestamp: '2026-07-08T10:00:00Z', facultyName: 'Prof. Kavita Sinha' },
  { type: 'joined', description: 'Dr. Akash Dave joined as Associate Professor', timestamp: '2026-07-08T08:00:00Z', facultyName: 'Dr. Akash Dave' },
  { type: 'profile_update', description: 'Prof. Ishita Roy updated course preferences', timestamp: '2026-07-07T14:00:00Z', facultyName: 'Prof. Ishita Roy' },
]

/* ─── ROUTE MAP: method → mock handler ─── */

type MockHandler = (_url: string, _params?: Record<string, unknown>, _data?: Record<string, unknown>) => { success: boolean; data: any; message?: string }

const mockRoutes: Record<string, MockHandler> = {
  'GET /faculty': () => ({ success: true, data: facultyRows }),
  'GET /faculty/export': () => ({ success: true, data: facultyRows }),
  'POST /faculty': (_url, _params, body) => ({ success: true, data: { id: 'FAC-NEW', ...body }, message: 'Faculty created successfully' }),
  'PATCH /faculty/:id': (_url, _params, body) => ({ success: true, data: { ...facultyRows[0], ...body }, message: 'Faculty updated successfully' }),
  'DELETE /faculty/:id': () => ({ success: true, data: { id: 'deleted' }, message: 'Faculty deleted successfully' }),
  'POST /faculty/bulk-delete': () => ({ success: true, data: { deleted: 5 }, message: 'Bulk delete successful' }),
  'POST /faculty/bulk-update': () => ({ success: true, data: { updated: 5 }, message: 'Bulk update successful' }),
  'POST /faculty/import': () => ({ success: true, data: { imported: 10 }, message: 'Import successful' }),
  'GET /faculty/profile': () => ({ success: true, data: facultyRows[0] }),
  'GET /faculty/dashboard': () => ({ success: true, data: facultyDashboardData }),

  'GET /timetable': () => ({ success: true, data: timetableRows }),
  'POST /timetable': (_url, _params, body) => ({ success: true, data: { id: 'TT-NEW', ...body } }),
  'PATCH /timetable/:id': () => ({ success: true, data: timetableRows[0], message: 'Updated' }),
  'DELETE /timetable/:id': () => ({ success: true, data: {}, message: 'Deleted' }),
  'POST /timetable/bulk-delete': () => ({ success: true, data: {}, message: 'Bulk deleted' }),
  'POST /timetable/bulk-update': () => ({ success: true, data: {}, message: 'Bulk updated' }),

  'GET /attendance': () => ({ success: true, data: attendanceRows, total: attendanceRows.length }),
  'GET /attendance/today': () => ({ success: true, data: { summary: attendanceStatsData } }),
  'GET /attendance/stats': () => ({ success: true, data: attendanceStatsData }),
  'POST /attendance': () => ({ success: true, data: { id: 'ATT-NEW' }, message: 'Attendance created' }),
  'POST /attendance/bulk-delete': () => ({ success: true, data: {}, message: 'Deleted' }),
  'POST /attendance/bulk-update': () => ({ success: true, data: {}, message: 'Updated' }),
  'GET /attendance/export': () => ({ success: true, data: attendanceRows }),

  'GET /attendance/corrections': () => ({ success: true, data: correctionRows }),
  'POST /attendance/corrections': () => ({ success: true, data: { id: 'COR-NEW' }, message: 'Correction submitted' }),
  'PATCH /attendance/corrections/:id': () => ({ success: true, data: {}, message: 'Correction updated' }),

  'GET /assignments': () => ({ success: true, data: assignmentRows }),
  'POST /assignments': () => ({ success: true, data: { id: 'ASG-NEW' } }),
  'PATCH /assignments/:id': () => ({ success: true, data: {}, message: 'Updated' }),
  'DELETE /assignments/:id': () => ({ success: true, data: {}, message: 'Deleted' }),

  'GET /holidays': () => ({ success: true, data: holidayRows }),
  'GET /holidays/stats': () => ({ success: true, data: { totalHolidays: holidayRows.length, upcomingHolidays: 15, specialEvents: 4, workingDays: 243 } }),
  'GET /holidays/special-events': () => ({ success: true, data: holidayRows.filter((h) => h.type === 'event') }),
  'POST /holidays': () => ({ success: true, data: { id: 'HOL-NEW' } }),

  'GET /materials': () => ({ success: true, data: materialRows }),
  'GET /materials/categories': () => ({ success: true, data: ['Lecture Notes', 'Textbooks', 'Lab Manuals', 'Recorded Lectures', 'Assignments', 'Reference Material', 'Formula Sheets', 'Research Material'] }),
  'POST /materials': () => ({ success: true, data: { id: 'MAT-NEW' } }),

  'GET /dashboard/admin': () => ({ success: true, data: adminDashboardData }),
  'GET /dashboard/recent-activities': () => ({ success: true, data: recentActivityRows }),

  'GET /auth/refresh-token': () => ({ success: true, data: { accessToken: 'mock-token' } }),
  'POST /auth/login': () => ({ success: true, data: { accessToken: 'mock-token', user: { name: 'Admin', role: 'admin' } } }),
  'GET /auth/me': () => ({ success: true, data: { name: 'Admin User', email: 'admin@college.edu', role: 'admin' } }),

  'GET /reminders': () => ({ success: true, data: [] }),
  'GET /homework': () => ({ success: true, data: [] }),
  'GET /evaluations': () => ({ success: true, data: [] }),
  'GET /submissions': () => ({ success: true, data: [] }),
  'GET /upload': () => ({ success: true, data: [] }),
  'GET /faculty-transfers': () => ({ success: true, data: [] }),
}

/* ─── Resolve dynamic route (e.g. /faculty/FAC-001 → /faculty/:id) ─── */

function resolveRoute(method: string, url: string): string | null {
  const path = url.replace(/^\/api/, '')
  const exact = `${method} ${path}`
  if (mockRoutes[exact]) return exact

  const parts = path.split('/').filter(Boolean)
  for (const key of Object.keys(mockRoutes)) {
    const [, routePath] = key.split(' ')
    const routeParts = routePath.split('/').filter(Boolean)
    if (parts.length === routeParts.length) {
      let match = true
      for (let i = 0; i < parts.length; i++) {
        if (routeParts[i].startsWith(':')) continue
        if (routeParts[i] !== parts[i]) { match = false; break }
      }
      if (match) return key
    }
  }
  return null
}

/* ─── MAIN: try to handle request, return true if handled ─── */

export async function handleMockRequest(
  method: string,
  url: string,
  params?: Record<string, unknown>,
  data?: Record<string, unknown>,
): Promise<{ handled: boolean; response?: any }> {
  if (!mockEnabled) return { handled: false }

  const routeKey = resolveRoute(method, url)
  if (!routeKey) return { handled: false }

  const handler = mockRoutes[routeKey]
  if (!handler) return { handled: false }

  await mockDelay(5)
  const result = handler(url, params, data)
  return { handled: true, response: { data: result, status: 200, statusText: 'OK', headers: {}, config: {} as any } }
}

/* ─── Exports for direct use (by services or seed scripts) ─── */

export const seedData = {
  faculty: facultyRows,
  timetable: timetableRows,
  attendance: attendanceRows,
  attendanceStats: attendanceStatsData,
  assignments: assignmentRows,
  holidays: holidayRows,
  materials: materialRows,
  notifications: notificationRows,
  corrections: correctionRows,
  history: historyRows,
  recentActivities: recentActivityRows,
  adminDashboard: adminDashboardData,
  facultyDashboard: facultyDashboardData,
}
