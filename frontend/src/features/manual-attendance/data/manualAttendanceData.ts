import type { DropdownOption, StudentAttendance } from '../types/manualAttendance.types'

export const departmentOptions: DropdownOption[] = [
  { value: '', label: 'Select Department...' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
  { value: 'English', label: 'English' },
]

export const courseOptions: DropdownOption[] = [
  { value: '', label: 'Select Course...' },
  { value: 'B.Tech Computer Science', label: 'B.Tech Computer Science' },
  { value: 'B.Tech Electronics', label: 'B.Tech Electronics' },
  { value: 'B.Tech Mechanical', label: 'B.Tech Mechanical' },
  { value: 'B.Tech Civil', label: 'B.Tech Civil' },
  { value: 'B.Sc Mathematics', label: 'B.Sc Mathematics' },
  { value: 'B.Sc Physics', label: 'B.Sc Physics' },
  { value: 'B.Sc Chemistry', label: 'B.Sc Chemistry' },
  { value: 'M.Sc Mathematics', label: 'M.Sc Mathematics' },
  { value: 'M.Sc Physics', label: 'M.Sc Physics' },
]

export const semesterOptions: DropdownOption[] = [
  { value: '', label: 'Select Semester...' },
  { value: 'Semester 1', label: 'Semester 1' },
  { value: 'Semester 2', label: 'Semester 2' },
  { value: 'Semester 3', label: 'Semester 3' },
  { value: 'Semester 4', label: 'Semester 4' },
  { value: 'Semester 5', label: 'Semester 5' },
  { value: 'Semester 6', label: 'Semester 6' },
  { value: 'Semester 7', label: 'Semester 7' },
  { value: 'Semester 8', label: 'Semester 8' },
]

export const batchOptions: DropdownOption[] = [
  { value: '', label: 'Select Batch...' },
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
]

export const sectionOptions: DropdownOption[] = [
  { value: '', label: 'Select Section...' },
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
]

export const subjectOptions: DropdownOption[] = [
  { value: '', label: 'Select Subject...' },
  { value: 'Data Structures', label: 'Data Structures' },
  { value: 'Database Systems', label: 'Database Systems' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Calculus II', label: 'Calculus II' },
  { value: 'Linear Algebra', label: 'Linear Algebra' },
  { value: 'Statistics', label: 'Statistics' },
  { value: 'Quantum Mechanics', label: 'Quantum Mechanics' },
  { value: 'Circuit Analysis', label: 'Circuit Analysis' },
  { value: 'Organic Chemistry', label: 'Organic Chemistry' },
]

export const facultyOptions: DropdownOption[] = [
  { value: '', label: 'Select Faculty...' },
  { value: 'Dr. Rajesh Kumar', label: 'Dr. Rajesh Kumar - CSE' },
  { value: 'Prof. Priya Patel', label: 'Prof. Priya Patel - CSE' },
  { value: 'Prof. Deepa Krishnan', label: 'Prof. Deepa Krishnan - CSE' },
  { value: 'Prof. Sunita Sharma', label: 'Prof. Sunita Sharma - Mathematics' },
  { value: 'Dr. Suresh Reddy', label: 'Dr. Suresh Reddy - Mathematics' },
  { value: 'Dr. Amit Verma', label: 'Dr. Amit Verma - Physics' },
  { value: 'Prof. Anjali Gupta', label: 'Prof. Anjali Gupta - Chemistry' },
  { value: 'Dr. Vikram Singh', label: 'Dr. Vikram Singh - Electronics' },
]

export const initialStudents: StudentAttendance[] = [
  { id: 'STU-001', rollNumber: 'CS2001', studentName: 'Aarav Sharma', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-002', rollNumber: 'CS2002', studentName: 'Priya Patel', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-003', rollNumber: 'CS2003', studentName: 'Rohan Verma', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-004', rollNumber: 'CS2004', studentName: 'Neha Kapoor', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-005', rollNumber: 'CS2005', studentName: 'Pooja Iyer', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-006', rollNumber: 'CS2006', studentName: 'Gaurav Bhatia', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-007', rollNumber: 'CS2007', studentName: 'Sneha Reddy', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-008', rollNumber: 'CS2008', studentName: 'Arjun Nair', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-009', rollNumber: 'CS2009', studentName: 'Divya Krishnan', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-010', rollNumber: 'CS2010', studentName: 'Karan Mehta', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-011', rollNumber: 'CS2011', studentName: 'Ananya Gupta', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-012', rollNumber: 'CS2012', studentName: 'Rahul Desai', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-013', rollNumber: 'CS2013', studentName: 'Meera Joshi', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-014', rollNumber: 'CS2014', studentName: 'Aditya Mishra', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-015', rollNumber: 'CS2015', studentName: 'Ishita Jain', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-016', rollNumber: 'CS2016', studentName: 'Manish Yadav', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-017', rollNumber: 'CS2017', studentName: 'Kavya Nambiar', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-018', rollNumber: 'CS2018', studentName: 'Siddharth Rao', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-019', rollNumber: 'CS2019', studentName: 'Anjali Menon', photoUrl: '', status: null, remarks: '' },
  { id: 'STU-020', rollNumber: 'CS2020', studentName: 'Vikram Singh', photoUrl: '', status: null, remarks: '' },
]

export const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  present: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  absent: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  late: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'half-day': { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
  leave: { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
}
