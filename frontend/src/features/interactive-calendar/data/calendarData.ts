import type { CalendarEvent, EventType } from '../types/calendar.types'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`
}

const year = 2026
const month = 7

const eventTemplates: Array<{
  day: number
  title: string
  subject: string
  faculty: string
  classroom: string
  building: string
  startTime: string
  endTime: string
  batch: string
  course: string
  department: string
  type: EventType
  description: string
}> = [
  { day: 1, title: 'Data Structures Lecture', subject: 'Data Structures', faculty: 'Dr. Rajesh Kumar', classroom: 'Room 201', building: 'Engineering Block', startTime: '09:00', endTime: '10:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'Computer Science', type: 'lecture', description: 'Introduction to advanced trees and graphs' },
  { day: 1, title: 'Calculus II Tutorial', subject: 'Calculus II', faculty: 'Prof. Sunita Sharma', classroom: 'Room 105', building: 'Science Block', startTime: '10:00', endTime: '11:00', batch: 'MATH-A', course: 'B.Sc Mathematics', department: 'Mathematics', type: 'lecture', description: 'Integration techniques and applications' },
  { day: 1, title: 'Physics Lab', subject: 'Quantum Mechanics', faculty: 'Dr. Amit Verma', classroom: 'Lab 3', building: 'Science Block', startTime: '14:00', endTime: '16:00', batch: 'PHY-A', course: 'M.Sc Physics', department: 'Physics', type: 'lab', description: 'Quantum entanglement experiment' },
  { day: 2, title: 'DBMS Lab', subject: 'Database Systems', faculty: 'Prof. Priya Patel', classroom: 'Lab 1', building: 'Engineering Block', startTime: '08:00', endTime: '10:00', batch: 'CSE-B', course: 'B.Tech CSE', department: 'Computer Science', type: 'lab', description: 'SQL queries and normalization practice' },
  { day: 2, title: 'Machine Learning Seminar', subject: 'Machine Learning', faculty: 'Prof. Deepa Krishnan', classroom: 'Seminar Hall', building: 'Main Building', startTime: '11:00', endTime: '12:30', batch: 'CSE-A', course: 'B.Tech CSE', department: 'Computer Science', type: 'seminar', description: 'Recent advances in deep learning architectures' },
  { day: 3, title: 'Circuit Analysis Lab', subject: 'Circuit Analysis', faculty: 'Dr. Vikram Singh', classroom: 'Lab 2', building: 'Engineering Block', startTime: '09:00', endTime: '11:00', batch: 'ECE-A', course: 'B.Tech ECE', department: 'Electronics', type: 'lab', description: 'Op-amp circuits and filter design' },
  { day: 3, title: 'Organic Chemistry Lecture', subject: 'Organic Chemistry', faculty: 'Prof. Anjali Gupta', classroom: 'Room 302', building: 'Science Block', startTime: '14:00', endTime: '15:00', batch: 'CHM-A', course: 'B.Sc Chemistry', department: 'Chemistry', type: 'lecture', description: 'Reaction mechanisms and synthesis' },
  { day: 4, title: 'Technical Writing Workshop', subject: 'Technical Writing', faculty: 'Prof. Meera Nair', classroom: 'Room 205', building: 'Arts Block', startTime: '10:00', endTime: '11:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'English', type: 'seminar', description: 'Research paper writing and publication ethics' },
  { day: 5, title: 'Statistics Mid-Term Exam', subject: 'Statistics', faculty: 'Dr. Suresh Reddy', classroom: 'Room 108', building: 'Main Building', startTime: '09:00', endTime: '11:00', batch: 'MATH-B', course: 'M.Sc Mathematics', department: 'Mathematics', type: 'exam', description: 'Mid-term examination covering units 1-4' },
  { day: 5, title: 'Web Development Lecture', subject: 'Web Development', faculty: 'Prof. Priya Patel', classroom: 'Lab 1', building: 'Engineering Block', startTime: '14:00', endTime: '15:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'Computer Science', type: 'lecture', description: 'React hooks and state management' },
  { day: 7, title: 'College Cultural Fest', subject: 'Annual Day', faculty: 'All Faculty', classroom: 'Auditorium', building: 'Main Building', startTime: '09:00', endTime: '17:00', batch: 'ALL', course: 'All Courses', department: 'All Departments', type: 'event', description: 'Annual cultural fest with competitions and performances' },
  { day: 8, title: 'Data Structures Lab', subject: 'Data Structures', faculty: 'Dr. Rajesh Kumar', classroom: 'Lab 2', building: 'Engineering Block', startTime: '08:00', endTime: '10:00', batch: 'CSE-B', course: 'B.Tech CSE', department: 'Computer Science', type: 'lab', description: 'Binary search tree implementation' },
  { day: 8, title: 'Linear Algebra Lecture', subject: 'Linear Algebra', faculty: 'Prof. Sunita Sharma', classroom: 'Room 105', building: 'Science Block', startTime: '11:00', endTime: '12:00', batch: 'MATH-A', course: 'B.Sc Mathematics', department: 'Mathematics', type: 'lecture', description: 'Eigenvalues and eigenvectors' },
  { day: 9, title: 'Embedded Systems Lab', subject: 'Embedded Systems', faculty: 'Dr. Vikram Singh', classroom: 'Lab 3', building: 'Engineering Block', startTime: '14:00', endTime: '16:00', batch: 'ECE-A', course: 'B.Tech ECE', department: 'Electronics', type: 'lab', description: 'Microcontroller programming with Arduino' },
  { day: 10, title: 'Polymer Science Lecture', subject: 'Polymer Science', faculty: 'Prof. Anjali Gupta', classroom: 'Room 302', building: 'Science Block', startTime: '09:00', endTime: '10:00', batch: 'CHM-A', course: 'B.Sc Chemistry', department: 'Chemistry', type: 'lecture', description: 'Polymerization techniques and characterization' },
  { day: 10, title: 'Communication Skills Workshop', subject: 'Communication Skills', faculty: 'Prof. Meera Nair', classroom: 'Room 205', building: 'Arts Block', startTime: '15:00', endTime: '16:00', batch: 'CSE-B', course: 'B.Tech CSE', department: 'English', type: 'seminar', description: 'Presentation skills and public speaking' },
  { day: 11, title: 'AI Guest Lecture', subject: 'Artificial Intelligence', faculty: 'Prof. Deepa Krishnan', classroom: 'Seminar Hall', building: 'Main Building', startTime: '10:00', endTime: '12:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'Computer Science', type: 'seminar', description: 'Industry expert session on AI applications' },
  { day: 12, title: 'Thermodynamics Exam', subject: 'Thermodynamics', faculty: 'Dr. Amit Verma', classroom: 'Room 108', building: 'Science Block', startTime: '09:00', endTime: '12:00', batch: 'PHY-A', course: 'M.Sc Physics', department: 'Physics', type: 'exam', description: 'Final exam covering thermodynamics and statistical mechanics' },
  { day: 14, title: 'Database Systems Lecture', subject: 'Database Systems', faculty: 'Prof. Priya Patel', classroom: 'Room 201', building: 'Engineering Block', startTime: '08:00', endTime: '09:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'Computer Science', type: 'lecture', description: 'Transaction management and concurrency control' },
  { day: 15, title: 'Discrete Mathematics Tutorial', subject: 'Discrete Mathematics', faculty: 'Dr. Suresh Reddy', classroom: 'Room 105', building: 'Science Block', startTime: '10:00', endTime: '11:00', batch: 'MATH-A', course: 'B.Sc Mathematics', department: 'Mathematics', type: 'lecture', description: 'Graph theory and combinatorics' },
  { day: 15, title: 'Electrodynamics Lab', subject: 'Electrodynamics', faculty: 'Dr. Amit Verma', classroom: 'Lab 3', building: 'Science Block', startTime: '14:00', endTime: '16:00', batch: 'PHY-A', course: 'M.Sc Physics', department: 'Physics', type: 'lab', description: 'Electromagnetic wave propagation experiments' },
  { day: 16, title: 'Machine Learning Lecture', subject: 'Machine Learning', faculty: 'Prof. Deepa Krishnan', classroom: 'Room 201', building: 'Engineering Block', startTime: '09:00', endTime: '10:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'Computer Science', type: 'lecture', description: 'Neural networks and backpropagation' },
  { day: 17, title: 'Circuit Analysis Lecture', subject: 'Circuit Analysis', faculty: 'Dr. Vikram Singh', classroom: 'Room 302', building: 'Engineering Block', startTime: '11:00', endTime: '12:00', batch: 'ECE-A', course: 'B.Tech ECE', department: 'Electronics', type: 'lecture', description: 'Frequency response and Bode plots' },
  { day: 18, title: 'Organic Chemistry Lab', subject: 'Organic Chemistry', faculty: 'Prof. Anjali Gupta', classroom: 'Chemistry Lab', building: 'Science Block', startTime: '14:00', endTime: '16:00', batch: 'CHM-A', course: 'B.Sc Chemistry', department: 'Chemistry', type: 'lab', description: 'Organic compound synthesis and analysis' },
  { day: 19, title: 'Web Development Lab', subject: 'Web Development', faculty: 'Prof. Priya Patel', classroom: 'Lab 1', building: 'Engineering Block', startTime: '08:00', endTime: '10:00', batch: 'CSE-B', course: 'B.Tech CSE', department: 'Computer Science', type: 'lab', description: 'Building REST APIs with Node.js' },
  { day: 21, title: 'Statistics Lecture', subject: 'Statistics', faculty: 'Dr. Suresh Reddy', classroom: 'Room 108', building: 'Main Building', startTime: '09:00', endTime: '10:00', batch: 'MATH-B', course: 'M.Sc Mathematics', department: 'Mathematics', type: 'lecture', description: 'Hypothesis testing and confidence intervals' },
  { day: 22, title: 'Data Structures Lecture', subject: 'Data Structures', faculty: 'Dr. Rajesh Kumar', classroom: 'Room 201', building: 'Engineering Block', startTime: '10:00', endTime: '11:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'Computer Science', type: 'lecture', description: 'Hashing techniques and collision resolution' },
  { day: 23, title: 'Technical Writing Lab', subject: 'Technical Writing', faculty: 'Prof. Meera Nair', classroom: 'Room 205', building: 'Arts Block', startTime: '14:00', endTime: '15:00', batch: 'CSE-A', course: 'B.Tech CSE', department: 'English', type: 'lab', description: 'Documentation and report writing practice' },
  { day: 24, title: 'Quantum Mechanics Lecture', subject: 'Quantum Mechanics', faculty: 'Dr. Amit Verma', classroom: 'Room 302', building: 'Science Block', startTime: '11:00', endTime: '12:00', batch: 'PHY-A', course: 'M.Sc Physics', department: 'Physics', type: 'lecture', description: 'Schrödinger equation and wave functions' },
  { day: 25, title: 'Faculty Development Program', subject: 'AI/ML Workshop', faculty: 'Prof. Deepa Krishnan', classroom: 'Seminar Hall', building: 'Main Building', startTime: '09:00', endTime: '17:00', batch: 'FACULTY', course: 'All Courses', department: 'Computer Science', type: 'event', description: 'One-day FDP on AI/ML tools for educators' },
  { day: 26, title: 'Embedded Systems Lecture', subject: 'Embedded Systems', faculty: 'Dr. Vikram Singh', classroom: 'Room 302', building: 'Engineering Block', startTime: '10:00', endTime: '11:00', batch: 'ECE-A', course: 'B.Tech ECE', department: 'Electronics', type: 'lecture', description: 'Real-time operating systems for embedded devices' },
  { day: 28, title: 'Calculus II Exam', subject: 'Calculus II', faculty: 'Prof. Sunita Sharma', classroom: 'Auditorium', building: 'Main Building', startTime: '09:00', endTime: '12:00', batch: 'MATH-A', course: 'B.Sc Mathematics', department: 'Mathematics', type: 'exam', description: 'Semester final examination' },
  { day: 29, title: 'Technical Symposium', subject: 'TechVista 2026', faculty: 'Dr. Rajesh Kumar', classroom: 'Auditorium', building: 'Main Building', startTime: '09:00', endTime: '16:00', batch: 'ALL', course: 'All Courses', department: 'Computer Science', type: 'event', description: 'Annual technical symposium with paper presentations and hackathon' },
  { day: 31, title: 'Polymer Science Lab', subject: 'Polymer Science', faculty: 'Prof. Anjali Gupta', classroom: 'Chemistry Lab', building: 'Science Block', startTime: '14:00', endTime: '16:00', batch: 'CHM-A', course: 'B.Sc Chemistry', department: 'Chemistry', type: 'lab', description: 'Polymer synthesis and characterization' },
]

export function generateEvents(): CalendarEvent[] {
  return eventTemplates.map((t, i) => ({
    id: `CE-${String(i + 1).padStart(3, '0')}`,
    date: dateStr(year, month, t.day),
    ...t,
  }))
}

export const allEvents = generateEvents()

export const departmentOptions = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics', 'English', 'All Departments',
]

export const facultyOptions = [
  'Dr. Rajesh Kumar', 'Prof. Sunita Sharma', 'Dr. Amit Verma', 'Prof. Priya Patel',
  'Dr. Vikram Singh', 'Prof. Anjali Gupta', 'Dr. Suresh Reddy', 'Prof. Meera Nair',
  'Prof. Deepa Krishnan',
]

export const courseOptions = [
  'B.Tech CSE', 'B.Tech ECE', 'B.Sc Mathematics', 'M.Sc Mathematics',
  'M.Sc Physics', 'B.Sc Chemistry', 'All Courses',
]

export const batchOptions = [
  'CSE-A', 'CSE-B', 'ECE-A', 'MATH-A', 'MATH-B', 'PHY-A', 'CHM-A', 'ALL',
]

export const classroomOptions = [
  'Room 201', 'Room 105', 'Room 302', 'Room 108', 'Room 205',
  'Lab 1', 'Lab 2', 'Lab 3', 'Chemistry Lab',
  'Auditorium', 'Seminar Hall',
]

export const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]
