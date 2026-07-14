import type { FacultyInfo, FacultyScheduleEntry, FacultyStats } from '../types/facultyTimetable.types'

export const facultyInfo: FacultyInfo = {
  id: 'FAC-001',
  photo: '',
  name: 'Dr. Rajesh Kumar',
  department: 'Computer Science & Engineering',
  designation: 'Professor',
  subjects: ['Data Structures', 'Algorithms', 'Advanced Data Structures'],
  experience: 14,
}

const today = new Date()
const todayStr = today.toISOString().slice(0, 10)
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const todayDay = dayNames[today.getDay()]

const getDate = (dayIndex: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + (dayIndex - today.getDay()))
  return d.toISOString().slice(0, 10)
}

export const facultyScheduleEntries: FacultyScheduleEntry[] = [
  {
    id: 'FS-001',
    time: '09:00 AM - 10:00 AM',
    course: 'B.Tech CSE',
    subject: 'Data Structures',
    batch: 'CSE-A (2024-28)',
    classroom: 'Room 201',
    status: 'Scheduled',
    day: todayDay,
    date: todayStr,
  },
  {
    id: 'FS-002',
    time: '10:00 AM - 11:00 AM',
    course: 'B.Tech CSE',
    subject: 'Algorithms',
    batch: 'CSE-B (2023-27)',
    classroom: 'Room 203',
    status: 'Scheduled',
    day: todayDay,
    date: todayStr,
  },
  {
    id: 'FS-003',
    time: '11:00 AM - 12:00 PM',
    course: 'B.Tech CSE',
    subject: 'Data Structures Lab',
    batch: 'CSE-A (2024-28)',
    classroom: 'Lab 1',
    status: 'Ongoing',
    day: todayDay,
    date: todayStr,
  },
  {
    id: 'FS-004',
    time: '02:00 PM - 03:00 PM',
    course: 'M.Tech CSE',
    subject: 'Advanced Data Structures',
    batch: 'MTech CSE (2024-26)',
    classroom: 'Room 305',
    status: 'Scheduled',
    day: todayDay,
    date: todayStr,
  },
  ...['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].filter((d) => d !== todayDay).flatMap((day, di) => {
    const date = getDate(
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
    )
    const base = { day, date }
    const entries: FacultyScheduleEntry[] = []
    let ci = di * 5 + 5
    entries.push({ ...base, id: `FS-${String(ci++).padStart(3, '0')}`, time: '09:00 AM - 10:00 AM', course: 'B.Tech CSE', subject: 'Data Structures', batch: 'CSE-A (2024-28)', classroom: 'Room 201', status: 'Scheduled' })
    entries.push({ ...base, id: `FS-${String(ci++).padStart(3, '0')}`, time: '10:00 AM - 11:00 AM', course: 'B.Tech CSE', subject: 'Algorithms', batch: 'CSE-B (2023-27)', classroom: 'Room 203', status: 'Scheduled' })
    if (day === 'Wednesday') {
      entries.push({ ...base, id: `FS-${String(ci++).padStart(3, '0')}`, time: '11:00 AM - 12:00 PM', course: 'B.Tech CSE', subject: 'Data Structures Lab', batch: 'CSE-A (2024-28)', classroom: 'Lab 2', status: 'Scheduled' })
    } else {
      entries.push({ ...base, id: `FS-${String(ci++).padStart(3, '0')}`, time: '11:00 AM - 12:00 PM', course: 'B.Tech CSE', subject: 'Algorithms Lab', batch: 'CSE-B (2023-27)', classroom: 'Lab 1', status: 'Scheduled' })
    }
    entries.push({ ...base, id: `FS-${String(ci++).padStart(3, '0')}`, time: '02:00 PM - 03:00 PM', course: 'M.Tech CSE', subject: 'Advanced Data Structures', batch: 'MTech CSE (2024-26)', classroom: 'Room 305', status: 'Scheduled' })
    entries.push({ ...base, id: `FS-${String(ci++).padStart(3, '0')}`, time: '03:00 PM - 04:00 PM', course: 'B.Tech CSE', subject: 'Research / Free', batch: '—', classroom: 'Lab 3', status: 'Scheduled' })
    return entries
  }),
]

export const facultyPastEntries: FacultyScheduleEntry[] = [
  {
    id: 'FS-P01',
    time: '09:00 AM - 10:00 AM',
    course: 'B.Tech CSE',
    subject: 'Data Structures',
    batch: 'CSE-A (2024-28)',
    classroom: 'Room 201',
    status: 'Completed',
    day: 'Monday',
    date: getDate(today.getDay() >= 1 ? today.getDay() - 1 : 1),
  },
  {
    id: 'FS-P02',
    time: '10:00 AM - 11:00 AM',
    course: 'B.Tech CSE',
    subject: 'Algorithms',
    batch: 'CSE-B (2023-27)',
    classroom: 'Room 203',
    status: 'Completed',
    day: 'Monday',
    date: getDate(today.getDay() >= 1 ? today.getDay() - 1 : 1),
  },
]

export const facultyStats: FacultyStats = {
  classesToday: 4,
  classesThisWeek: 22,
  studentsAssigned: 228,
  workingHours: 38,
}

export const facultyDayOptions = [
  { value: '', label: 'All Days' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
]
