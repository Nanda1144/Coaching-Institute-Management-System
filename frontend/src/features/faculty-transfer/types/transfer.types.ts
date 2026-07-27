export interface TransferRequest {
  facultyId: string
  facultyName: string
  currentBranch: string
  currentDepartment: string
  newBranch: string
  newDepartment: string
  transferDate: string
  reason: string
}

export interface TransferRecord {
  id: string
  facultyName: string
  oldBranch: string
  newBranch: string
  date: string
  status: 'Completed' | 'Pending' | 'Approved' | 'Rejected'
}
