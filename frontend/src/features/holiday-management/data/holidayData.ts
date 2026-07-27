import type { Holiday, SpecialEvent, HolidayStats } from '../types/holiday.types'

export const holidayStats: HolidayStats = {
  totalHolidays: 18,
  upcomingHolidays: 5,
  specialEvents: 12,
  workingDays: 220,
}

export const holidays: Holiday[] = [
  { id: 'H-001', name: 'Republic Day', date: '2026-01-26', day: 'Monday', type: 'national', department: 'All Departments', status: 'completed', description: 'National holiday - Republic Day celebrations' },
  { id: 'H-002', name: 'Maha Shivaratri', date: '2026-02-15', day: 'Sunday', type: 'festival', department: 'All Departments', status: 'completed', description: 'Festival holiday for Maha Shivaratri' },
  { id: 'H-003', name: 'Holi', date: '2026-03-03', day: 'Tuesday', type: 'festival', department: 'All Departments', status: 'completed', description: 'Festival of colors - Holi celebrations' },
  { id: 'H-004', name: 'Good Friday', date: '2026-04-03', day: 'Friday', type: 'national', department: 'All Departments', status: 'completed', description: 'Good Friday observed as holiday' },
  { id: 'H-005', name: 'Ambedkar Jayanti', date: '2026-04-14', day: 'Tuesday', type: 'national', department: 'All Departments', status: 'completed', description: 'Birth anniversary of Dr. B.R. Ambedkar' },
  { id: 'H-006', name: 'Spring Break', date: '2026-04-20', day: 'Monday', type: 'academic', department: 'All Departments', status: 'completed', description: 'Spring break - college remains closed' },
  { id: 'H-007', name: 'Spring Break', date: '2026-04-21', day: 'Tuesday', type: 'academic', department: 'All Departments', status: 'completed', description: 'Spring break - second day' },
  { id: 'H-008', name: 'Labour Day', date: '2026-05-01', day: 'Friday', type: 'national', department: 'All Departments', status: 'completed', description: 'International Workers Day' },
  { id: 'H-009', name: 'Buddha Purnima', date: '2026-05-10', day: 'Sunday', type: 'festival', department: 'All Departments', status: 'completed', description: 'Birth anniversary of Lord Buddha' },
  { id: 'H-010', name: 'Summer Vacation', date: '2026-06-01', day: 'Monday', type: 'academic', department: 'All Departments', status: 'completed', description: 'Summer vacation begins' },
  { id: 'H-011', name: 'Summer Vacation', date: '2026-06-30', day: 'Tuesday', type: 'academic', department: 'All Departments', status: 'completed', description: 'Summer vacation ends' },
  { id: 'H-012', name: 'Independence Day', date: '2026-08-15', day: 'Saturday', type: 'national', department: 'All Departments', status: 'upcoming', description: 'Independence Day celebrations with flag hoisting' },
  { id: 'H-013', name: 'Ganesh Chaturthi', date: '2026-09-19', day: 'Saturday', type: 'festival', department: 'All Departments', status: 'upcoming', description: 'Ganesh Chaturthi festival' },
  { id: 'H-014', name: 'Mid-Semester Break', date: '2026-09-28', day: 'Monday', type: 'academic', department: 'All Departments', status: 'upcoming', description: 'Mid-semester break for students' },
  { id: 'H-015', name: 'Dussehra', date: '2026-10-02', day: 'Friday', type: 'festival', department: 'All Departments', status: 'upcoming', description: 'Vijayadashami celebrations' },
  { id: 'H-016', name: 'Diwali', date: '2026-10-30', day: 'Friday', type: 'festival', department: 'All Departments', status: 'upcoming', description: 'Festival of Lights - Diwali' },
  { id: 'H-017', name: 'Christmas', date: '2026-12-25', day: 'Friday', type: 'national', department: 'All Departments', status: 'upcoming', description: 'Christmas Day celebrations' },
  { id: 'H-018', name: 'New Year Eve', date: '2026-12-31', day: 'Thursday', type: 'event', department: 'All Departments', status: 'upcoming', description: 'New Year celebrations' },
]

export const specialEvents: SpecialEvent[] = [
  { id: 'SE-001', name: 'Annual Technical Symposium', date: '2026-08-05', day: 'Wednesday', category: 'college_event', description: 'TechVista 2026 - Paper presentations, hackathon, and robotics competition' },
  { id: 'SE-002', name: 'Cultural Fest', date: '2026-09-15', day: 'Tuesday', category: 'college_event', description: 'Annual cultural fest with music, dance, and drama competitions' },
  { id: 'SE-003', name: 'Sports Day', date: '2026-10-12', day: 'Monday', category: 'college_event', description: 'Annual sports meet with athletics and team games' },
  { id: 'SE-004', name: 'AI/ML Workshop', date: '2026-07-25', day: 'Saturday', category: 'workshop', description: 'Hands-on workshop on Machine Learning using Python' },
  { id: 'SE-005', name: 'Web Development Bootcamp', date: '2026-08-20', day: 'Thursday', category: 'workshop', description: 'Full-stack web development bootcamp with React and Node.js' },
  { id: 'SE-006', name: 'Cybersecurity Seminar', date: '2026-07-30', day: 'Thursday', category: 'seminar', description: 'Guest lecture on cybersecurity trends and ethical hacking' },
  { id: 'SE-007', name: 'Entrepreneurship Talk', date: '2026-09-10', day: 'Thursday', category: 'seminar', description: 'Seminar on startup culture and entrepreneurship by industry experts' },
  { id: 'SE-008', name: 'Mid Semester Exams', date: '2026-08-10', day: 'Monday', category: 'exam', description: 'Mid-semester examinations for all departments' },
  { id: 'SE-009', name: 'Semester Final Exams', date: '2026-11-16', day: 'Monday', category: 'exam', description: 'End-semester examinations for all departments' },
  { id: 'SE-010', name: 'Diwali Celebration', date: '2026-10-30', day: 'Friday', category: 'festival', description: 'Diwali celebration event with cultural programs' },
  { id: 'SE-011', name: 'Christmas Celebration', date: '2026-12-24', day: 'Thursday', category: 'festival', description: 'Christmas eve celebration with carol singing' },
  { id: 'SE-012', name: 'New Year Gala', date: '2026-12-31', day: 'Thursday', category: 'festival', description: 'New Year eve celebration and awards ceremony' },
]

export const departmentOptions = ['All Departments', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics', 'Mechanical', 'Civil', 'English', 'Biotechnology', 'Business Administration']

export const monthOptions = [
  { value: '', label: 'All Months' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

export const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'national', label: 'National' },
  { value: 'festival', label: 'Festival' },
  { value: 'academic', label: 'Academic' },
  { value: 'event', label: 'Event' },
]

export function getHolidaysForDate(date: Date, holidayList: Holiday[]): Holiday[] {
  const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return holidayList.filter((h) => h.date === ds)
}
