import type { StudentInfo, ScheduleEntry, QuickStats } from '../types/studentTimetable.types'

export const studentInfo: StudentInfo = {
  photo: '',
  name: 'Rahul Sharma',
  rollNumber: 'CS2024001',
  department: 'Computer Science & Engineering',
  course: 'B.Tech',
  batch: 'CSE-A (2024-28)',
  semester: 4,
}

const today = new Date()
const todayStr = today.toISOString().slice(0, 10)
const todayMonth = today.toLocaleString('en-US', { month: 'long' })
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const todayDay = dayNames[today.getDay()]

const getDate = (dayIndex: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + (dayIndex - today.getDay()))
  return d.toISOString().slice(0, 10)
}

export const scheduleEntries: ScheduleEntry[] = [
  {
    id: 'ST-001',
    time: '09:00 AM - 10:00 AM',
    subject: 'Data Structures & Algorithms',
    faculty: 'Dr. Priya Patel',
    classroom: 'Lab 101',
    status: 'Scheduled',
    attendance: 'Not Marked',
    day: todayDay,
    date: todayStr,
    month: todayMonth,
  },
  {
    id: 'ST-002',
    time: '10:00 AM - 11:00 AM',
    subject: 'Database Management Systems',
    faculty: 'Prof. Amit Verma',
    classroom: 'Room 203',
    status: 'Scheduled',
    attendance: 'Not Marked',
    day: todayDay,
    date: todayStr,
    month: todayMonth,
  },
  {
    id: 'ST-003',
    time: '11:15 AM - 12:15 PM',
    subject: 'Computer Networks',
    faculty: 'Dr. Sneha Reddy',
    classroom: 'Room 305',
    status: 'Scheduled',
    attendance: 'Not Marked',
    day: todayDay,
    date: todayStr,
    month: todayMonth,
  },
  {
    id: 'ST-004',
    time: '01:00 PM - 02:00 PM',
    subject: 'Software Engineering',
    faculty: 'Prof. Vikram Singh',
    classroom: 'Lab 102',
    status: 'Scheduled',
    attendance: 'Not Marked',
    day: todayDay,
    date: todayStr,
    month: todayMonth,
  },
  ...['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].filter((d) => d !== todayDay).flatMap((day, di) => {
    const date = getDate(
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
    )
    const base = { day, date, month: todayMonth, attendance: 'Not Marked' as const }
    return [
      { ...base, id: `ST-0${di * 5 + 5}`, time: '09:00 AM - 10:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Priya Patel', classroom: 'Lab 101', status: 'Scheduled' as const },
      { ...base, id: `ST-0${di * 5 + 6}`, time: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', faculty: 'Prof. Amit Verma', classroom: 'Room 203', status: 'Scheduled' as const },
      { ...base, id: `ST-0${di * 5 + 7}`, time: '11:15 AM - 12:15 PM', subject: 'Computer Networks', faculty: 'Dr. Sneha Reddy', classroom: 'Room 305', status: 'Scheduled' as const },
      { ...base, id: `ST-0${di * 5 + 8}`, time: '01:00 PM - 02:00 PM', subject: 'Software Engineering', faculty: 'Prof. Vikram Singh', classroom: 'Lab 102', status: 'Scheduled' as const },
      { ...base, id: `ST-0${di * 5 + 9}`, time: '02:00 PM - 03:00 PM', subject: 'Mathematics IV', faculty: 'Dr. Anjali Mehta', classroom: 'Room 201', status: 'Scheduled' as const },
    ]
  }),
]

export const pastScheduleEntries: ScheduleEntry[] = [
  {
    id: 'ST-P01',
    time: '09:00 AM - 10:00 AM',
    subject: 'Data Structures & Algorithms',
    faculty: 'Dr. Priya Patel',
    classroom: 'Lab 101',
    status: 'Completed',
    attendance: 'Present',
    day: 'Monday',
    date: getDate(today.getDay() >= 1 ? today.getDay() - 1 : 1),
    month: todayMonth,
  },
  {
    id: 'ST-P02',
    time: '10:00 AM - 11:00 AM',
    subject: 'Database Management Systems',
    faculty: 'Prof. Amit Verma',
    classroom: 'Room 203',
    status: 'Completed',
    attendance: 'Present',
    day: 'Monday',
    date: getDate(today.getDay() >= 1 ? today.getDay() - 1 : 1),
    month: todayMonth,
  },
  {
    id: 'ST-P03',
    time: '11:15 AM - 12:15 PM',
    subject: 'Computer Networks',
    faculty: 'Dr. Sneha Reddy',
    classroom: 'Room 305',
    status: 'Completed',
    attendance: 'Absent',
    day: 'Monday',
    date: getDate(today.getDay() >= 1 ? today.getDay() - 1 : 1),
    month: todayMonth,
  },
  {
    id: 'ST-P04',
    time: '01:00 PM - 02:00 PM',
    subject: 'Software Engineering',
    faculty: 'Prof. Vikram Singh',
    classroom: 'Lab 102',
    status: 'Completed',
    attendance: 'Present',
    day: 'Monday',
    date: getDate(today.getDay() >= 1 ? today.getDay() - 1 : 1),
    month: todayMonth,
  },
  {
    id: 'ST-P05',
    time: '02:00 PM - 03:00 PM',
    subject: 'Mathematics IV',
    faculty: 'Dr. Anjali Mehta',
    classroom: 'Room 201',
    status: 'Completed',
    attendance: 'Present',
    day: 'Monday',
    date: getDate(today.getDay() >= 1 ? today.getDay() - 1 : 1),
    month: todayMonth,
  },
  {
    id: 'ST-P06',
    time: '09:00 AM - 10:00 AM',
    subject: 'Data Structures & Algorithms',
    faculty: 'Dr. Priya Patel',
    classroom: 'Lab 101',
    status: 'Completed',
    attendance: 'Present',
    day: 'Tuesday',
    date: getDate(today.getDay() >= 2 ? today.getDay() - 2 : 2),
    month: todayMonth,
  },
  {
    id: 'ST-P07',
    time: '10:00 AM - 11:00 AM',
    subject: 'Database Management Systems',
    faculty: 'Prof. Amit Verma',
    classroom: 'Room 203',
    status: 'Completed',
    attendance: 'Present',
    day: 'Tuesday',
    date: getDate(today.getDay() >= 2 ? today.getDay() - 2 : 2),
    month: todayMonth,
  },
]

export const quickStats: QuickStats = {
  classesToday: 4,
  attendancePercentage: 87.5,
  upcomingExams: 3,
  assignments: 5,
}

export const dayOptions = [
  { value: '', label: 'All Days' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
]

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
