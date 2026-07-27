export type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface ReportFilters {
  department: string
  course: string
  batch: string
  dateFrom: string
  dateTo: string
  reportType: ReportType
}

export interface StatCardData {
  label: string
  value: number
  change: number
  period: string
}

export interface TrendPoint {
  label: string
  present: number
  absent: number
  late: number
  leave: number
}

export interface DepartmentComparison {
  department: string
  present: number
  total: number
  percentage: number
}

export interface SummaryStats {
  present: number
  absent: number
  late: number
  leave: number
  total: number
  percentage: number
}

export interface ReportData {
  stats: StatCardData[]
  trends: TrendPoint[]
  departmentData: DepartmentComparison[]
  summary: SummaryStats
}
