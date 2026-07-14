import type {
  TimetableStats,
  TimetableEntry,
  UpcomingClass,
  Notification,
  TimetableActivity,
  DailySchedule,
  WeeklyDistribution,
  FacultyWorkload,
  ClassroomUtilization,
} from '../types/timetable.types'

export const timetableStats: TimetableStats = {
  todayClasses: 18,
  thisWeekClasses: 86,
  monthlyClasses: 342,
  availableClassrooms: 24,
  activeFaculty: 112,
  ongoingClasses: 6,
}

export const todayTimetable: TimetableEntry[] = [
  { id: 'TT-001', time: '08:00 - 09:00', course: 'B.Tech CSE', subject: 'Data Structures', faculty: 'Dr. Rajesh Kumar', classroom: 'Room 201', batch: 'CSE-A', department: 'Computer Science', status: 'completed' },
  { id: 'TT-002', time: '09:00 - 10:00', course: 'B.Tech CSE', subject: 'Database Systems', faculty: 'Prof. Priya Patel', classroom: 'Lab 1', batch: 'CSE-B', department: 'Computer Science', status: 'completed' },
  { id: 'TT-003', time: '10:00 - 11:00', course: 'B.Sc Math', subject: 'Calculus II', faculty: 'Prof. Sunita Sharma', classroom: 'Room 105', batch: 'MATH-A', department: 'Mathematics', status: 'ongoing' },
  { id: 'TT-004', time: '11:00 - 12:00', course: 'B.Tech ECE', subject: 'Circuit Analysis', faculty: 'Dr. Vikram Singh', classroom: 'Lab 3', batch: 'ECE-A', department: 'Electronics', status: 'ongoing' },
  { id: 'TT-005', time: '12:00 - 13:00', course: 'M.Sc Physics', subject: 'Quantum Mechanics', faculty: 'Dr. Amit Verma', classroom: 'Room 302', batch: 'PHY-A', department: 'Physics', status: 'scheduled' },
  { id: 'TT-006', time: '13:00 - 14:00', course: 'B.Tech CSE', subject: 'Machine Learning', faculty: 'Prof. Deepa Krishnan', classroom: 'Lab 2', batch: 'CSE-A', department: 'Computer Science', status: 'scheduled' },
  { id: 'TT-007', time: '14:00 - 15:00', course: 'B.Sc Chemistry', subject: 'Organic Chemistry', faculty: 'Prof. Anjali Gupta', classroom: 'Room 108', batch: 'CHM-A', department: 'Chemistry', status: 'scheduled' },
  { id: 'TT-008', time: '15:00 - 16:00', course: 'B.Tech CSE', subject: 'Web Development', faculty: 'Prof. Priya Patel', classroom: 'Lab 1', batch: 'CSE-A', department: 'Computer Science', status: 'scheduled' },
  { id: 'TT-009', time: '16:00 - 17:00', course: 'M.Sc Math', subject: 'Statistics', faculty: 'Dr. Suresh Reddy', classroom: 'Room 205', batch: 'MATH-B', department: 'Mathematics', status: 'scheduled' },
  { id: 'TT-010', time: '17:00 - 18:00', course: 'B.Tech CSE', subject: 'Technical Writing', faculty: 'Prof. Meera Nair', classroom: 'Room 201', batch: 'CSE-B', department: 'English', status: 'cancelled' },
]

export const upcomingClasses: UpcomingClass[] = [
  { id: 'UC-001', date: '2026-07-15', day: 'Wednesday', time: '08:00 - 10:00', course: 'B.Tech CSE', subject: 'Data Structures Lab', faculty: 'Dr. Rajesh Kumar', classroom: 'Lab 1', batch: 'CSE-A', department: 'Computer Science' },
  { id: 'UC-002', date: '2026-07-15', day: 'Wednesday', time: '10:00 - 12:00', course: 'B.Sc Math', subject: 'Linear Algebra', faculty: 'Prof. Sunita Sharma', classroom: 'Room 105', batch: 'MATH-A', department: 'Mathematics' },
  { id: 'UC-003', date: '2026-07-16', day: 'Thursday', time: '09:00 - 11:00', course: 'M.Sc Physics', subject: 'Electrodynamics', faculty: 'Dr. Amit Verma', classroom: 'Lab 3', batch: 'PHY-A', department: 'Physics' },
  { id: 'UC-004', date: '2026-07-16', day: 'Thursday', time: '14:00 - 16:00', course: 'B.Tech ECE', subject: 'Embedded Systems', faculty: 'Dr. Vikram Singh', classroom: 'Lab 2', batch: 'ECE-A', department: 'Electronics' },
  { id: 'UC-005', date: '2026-07-17', day: 'Friday', time: '08:00 - 09:00', course: 'B.Sc Chemistry', subject: 'Polymer Science', faculty: 'Prof. Anjali Gupta', classroom: 'Room 302', batch: 'CHM-A', department: 'Chemistry' },
]

