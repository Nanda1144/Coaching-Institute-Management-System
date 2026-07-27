export interface AssignedSubject {
  id: string
  subject: string
  course: string
  semester: number
  batch: string
}

export interface TeachingSlot {
  day: string
  time: string
  room: string
}
