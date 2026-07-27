import type { AnalyticsData, AnalyticsFilters } from '../types/attendanceAnalytics.types'

export const initialFilters: AnalyticsFilters = {
  department: '',
  faculty: '',
  semester: '',
  course: '',
  dateFrom: '2026-01-01',
  dateTo: '2026-07-14',
}

export const filterOptions = {
  departments: [
    { value: '', label: 'All Departments' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Mechanical', label: 'Mechanical' },
    { value: 'Civil', label: 'Civil' },
  ],
  faculties: [
    { value: '', label: 'All Faculty' },
    { value: 'Dr. Rajesh Kumar', label: 'Dr. Rajesh Kumar' },
    { value: 'Prof. Sunita Verma', label: 'Prof. Sunita Verma' },
    { value: 'Dr. Anand Gupta', label: 'Dr. Anand Gupta' },
    { value: 'Prof. Meena Joshi', label: 'Prof. Meena Joshi' },
    { value: 'Dr. Vikram Singh', label: 'Dr. Vikram Singh' },
  ],
  semesters: [
    { value: '', label: 'All Semesters' },
    { value: 'Sem 1', label: 'Semester 1' },
    { value: 'Sem 2', label: 'Semester 2' },
    { value: 'Sem 3', label: 'Semester 3' },
    { value: 'Sem 4', label: 'Semester 4' },
    { value: 'Sem 5', label: 'Semester 5' },
    { value: 'Sem 6', label: 'Semester 6' },
  ],
  courses: [
    { value: '', label: 'All Courses' },
    { value: 'B.Tech', label: 'B.Tech' },
    { value: 'MCA', label: 'MCA' },
    { value: 'M.Tech', label: 'M.Tech' },
    { value: 'BCA', label: 'BCA' },
    { value: 'B.Sc', label: 'B.Sc' },
  ],
}

export const dummyAnalyticsData: AnalyticsData = {
  cards: {
    overallPercentage: 87.3,
    averageAttendance: 172,
    highestAttendance: { value: 94.2, department: 'Computer Science' },
    lowestAttendance: { value: 78.5, department: 'Civil' },
  },

  trend: [
    { label: 'Mon', percentage: 88, present: 176, total: 200 },
    { label: 'Tue', percentage: 92, present: 184, total: 200 },
    { label: 'Wed', percentage: 85, present: 170, total: 200 },
    { label: 'Thu', percentage: 90, present: 180, total: 200 },
    { label: 'Fri', percentage: 82, present: 164, total: 200 },
    { label: 'Sat', percentage: 72, present: 108, total: 150 },
  ],

  departmentData: [
    { department: 'Computer Science', percentage: 94.2, present: 1319, total: 1400 },
    { department: 'Information Technology', percentage: 91.8, present: 1010, total: 1100 },
    { department: 'Electronics', percentage: 87.5, present: 831, total: 950 },
    { department: 'Mechanical', percentage: 83.1, present: 706, total: 850 },
    { department: 'Civil', percentage: 78.5, present: 612, total: 780 },
  ],

  monthlyData: [
    { month: 'Jan', percentage: 84.2 },
    { month: 'Feb', percentage: 86.5 },
    { month: 'Mar', percentage: 88.1 },
    { month: 'Apr', percentage: 85.7 },
    { month: 'May', percentage: 90.3 },
    { month: 'Jun', percentage: 87.8 },
    { month: 'Jul', percentage: 89.2 },
  ],

  heatmap: [
    {
      day: 'Week 1', slots: [
        { label: '9 AM', value: 92, count: 46 },
        { label: '10 AM', value: 88, count: 44 },
        { label: '11 AM', value: 95, count: 48 },
        { label: '12 PM', value: 78, count: 39 },
        { label: '2 PM', value: 85, count: 42 },
      ],
    },
    {
      day: 'Week 2', slots: [
        { label: '9 AM', value: 90, count: 45 },
        { label: '10 AM', value: 86, count: 43 },
        { label: '11 AM', value: 92, count: 46 },
        { label: '12 PM', value: 82, count: 41 },
        { label: '2 PM', value: 80, count: 40 },
      ],
    },
    {
      day: 'Week 3', slots: [
        { label: '9 AM', value: 94, count: 47 },
        { label: '10 AM', value: 84, count: 42 },
        { label: '11 AM', value: 90, count: 45 },
        { label: '12 PM', value: 76, count: 38 },
        { label: '2 PM', value: 88, count: 44 },
      ],
    },
    {
      day: 'Week 4', slots: [
        { label: '9 AM', value: 88, count: 44 },
        { label: '10 AM', value: 82, count: 41 },
        { label: '11 AM', value: 86, count: 43 },
        { label: '12 PM', value: 80, count: 40 },
        { label: '2 PM', value: 84, count: 42 },
      ],
    },
  ],

  topStudents: [
    { id: 'S1', name: 'Arun Sharma', rollNumber: 'CS2022001', percentage: 98.5, total: 200, present: 197 },
    { id: 'S2', name: 'Priya Mehta', rollNumber: 'CS2022002', percentage: 97.0, total: 200, present: 194 },
    { id: 'S3', name: 'Neha Gupta', rollNumber: 'CS2022003', percentage: 96.5, total: 200, present: 193 },
    { id: 'S4', name: 'Rahul Kumar', rollNumber: 'CS2022005', percentage: 95.0, total: 200, present: 190 },
    { id: 'S5', name: 'Ananya Patel', rollNumber: 'CS2022008', percentage: 94.5, total: 200, present: 189 },
  ],

  lowStudents: [
    { id: 'SL1', name: 'Rohit Verma', rollNumber: 'CS2022004', percentage: 65.0, total: 200, present: 130 },
    { id: 'SL2', name: 'Vikram Reddy', rollNumber: 'CS2022007', percentage: 68.5, total: 200, present: 137 },
    { id: 'SL3', name: 'Deepak Yadav', rollNumber: 'CS2022010', percentage: 71.0, total: 200, present: 142 },
    { id: 'SL4', name: 'Kavita Joshi', rollNumber: 'CS2022006', percentage: 73.5, total: 200, present: 147 },
    { id: 'SL5', name: 'Pooja Sharma', rollNumber: 'CS2022011', percentage: 75.0, total: 200, present: 150 },
  ],

  facultyData: [
    { faculty: 'Dr. Rajesh Kumar', percentage: 91.2, total: 800, present: 730 },
    { faculty: 'Prof. Sunita Verma', percentage: 88.7, total: 750, present: 665 },
    { faculty: 'Dr. Anand Gupta', percentage: 85.4, total: 700, present: 598 },
    { faculty: 'Prof. Meena Joshi', percentage: 90.1, total: 720, present: 649 },
    { faculty: 'Dr. Vikram Singh', percentage: 83.9, total: 680, present: 571 },
  ],

  courseData: [
    { course: 'B.Tech CSE', percentage: 92.3, total: 1400, present: 1292 },
    { course: 'B.Tech IT', percentage: 89.7, total: 1100, present: 987 },
    { course: 'MCA', percentage: 88.1, total: 600, present: 529 },
    { course: 'M.Tech', percentage: 86.5, total: 400, present: 346 },
    { course: 'BCA', percentage: 84.8, total: 500, present: 424 },
    { course: 'B.Sc', percentage: 82.3, total: 350, present: 288 },
  ],
}
