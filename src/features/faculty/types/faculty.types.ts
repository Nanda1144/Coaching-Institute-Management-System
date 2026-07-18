export interface Faculty {
  id: string
  photo: string
  name: string
  department: string
  designation: string
  qualification: string
  email: string
  phone: string
  status: 'Active' | 'Inactive' | 'On Leave'
  joiningDate: string
  branch: string
  experience: number
  gender: string
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: keyof Faculty
  direction: SortDirection
}

export interface FilterConfig {
  department: string
  branch: string
  status: string
  experience: string
  search: string
}