export const notifications: Notification[] = [
  { id: 'NOT-001', type: 'holiday', title: 'Independence Day', description: 'College remains closed for Independence Day celebrations.', date: '2026-08-15' },
  { id: 'NOT-002', type: 'holiday', title: 'Ganesh Chaturthi', description: 'Optional holiday for Ganesh Chaturthi festival.', date: '2026-09-19' },
  { id: 'NOT-003', type: 'event', title: 'Technical Symposium', description: 'Annual technical symposium "TechVista 2026" in Auditorium.', date: '2026-08-05' },
  { id: 'NOT-004', type: 'event', title: 'Faculty Development Program', description: 'FDP on AI/ML for all CSE faculty members.', date: '2026-07-25' },
  { id: 'NOT-005', type: 'change', title: 'Room Allocation Change', description: 'B.Tech CSE-A moved from Room 201 to Lab 1 for DBMS lab.', date: '2026-07-15' },
  { id: 'NOT-006', type: 'change', title: 'Faculty Substitution', description: 'Prof. Anjali Gupta covering Organic Chem for Dr. Mehta.', date: '2026-07-16' },
]

export const timetableActivities: TimetableActivity[] = [
  { id: 'TA-001', type: 'updated', description: 'Weekly schedule updated for even semester', timetableName: 'CSE Semester IV', timestamp: '2 hours ago', user: 'Admin' },
  { id: 'TA-002', type: 'added', description: 'New practical session added for ML lab', timetableName: 'CSE Semester VI', timestamp: '4 hours ago', user: 'Dr. Rajesh Kumar' },
  { id: 'TA-003', type: 'updated', description: 'Classroom reassigned for Physics tutorials', timetableName: 'Physics Semester II', timestamp: '6 hours ago', user: 'Admin' },
  { id: 'TA-004', type: 'added', description: 'Remedial classes scheduled for weak students', timetableName: 'Mathematics Semester I', timestamp: '1 day ago', user: 'Prof. Sunita Sharma' },
  { id: 'TA-005', type: 'updated', description: 'Time slot adjusted for ECE lab sessions', timetableName: 'ECE Semester III', timestamp: '1 day ago', user: 'Admin' },
]

export const departments = [
  { value: '', label: 'All Departments' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'English', label: 'English' },
]

export const courses = [
  { value: '', label: 'All Courses' },
  { value: 'B.Tech CSE', label: 'B.Tech CSE' },
  { value: 'B.Tech ECE', label: 'B.Tech ECE' },
  { value: 'B.Sc Math', label: 'B.Sc Math' },
  { value: 'M.Sc Math', label: 'M.Sc Math' },
  { value: 'M.Sc Physics', label: 'M.Sc Physics' },
  { value: 'B.Sc Chemistry', label: 'B.Sc Chemistry' },
]

export const dailyScheduleData: DailySchedule[] = [
  { hour: '08:00', classes: 4 },
  { hour: '09:00', classes: 6 },
  { hour: '10:00', classes: 8 },
  { hour: '11:00', classes: 7 },
  { hour: '12:00', classes: 5 },
  { hour: '13:00', classes: 3 },
  { hour: '14:00', classes: 6 },
  { hour: '15:00', classes: 7 },
  { hour: '16:00', classes: 5 },
  { hour: '17:00', classes: 3 },
]

export const weeklyDistributionData: WeeklyDistribution[] = [
  { day: 'Monday', classes: 16 },
  { day: 'Tuesday', classes: 18 },
  { day: 'Wednesday', classes: 14 },
  { day: 'Thursday', classes: 20 },
  { day: 'Friday', classes: 12 },
  { day: 'Saturday', classes: 6 },
]

export const facultyWorkloadData: FacultyWorkload[] = [
  { name: 'Dr. Rajesh Kumar', hours: 18, classes: 12 },
  { name: 'Prof. Sunita Sharma', hours: 15, classes: 10 },
  { name: 'Dr. Amit Verma', hours: 12, classes: 8 },
  { name: 'Prof. Priya Patel', hours: 20, classes: 14 },
  { name: 'Dr. Vikram Singh', hours: 10, classes: 6 },
  { name: 'Prof. Anjali Gupta', hours: 14, classes: 9 },
  { name: 'Dr. Suresh Reddy', hours: 16, classes: 11 },
  { name: 'Prof. Meera Nair', hours: 8, classes: 5 },
]

export const classroomUtilizationData: ClassroomUtilization[] = [
  { name: 'Room 201', usage: 85, capacity: 60, percentage: 85 },
  { name: 'Room 105', usage: 70, capacity: 50, percentage: 70 },
  { name: 'Room 302', usage: 60, capacity: 45, percentage: 60 },
  { name: 'Lab 1', usage: 92, capacity: 30, percentage: 92 },
  { name: 'Lab 2', usage: 78, capacity: 30, percentage: 78 },
  { name: 'Lab 3', usage: 65, capacity: 25, percentage: 65 },
  { name: 'Room 108', usage: 55, capacity: 40, percentage: 55 },
  { name: 'Room 205', usage: 72, capacity: 50, percentage: 72 },
]
