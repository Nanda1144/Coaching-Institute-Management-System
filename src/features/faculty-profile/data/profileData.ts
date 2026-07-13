import type { FacultyProfile, AssignedCourse, AssignedBatch, DaySchedule, AttendanceSummary, PerformanceData, Document } from '../types/profile.types'

export const facultyProfile: FacultyProfile = {
  id: 'FAC-001',
  photo: '',
  name: 'Dr. Rajesh Kumar',
  designation: 'Professor',
  department: 'Computer Science',
  experience: 14,
  email: 'rajesh.kumar@college.edu',
  phone: '+91-9876543210',
  address: '42, Academic Heights, Sector 12, Dwarka, New Delhi - 110075',
  dob: '1982-05-15',
  gender: 'Male',
  qualification: 'Ph.D. Computer Science',
  specialization: 'Data Structures & Algorithms',
  joiningDate: '2019-08-15',
  employmentType: 'Permanent',
  branch: 'Main Campus',
  status: 'Active',
}

export const assignedCourses: AssignedCourse[] = [
  { id: 'C-001', course: 'B.Tech CSE', subject: 'Data Structures', semester: 3, branch: 'Main Campus' },
  { id: 'C-002', course: 'B.Tech CSE', subject: 'Algorithms', semester: 4, branch: 'Main Campus' },
  { id: 'C-003', course: 'M.Tech CSE', subject: 'Advanced Data Structures', semester: 1, branch: 'Main Campus' },
  { id: 'C-004', course: 'B.Tech CSE', subject: 'Design & Analysis of Algorithms', semester: 5, branch: 'Main Campus' },
]

export const assignedBatches: AssignedBatch[] = [
  { id: 'B-001', batchName: 'CSE-A (2024-28)', students: 72, year: 1 },
  { id: 'B-002', batchName: 'CSE-B (2023-27)', students: 68, year: 2 },
  { id: 'B-003', batchName: 'CSE-A (2022-26)', students: 70, year: 3 },
  { id: 'B-004', batchName: 'MTech CSE (2024-26)', students: 18, year: 1 },
]

export const weeklyTimetable: DaySchedule[] = [
  {
    day: 'Monday',
    slots: [
      { time: '09:00 - 10:00', subject: 'Data Structures', room: 'Room 201' },
      { time: '10:00 - 11:00', subject: 'Free Period', room: '-' },
      { time: '11:00 - 12:00', subject: 'Algorithms Lab', room: 'Lab 1' },
      { time: '12:00 - 13:00', subject: 'Lunch Break', room: '-' },
      { time: '14:00 - 15:00', subject: 'Adv. Data Structures', room: 'Room 305' },
      { time: '15:00 - 16:00', subject: 'Department Meeting', room: 'Conf. Room' },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '09:00 - 10:00', subject: 'Algorithms', room: 'Room 203' },
      { time: '10:00 - 11:00', subject: 'Data Structures', room: 'Room 201' },
      { time: '11:00 - 12:00', subject: 'Free Period', room: '-' },
      { time: '12:00 - 13:00', subject: 'Lunch Break', room: '-' },
      { time: '14:00 - 15:00', subject: 'Research Work', room: 'Lab 3' },
      { time: '15:00 - 16:00', subject: 'Free Period', room: '-' },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { time: '09:00 - 10:00', subject: 'Adv. Data Structures', room: 'Room 305' },
      { time: '10:00 - 11:00', subject: 'Algorithms', room: 'Room 203' },
      { time: '11:00 - 12:00', subject: 'Data Structures Lab', room: 'Lab 2' },
      { time: '12:00 - 13:00', subject: 'Lunch Break', room: '-' },
      { time: '14:00 - 15:00', subject: 'Free Period', room: '-' },
      { time: '15:00 - 16:00', subject: 'Student Counselling', room: 'Office' },
    ],
  },
  {
    day: 'Thursday',
    slots: [
      { time: '09:00 - 10:00', subject: 'Free Period', room: '-' },
      { time: '10:00 - 11:00', subject: 'Data Structures', room: 'Room 201' },
      { time: '11:00 - 12:00', subject: 'Algorithms', room: 'Room 203' },
      { time: '12:00 - 13:00', subject: 'Lunch Break', room: '-' },
      { time: '14:00 - 15:00', subject: 'Adv. Data Structures Lab', room: 'Lab 1' },
      { time: '15:00 - 16:00', subject: 'Free Period', room: '-' },
    ],
  },
  {
    day: 'Friday',
    slots: [
      { time: '09:00 - 10:00', subject: 'Algorithms', room: 'Room 203' },
      { time: '10:00 - 11:00', subject: 'Adv. Data Structures', room: 'Room 305' },
      { time: '11:00 - 12:00', subject: 'Data Structures', room: 'Room 201' },
      { time: '12:00 - 13:00', subject: 'Lunch Break', room: '-' },
      { time: '14:00 - 15:00', subject: 'Faculty Meeting', room: 'Conf. Room' },
      { time: '15:00 - 16:00', subject: 'Free Period', room: '-' },
    ],
  },
  {
    day: 'Saturday',
    slots: [
      { time: '09:00 - 11:00', subject: 'Special Lab Session', room: 'Lab 2' },
      { time: '11:00 - 12:00', subject: 'Research Guidance', room: 'Room 305' },
      { time: '12:00 - 13:00', subject: 'Lunch Break', room: '-' },
      { time: '14:00 - 15:00', subject: 'Free Period', room: '-' },
      { time: '15:00 - 16:00', subject: 'Weekend Activity', room: 'Auditorium' },
    ],
  },
]

export const attendanceSummary: AttendanceSummary = {
  present: 178,
  absent: 8,
  leave: 6,
  total: 192,
}

export const performanceData: PerformanceData = {
  subjectsHandled: 4,
  students: 228,
  feedbackRating: 4.6,
}

export const documents: Document[] = [
  { id: 'D-001', name: 'Ph.D. Certificate', type: 'Certificate', date: '2010-05-20' },
  { id: 'D-002', name: 'M.Tech Degree', type: 'Certificate', date: '2005-07-15' },
  { id: 'D-003', name: 'Academic Resume', type: 'Resume', date: '2024-01-10' },
  { id: 'D-004', name: 'Offer Letter - Professor', type: 'Offer Letter', date: '2019-08-01' },
  { id: 'D-005', name: 'Best Teacher Award', type: 'Certificate', date: '2023-09-05' },
]
