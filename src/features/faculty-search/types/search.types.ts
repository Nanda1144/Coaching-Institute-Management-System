export interface FacultySearchResult {
  id: string
  photo: string
  name: string
  department: string
  branch: string
  qualification: string
  experience: number
  status: string
  designation: string
  gender: string
  email: string
  phone: string
}

export interface SearchFilters {
  facultyName: string
  facultyId: string
  department: string
  branch: string
  qualification: string
  experience: string
  status: string
  designation: string
  gender: string
}
