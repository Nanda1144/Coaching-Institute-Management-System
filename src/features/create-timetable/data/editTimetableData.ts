export interface EditTimetableEntry {
  id: string
  academicYear: string
  semester: string
  department: string
  course: string
  batch: string
  section: string
  subject: string
  faculty: string
  classroom: string
  building: string
  floor: string
  day: string
  startTime: string
  endTime: string
  status: string
  remarks: string
  recurringClass: string
  lastModified: string
  createdBy: string
}

export const editTimetableEntries: EditTimetableEntry[] = [
  {
    id: 'TT-101',
    academicYear: '2025-2026',
    semester: 'Semester 4',
    department: 'Computer Science',
    course: 'B.Tech Computer Science',
    batch: 'CSE-A',
    section: 'A',
    subject: 'Data Structures',
    faculty: 'Dr. Rajesh Kumar',
    classroom: 'Room 201',
    building: 'Engineering Block',
    floor: 'Second Floor',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    status: 'Active',
    remarks: 'Regular weekly lecture for CSE-A batch',
    recurringClass: 'weekly',
    lastModified: '2026-07-10',
    createdBy: 'Admin',
  },
  {
    id: 'TT-102',
    academicYear: '2025-2026',
    semester: 'Semester 4',
    department: 'Computer Science',
    course: 'B.Tech Computer Science',
    batch: 'CSE-B',
    section: 'B',
    subject: 'Database Systems',
    faculty: 'Prof. Priya Patel',
    classroom: 'Lab 1',
    building: 'Engineering Block',
    floor: 'First Floor',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    status: 'Active',
    remarks: 'DBMS lab session - alternate weeks',
    recurringClass: 'biweekly',
    lastModified: '2026-07-08',
    createdBy: 'Admin',
  },
  {
    id: 'TT-103',
    academicYear: '2025-2026',
    semester: 'Semester 6',
    department: 'Electronics',
    course: 'B.Tech Electronics',
    batch: 'ECE-A',
    section: 'A',
    subject: 'Circuit Analysis',
    faculty: 'Dr. Vikram Singh',
    classroom: 'Lab 3',
    building: 'Engineering Block',
    floor: 'Third Floor',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '11:00',
    status: 'Active',
    remarks: 'Circuit theory lecture',
    recurringClass: 'weekly',
    lastModified: '2026-07-05',
    createdBy: 'HOD ECE',
  },
  {
    id: 'TT-104',
    academicYear: '2025-2026',
    semester: 'Semester 2',
    department: 'Mathematics',
    course: 'B.Sc Mathematics',
    batch: 'MATH-A',
    section: 'A',
    subject: 'Calculus II',
    faculty: 'Prof. Sunita Sharma',
    classroom: 'Room 105',
    building: 'Science Block',
    floor: 'First Floor',
    day: 'Thursday',
    startTime: '08:00',
    endTime: '09:00',
    status: 'Tentative',
    remarks: 'Tentative schedule awaiting confirmation',
    recurringClass: 'weekly',
    lastModified: '2026-07-12',
    createdBy: 'Admin',
  },
  {
    id: 'TT-105',
    academicYear: '2025-2026',
    semester: 'Semester 6',
    department: 'Physics',
    course: 'M.Sc Physics',
    batch: 'PHY-A',
    section: 'A',
    subject: 'Quantum Mechanics',
    faculty: 'Dr. Amit Verma',
    classroom: 'Room 302',
    building: 'Science Block',
    floor: 'Third Floor',
    day: 'Friday',
    startTime: '11:00',
    endTime: '12:00',
    status: 'Active',
    remarks: 'Advanced quantum mechanics lecture series',
    recurringClass: 'weekly',
    lastModified: '2026-07-03',
    createdBy: 'HOD Physics',
  },
]

export function getEditEntryById(id: string): EditTimetableEntry | undefined {
  return editTimetableEntries.find((e) => e.id === id)
}
