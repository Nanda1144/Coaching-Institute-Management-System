export interface AnalyticsCards {
  overallPercentage: number
  averageAttendance: number
  highestAttendance: { value: number; department: string }
  lowestAttendance: { value: number; department: string }
}

export interface TrendPoint {
  label: string
  percentage: number
  present: number
  total: number
}

export interface DepartmentData {
  department: string
  percentage: number
  present: number
  total: number
}

export interface MonthlyData {
  month: string
  percentage: number
}

export interface HeatmapDay {
  day: string
  slots: { label: string; value: number; count: number }[]
}

export interface StudentData {
  id: string
  name: string
  rollNumber: string
  percentage: number
  total: number
  present: number
}

export interface FacultyData {
  faculty: string
  percentage: number
  total: number
  present: number
}

export interface CourseData {
  course: string
  percentage: number
  total: number
  present: number
}

export interface AnalyticsFilters {
  department: string
  faculty: string
  semester: string
  course: string
  dateFrom: string
  dateTo: string
}

export interface AnalyticsData {
  cards: AnalyticsCards
  trend: TrendPoint[]
  departmentData: DepartmentData[]
  monthlyData: MonthlyData[]
  heatmap: HeatmapDay[]
  topStudents: StudentData[]
  lowStudents: StudentData[]
  facultyData: FacultyData[]
  courseData: CourseData[]
}
