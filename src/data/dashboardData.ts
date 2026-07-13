export interface FacultyMember {
  id: number;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  status: 'active' | 'inactive';
  joinedDate: string;
  phone: string;
}

export interface Department {
  id: number;
  name: string;
  facultyCount: number;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  assignedTo: string;
  department: string;
  semester: number;
}

export interface ClassSchedule {
  id: number;
  facultyName: string;
  subject: string;
  classroom: string;
  time: string;
  department: string;
}

export interface LeaveRequest {
  id: number;
  facultyName: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Activity {
  id: number;
  type: 'joined' | 'profile_update' | 'course_assignment';
  facultyName: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalFaculty: number;
  activeFaculty: number;
  totalDepartments: number;
  assignedCourses: number;
  todayClasses: number;
  pendingLeaves: number;
}

export const dashboardStats: DashboardStats = {
  totalFaculty: 128,
  activeFaculty: 112,
  totalDepartments: 12,
  assignedCourses: 45,
  todayClasses: 18,
  pendingLeaves: 7,
};

export const facultyMembers: FacultyMember[] = [
  { id: 1, name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@college.edu', department: 'Computer Science', subjects: ['Data Structures', 'Algorithms'], status: 'active', joinedDate: '2019-08-15', phone: '+91-9876543210' },
  { id: 2, name: 'Prof. Sunita Sharma', email: 'sunita.sharma@college.edu', department: 'Mathematics', subjects: ['Calculus', 'Linear Algebra'], status: 'active', joinedDate: '2020-01-10', phone: '+91-9876543211' },
  { id: 3, name: 'Dr. Amit Verma', email: 'amit.verma@college.edu', department: 'Physics', subjects: ['Quantum Mechanics', 'Electrodynamics'], status: 'active', joinedDate: '2018-06-20', phone: '+91-9876543212' },
  { id: 4, name: 'Prof. Priya Patel', email: 'priya.patel@college.edu', department: 'Computer Science', subjects: ['Web Development', 'Database Systems'], status: 'active', joinedDate: '2021-03-05', phone: '+91-9876543213' },
  { id: 5, name: 'Dr. Vikram Singh', email: 'vikram.singh@college.edu', department: 'Electronics', subjects: ['Circuit Analysis', 'Embedded Systems'], status: 'inactive', joinedDate: '2017-11-12', phone: '+91-9876543214' },
  { id: 6, name: 'Prof. Anjali Gupta', email: 'anjali.gupta@college.edu', department: 'Chemistry', subjects: ['Organic Chemistry', 'Polymer Science'], status: 'active', joinedDate: '2022-07-18', phone: '+91-9876543215' },
  { id: 7, name: 'Dr. Suresh Reddy', email: 'suresh.reddy@college.edu', department: 'Mathematics', subjects: ['Statistics', 'Discrete Mathematics'], status: 'active', joinedDate: '2020-09-22', phone: '+91-9876543216' },
  { id: 8, name: 'Prof. Meera Nair', email: 'meera.nair@college.edu', department: 'English', subjects: ['Technical Writing', 'Communication Skills'], status: 'active', joinedDate: '2021-05-30', phone: '+91-9876543217' },
  { id: 9, name: 'Dr. Arjun Joshi', email: 'arjun.joshi@college.edu', department: 'Physics', subjects: ['Thermodynamics', 'Optics'], status: 'inactive', joinedDate: '2016-02-14', phone: '+91-9876543218' },
  { id: 10, name: 'Prof. Deepa Krishnan', email: 'deepa.krishnan@college.edu', department: 'Computer Science', subjects: ['Machine Learning', 'AI'], status: 'active', joinedDate: '2023-01-08', phone: '+91-9876543219' },
];

export const departments: Department[] = [
  { id: 1, name: 'Computer Science', facultyCount: 28 },
  { id: 2, name: 'Mathematics', facultyCount: 15 },
  { id: 3, name: 'Physics', facultyCount: 12 },
  { id: 4, name: 'Chemistry', facultyCount: 10 },
  { id: 5, name: 'Electronics', facultyCount: 14 },
  { id: 6, name: 'English', facultyCount: 8 },
  { id: 7, name: 'Mechanical', facultyCount: 11 },
  { id: 8, name: 'Civil', facultyCount: 9 },
  { id: 9, name: 'Business Administration', facultyCount: 13 },
  { id: 10, name: 'Biotechnology', facultyCount: 8 },
];

export const courses: Course[] = [
  { id: 1, name: 'Data Structures & Algorithms', code: 'CS201', assignedTo: 'Dr. Rajesh Kumar', department: 'Computer Science', semester: 3 },
  { id: 2, name: 'Calculus II', code: 'MATH102', assignedTo: 'Prof. Sunita Sharma', department: 'Mathematics', semester: 2 },
  { id: 3, name: 'Quantum Mechanics', code: 'PHY301', assignedTo: 'Dr. Amit Verma', department: 'Physics', semester: 5 },
  { id: 4, name: 'Web Development', code: 'CS304', assignedTo: 'Prof. Priya Patel', department: 'Computer Science', semester: 4 },
  { id: 5, name: 'Circuit Analysis', code: 'ECE201', assignedTo: 'Dr. Vikram Singh', department: 'Electronics', semester: 3 },
  { id: 6, name: 'Organic Chemistry', code: 'CHM201', assignedTo: 'Prof. Anjali Gupta', department: 'Chemistry', semester: 3 },
  { id: 7, name: 'Machine Learning', code: 'CS401', assignedTo: 'Prof. Deepa Krishnan', department: 'Computer Science', semester: 7 },
  { id: 8, name: 'Statistics', code: 'MATH301', assignedTo: 'Dr. Suresh Reddy', department: 'Mathematics', semester: 5 },
];

export const classSchedules: ClassSchedule[] = [
  { id: 1, facultyName: 'Dr. Rajesh Kumar', subject: 'Data Structures', classroom: 'Room 201', time: '09:00 - 10:00', department: 'Computer Science' },
  { id: 2, facultyName: 'Prof. Sunita Sharma', subject: 'Calculus II', classroom: 'Room 105', time: '10:00 - 11:00', department: 'Mathematics' },
  { id: 3, facultyName: 'Dr. Amit Verma', subject: 'Quantum Mechanics', classroom: 'Lab 3', time: '11:00 - 12:00', department: 'Physics' },
  { id: 4, facultyName: 'Prof. Priya Patel', subject: 'Web Development', classroom: 'Lab 1', time: '12:00 - 13:00', department: 'Computer Science' },
  { id: 5, facultyName: 'Prof. Anjali Gupta', subject: 'Organic Chemistry', classroom: 'Room 302', time: '14:00 - 15:00', department: 'Chemistry' },
  { id: 6, facultyName: 'Prof. Deepa Krishnan', subject: 'Machine Learning', classroom: 'Lab 2', time: '15:00 - 16:00', department: 'Computer Science' },
  { id: 7, facultyName: 'Dr. Suresh Reddy', subject: 'Statistics', classroom: 'Room 108', time: '16:00 - 17:00', department: 'Mathematics' },
  { id: 8, facultyName: 'Prof. Meera Nair', subject: 'Technical Writing', classroom: 'Room 205', time: '17:00 - 18:00', department: 'English' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 1, facultyName: 'Dr. Vikram Singh', reason: 'Medical leave', fromDate: '2024-03-20', toDate: '2024-03-25', status: 'pending' },
  { id: 2, facultyName: 'Prof. Priya Patel', reason: 'Family function', fromDate: '2024-03-22', toDate: '2024-03-23', status: 'pending' },
  { id: 3, facultyName: 'Dr. Arjun Joshi', reason: 'Conference attendance', fromDate: '2024-03-28', toDate: '2024-03-30', status: 'pending' },
  { id: 4, facultyName: 'Prof. Meera Nair', reason: 'Personal reasons', fromDate: '2024-03-21', toDate: '2024-03-22', status: 'approved' },
  { id: 5, facultyName: 'Dr. Suresh Reddy', reason: 'Research work', fromDate: '2024-04-01', toDate: '2024-04-05', status: 'pending' },
  { id: 6, facultyName: 'Prof. Sunita Sharma', reason: 'Seminar', fromDate: '2024-03-19', toDate: '2024-03-20', status: 'pending' },
  { id: 7, facultyName: 'Prof. Deepa Krishnan', reason: 'Workshop', fromDate: '2024-03-26', toDate: '2024-03-27', status: 'rejected' },
];

export const recentActivities: Activity[] = [
  { id: 1, type: 'joined', facultyName: 'Prof. Deepa Krishnan', description: 'Joined as Assistant Professor in Computer Science', timestamp: '2 hours ago' },
  { id: 2, type: 'profile_update', facultyName: 'Dr. Rajesh Kumar', description: 'Updated research publications and profile photo', timestamp: '4 hours ago' },
  { id: 3, type: 'course_assignment', facultyName: 'Prof. Priya Patel', description: 'Assigned to teach Web Development (CS304)', timestamp: '5 hours ago' },
  { id: 4, type: 'joined', facultyName: 'Prof. Anjali Gupta', description: 'Joined as Associate Professor in Chemistry', timestamp: '1 day ago' },
  { id: 5, type: 'profile_update', facultyName: 'Dr. Amit Verma', description: 'Updated PhD details and achievements', timestamp: '1 day ago' },
  { id: 6, type: 'course_assignment', facultyName: 'Dr. Suresh Reddy', description: 'Assigned to teach Statistics (MATH301)', timestamp: '2 days ago' },
  { id: 7, type: 'joined', facultyName: 'Prof. Meera Nair', description: 'Joined as Lecturer in English department', timestamp: '3 days ago' },
  { id: 8, type: 'profile_update', facultyName: 'Prof. Sunita Sharma', description: 'Updated contact information', timestamp: '3 days ago' },
];

export const facultyByDepartment = [
  { department: 'CSE', count: 28 },
  { department: 'Math', count: 15 },
  { department: 'Physics', count: 12 },
  { department: 'Chemistry', count: 10 },
  { department: 'ECE', count: 14 },
  { department: 'English', count: 8 },
  { department: 'Mech', count: 11 },
  { department: 'Civil', count: 9 },
  { department: 'BBA', count: 13 },
  { department: 'Biotech', count: 8 },
];

export const attendanceOverview = [
  { month: 'Jul', rate: 92 },
  { month: 'Aug', rate: 88 },
  { month: 'Sep', rate: 95 },
  { month: 'Oct', rate: 85 },
  { month: 'Nov', rate: 90 },
  { month: 'Dec', rate: 93 },
  { month: 'Jan', rate: 87 },
  { month: 'Feb', rate: 91 },
];

export const facultyDistribution = [
  { name: 'Professors', value: 45, color: '#3b82f6' },
  { name: 'Assoc. Prof.', value: 35, color: '#0ea5e9' },
  { name: 'Asst. Prof.', value: 28, color: '#6366f1' },
  { name: 'Lecturers', value: 20, color: '#8b5cf6' },
];
