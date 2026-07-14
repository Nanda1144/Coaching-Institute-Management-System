import type { HistoryRecord, HistoryFilters } from '../types/attendanceHistory.types'

const firstNames = [
  'Arun', 'Priya', 'Rohit', 'Sneha', 'Amit', 'Kavita', 'Vikram', 'Neha',
  'Rahul', 'Ananya', 'Deepak', 'Pooja', 'Manish', 'Divya', 'Suresh',
  'Meena', 'Rajesh', 'Anjali', 'Vivek', 'Nisha', 'Gaurav', 'Swati',
]

const lastNames = [
  'Sharma', 'Mehta', 'Verma', 'Kapoor', 'Singh', 'Joshi', 'Reddy', 'Gupta',
  'Kumar', 'Patel', 'Yadav', 'Agarwal', 'Mishra', 'Chopra', 'Desai',
  'Nair', 'Menon', 'Pillai', 'Rao', 'Iyer', 'Saxena', 'Bose',
]

const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil']
const courses = ['B.Tech', 'MCA', 'M.Tech', 'BCA', 'B.Sc']
const subjects = [
  'Data Structures', 'DBMS', 'Computer Networks', 'Operating Systems',
  'Software Engineering', 'Machine Learning', 'Web Development', 'Cloud Computing',
]
const faculties = [
  'Dr. Rajesh Kumar', 'Prof. Sunita Verma', 'Dr. Anand Gupta', 'Prof. Meena Joshi',
  'Dr. Vikram Singh', 'Prof. Deepak Saxena', 'Dr. Priya Nair',
]
const methods: HistoryRecord['method'][] = ['manual', 'face', 'fingerprint', 'qr']
const statuses: HistoryRecord['status'][] = ['present', 'absent', 'late', 'leave']
const batches = ['CS-2024', 'CS-2025', 'CS-2026', 'IT-2024', 'IT-2025', 'EC-2024', 'ME-2024']

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function generateDate(index: number): string {
  const d = new Date(2026, 6, 1)
  d.setDate(d.getDate() - index)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function generateTime(): string {
  const h = Math.floor(Math.random() * 11) + 7
  const m = Math.floor(Math.random() * 60)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h > 12 ? h - 12 : h
  return `${pad(h12)}:${pad(m)} ${ampm}`
}

export function generateRecords(count = 80): HistoryRecord[] {
  const records: HistoryRecord[] = []
  const used = new Set<string>()

  for (let i = 0; i < count; i++) {
    const fn = randomItem(firstNames)
    const ln = randomItem(lastNames)

    let name: string
    let roll: string
    const key = `${fn} ${ln}`
    if (used.has(key)) {
      name = `${fn} ${ln} ${Math.floor(Math.random() * 100)}`
      roll = `CS${2026}${pad(100 + i)}`
    } else {
      name = key
      used.add(key)
      roll = `CS${2026}${pad(100 + i)}`
    }

    records.push({
      id: `AH-${i + 1}`,
      date: generateDate(i),
      studentName: name,
      rollNumber: roll,
      department: randomItem(departments),
      course: randomItem(courses),
      batch: randomItem(batches),
      subject: randomItem(subjects),
      status: randomItem(statuses),
      method: randomItem(methods),
      faculty: randomItem(faculties),
      time: generateTime(),
    })
  }

  return records.sort((a, b) => b.date.localeCompare(a.date))
}

export const initialRecords = generateRecords(80)

export const filterOptions = {
  departments: [
    { value: '', label: 'All Departments' },
    ...departments.map((d) => ({ value: d, label: d })),
  ],
  courses: [
    { value: '', label: 'All Courses' },
    ...courses.map((c) => ({ value: c, label: c })),
  ],
  batches: [
    { value: '', label: 'All Batches' },
    ...batches.map((b) => ({ value: b, label: b })),
  ],
  statuses: [
    { value: '', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'leave', label: 'Leave' },
  ],
  methods: [
    { value: '', label: 'All Methods' },
    { value: 'manual', label: 'Manual' },
    { value: 'face', label: 'Face Recognition' },
    { value: 'fingerprint', label: 'Fingerprint' },
    { value: 'qr', label: 'QR Code' },
  ],
}

export const initialFilters: HistoryFilters = {
  search: '',
  department: '',
  course: '',
  batch: '',
  status: '',
  method: '',
  dateFrom: '',
  dateTo: '',
}

export const ITEMS_PER_PAGE = 10
