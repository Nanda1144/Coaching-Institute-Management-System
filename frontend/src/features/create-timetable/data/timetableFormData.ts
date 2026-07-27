import type { DropdownOption } from '../types/timetableForm.types'

export const academicYearOptions: DropdownOption[] = [
  { value: '2024-2025', label: '2024-2025' },
  { value: '2025-2026', label: '2025-2026' },
  { value: '2026-2027', label: '2026-2027' },
]

export const semesterOptions: DropdownOption[] = [
  { value: 'Semester 1', label: 'Semester 1' },
  { value: 'Semester 2', label: 'Semester 2' },
  { value: 'Semester 3', label: 'Semester 3' },
  { value: 'Semester 4', label: 'Semester 4' },
  { value: 'Semester 5', label: 'Semester 5' },
  { value: 'Semester 6', label: 'Semester 6' },
  { value: 'Semester 7', label: 'Semester 7' },
  { value: 'Semester 8', label: 'Semester 8' },
]

export const departmentOptions: DropdownOption[] = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
  { value: 'English', label: 'English' },
  { value: 'Biotechnology', label: 'Biotechnology' },
  { value: 'Business Administration', label: 'Business Administration' },
]

export const courseOptions: DropdownOption[] = [
  { value: 'B.Tech Computer Science', label: 'B.Tech Computer Science' },
  { value: 'B.Tech Electronics', label: 'B.Tech Electronics' },
  { value: 'B.Tech Mechanical', label: 'B.Tech Mechanical' },
  { value: 'B.Tech Civil', label: 'B.Tech Civil' },
  { value: 'B.Sc Mathematics', label: 'B.Sc Mathematics' },
  { value: 'B.Sc Physics', label: 'B.Sc Physics' },
  { value: 'B.Sc Chemistry', label: 'B.Sc Chemistry' },
  { value: 'M.Sc Mathematics', label: 'M.Sc Mathematics' },
  { value: 'M.Sc Physics', label: 'M.Sc Physics' },
  { value: 'M.Sc Chemistry', label: 'M.Sc Chemistry' },
  { value: 'MBA', label: 'MBA' },
  { value: 'B.A. English', label: 'B.A. English' },
]

export const batchOptions: DropdownOption[] = [
  { value: 'CSE-A', label: 'CSE-A' },
  { value: 'CSE-B', label: 'CSE-B' },
  { value: 'ECE-A', label: 'ECE-A' },
  { value: 'ECE-B', label: 'ECE-B' },
  { value: 'MATH-A', label: 'MATH-A' },
  { value: 'MATH-B', label: 'MATH-B' },
  { value: 'PHY-A', label: 'PHY-A' },
  { value: 'CHM-A', label: 'CHM-A' },
  { value: 'MECH-A', label: 'MECH-A' },
  { value: 'CIVIL-A', label: 'CIVIL-A' },
  { value: 'BBA-A', label: 'BBA-A' },
  { value: 'ENG-A', label: 'ENG-A' },
]

export const sectionOptions: DropdownOption[] = [
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
]

export const subjectOptions: DropdownOption[] = [
  { value: 'Data Structures', label: 'Data Structures' },
  { value: 'Database Systems', label: 'Database Systems' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Calculus II', label: 'Calculus II' },
  { value: 'Linear Algebra', label: 'Linear Algebra' },
  { value: 'Statistics', label: 'Statistics' },
  { value: 'Discrete Mathematics', label: 'Discrete Mathematics' },
  { value: 'Quantum Mechanics', label: 'Quantum Mechanics' },
  { value: 'Electrodynamics', label: 'Electrodynamics' },
  { value: 'Thermodynamics', label: 'Thermodynamics' },
  { value: 'Circuit Analysis', label: 'Circuit Analysis' },
  { value: 'Embedded Systems', label: 'Embedded Systems' },
  { value: 'Organic Chemistry', label: 'Organic Chemistry' },
  { value: 'Polymer Science', label: 'Polymer Science' },
  { value: 'Technical Writing', label: 'Technical Writing' },
  { value: 'Communication Skills', label: 'Communication Skills' },
]

export const facultyOptions: DropdownOption[] = [
  { value: 'Dr. Rajesh Kumar', label: 'Dr. Rajesh Kumar - CSE' },
  { value: 'Prof. Priya Patel', label: 'Prof. Priya Patel - CSE' },
  { value: 'Prof. Deepa Krishnan', label: 'Prof. Deepa Krishnan - CSE' },
  { value: 'Prof. Sunita Sharma', label: 'Prof. Sunita Sharma - Mathematics' },
  { value: 'Dr. Suresh Reddy', label: 'Dr. Suresh Reddy - Mathematics' },
  { value: 'Dr. Amit Verma', label: 'Dr. Amit Verma - Physics' },
  { value: 'Prof. Anjali Gupta', label: 'Prof. Anjali Gupta - Chemistry' },
  { value: 'Dr. Vikram Singh', label: 'Dr. Vikram Singh - Electronics' },
  { value: 'Prof. Meera Nair', label: 'Prof. Meera Nair - English' },
  { value: 'Dr. Arjun Joshi', label: 'Dr. Arjun Joshi - Physics' },
]

export const classroomOptions: DropdownOption[] = [
  { value: 'Room 201', label: 'Room 201 - Capacity: 60' },
  { value: 'Room 105', label: 'Room 105 - Capacity: 50' },
  { value: 'Room 302', label: 'Room 302 - Capacity: 45' },
  { value: 'Room 108', label: 'Room 108 - Capacity: 40' },
  { value: 'Room 205', label: 'Room 205 - Capacity: 50' },
  { value: 'Lab 1', label: 'Lab 1 - Capacity: 30' },
  { value: 'Lab 2', label: 'Lab 2 - Capacity: 30' },
  { value: 'Lab 3', label: 'Lab 3 - Capacity: 25' },
  { value: 'Auditorium', label: 'Auditorium - Capacity: 200' },
  { value: 'Seminar Hall', label: 'Seminar Hall - Capacity: 100' },
]

export const buildingOptions: DropdownOption[] = [
  { value: 'Main Building', label: 'Main Building' },
  { value: 'Science Block', label: 'Science Block' },
  { value: 'Engineering Block', label: 'Engineering Block' },
  { value: 'Arts Block', label: 'Arts Block' },
  { value: 'Management Block', label: 'Management Block' },
  { value: 'Library Complex', label: 'Library Complex' },
]

export const floorOptions: DropdownOption[] = [
  { value: 'Ground Floor', label: 'Ground Floor' },
  { value: 'First Floor', label: 'First Floor' },
  { value: 'Second Floor', label: 'Second Floor' },
  { value: 'Third Floor', label: 'Third Floor' },
  { value: 'Fourth Floor', label: 'Fourth Floor' },
]

export const dayOptions: DropdownOption[] = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
]

export const statusOptions: DropdownOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Tentative', label: 'Tentative' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Rescheduled', label: 'Rescheduled' },
]

export const recurringOptions: DropdownOption[] = [
  { value: 'none', label: 'None (Single Class)' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export const timeSlots: string[] = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
]
