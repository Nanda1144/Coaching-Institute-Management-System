import type { CorrectionRequest, CorrectionFilters } from '../types/attendanceCorrection.types'

export const initialFilters: CorrectionFilters = {
  search: '',
  department: '',
  status: '',
  date: '',
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
  statuses: [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ],
  subjects: [
    'Data Structures',
    'DBMS',
    'Computer Networks',
    'Operating Systems',
    'Software Engineering',
    'Machine Learning',
  ],
}

export const attendanceStatuses = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'leave', label: 'Leave' },
]

export const dummyRequests: CorrectionRequest[] = [
  { id: 'CR-001', studentName: 'Arun Sharma', rollNumber: 'CS2022001', department: 'Computer Science', subject: 'Data Structures', attendanceDate: '2026-07-10', currentStatus: 'absent', requestedStatus: 'present', reason: 'Was present but marked absent due to system error', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-11T09:15:00' },
  { id: 'CR-002', studentName: 'Priya Mehta', rollNumber: 'CS2022002', department: 'Computer Science', subject: 'DBMS', attendanceDate: '2026-07-09', currentStatus: 'late', requestedStatus: 'present', reason: 'Arrived on time but late mark was applied by mistake', attachment: 'late_chit.pdf', approvalStatus: 'pending', createdAt: '2026-07-10T10:30:00' },
  { id: 'CR-003', studentName: 'Rohit Verma', rollNumber: 'CS2022004', department: 'Information Technology', subject: 'Computer Networks', attendanceDate: '2026-07-08', currentStatus: 'absent', requestedStatus: 'leave', reason: 'Had a medical emergency, attaching doctor note', attachment: 'medical_cert.pdf', approvalStatus: 'approved', createdAt: '2026-07-08T14:00:00', reviewedBy: 'Dr. Rajesh Kumar', reviewedAt: '2026-07-09T09:00:00', remarks: 'Approved with medical certificate' },
  { id: 'CR-004', studentName: 'Sneha Kapoor', rollNumber: 'IT2022003', department: 'Information Technology', subject: 'Operating Systems', attendanceDate: '2026-07-07', currentStatus: 'absent', requestedStatus: 'present', reason: 'Attended the class but biometric did not register', attachment: null, approvalStatus: 'rejected', createdAt: '2026-07-07T16:00:00', reviewedBy: 'Prof. Sunita Verma', reviewedAt: '2026-07-08T11:00:00', remarks: 'No proof of attendance provided' },
  { id: 'CR-005', studentName: 'Amit Singh', rollNumber: 'CS2022005', department: 'Computer Science', subject: 'Software Engineering', attendanceDate: '2026-07-06', currentStatus: 'absent', requestedStatus: 'present', reason: 'Was present, faculty can confirm', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-06T15:30:00' },
  { id: 'CR-006', studentName: 'Kavita Joshi', rollNumber: 'EC2022001', department: 'Electronics', subject: 'Machine Learning', attendanceDate: '2026-07-05', currentStatus: 'absent', requestedStatus: 'leave', reason: 'Participated in inter-college competition', attachment: 'competition_letter.pdf', approvalStatus: 'approved', createdAt: '2026-07-05T12:00:00', reviewedBy: 'Dr. Anand Gupta', reviewedAt: '2026-07-06T10:00:00', remarks: 'Approved - event participation' },
  { id: 'CR-007', studentName: 'Vikram Reddy', rollNumber: 'CS2022007', department: 'Computer Science', subject: 'DBMS', attendanceDate: '2026-07-04', currentStatus: 'absent', requestedStatus: 'present', reason: 'Fingerprint scanner was down that day', attachment: null, approvalStatus: 'pending', createdAt: '2026-07-04T17:00:00' },
  { id: 'CR-008', studentName: 'Neha Gupta', rollNumber: 'IT2022004', department: 'Information Technology', subject: 'Computer Networks', attendanceDate: '2026-07-03', currentStatus: 'late', requestedStatus: 'present', reason: 'Bus arrived late due to traffic, was only 5 mins late', attachment: null, approvalStatus: 'rejected', createdAt: '2026-07-03T18:00:00', reviewedBy: 'Prof. Meena Joshi', reviewedAt: '2026-07-04T08:00:00', remarks: 'Late by more than 15 mins, policy does not allow correction' },
  { id: 'CR-009', studentName: 'Rahul Kumar', rollNumber: 'CS2022008', department: 'Computer Science', subject: 'Data Structures', attendanceDate: '2026-07-02', currentStatus: 'absent', requestedStatus: 'present', reason: 'Marked absent by mistake in the system', attachment: null, approvalStatus: 'approved', createdAt: '2026-07-02T14:00:00', reviewedBy: 'Dr. Rajesh Kumar', reviewedAt: '2026-07-03T09:30:00', remarks: 'System error confirmed' },
  { id: 'CR-010', studentName: 'Ananya Patel', rollNumber: 'EC2022003', department: 'Electronics', subject: 'Digital Logic', attendanceDate: '2026-07-01', currentStatus: 'absent', requestedStatus: 'leave', reason: 'Was unwell, have medical prescription', attachment: 'prescription.jpg', approvalStatus: 'pending', createdAt: '2026-07-01T19:00:00' },
  { id: 'CR-011', studentName: 'Deepak Yadav', rollNumber: 'ME2022001', department: 'Mechanical', subject: 'Thermodynamics', attendanceDate: '2026-06-30', currentStatus: 'absent', requestedStatus: 'present', reason: 'Was present for the lecture', attachment: null, approvalStatus: 'rejected', createdAt: '2026-06-30T16:30:00', reviewedBy: 'Dr. Vikram Singh', reviewedAt: '2026-07-01T10:00:00', remarks: 'No faculty confirmation received' },
  { id: 'CR-012', studentName: 'Pooja Sharma', rollNumber: 'CE2022001', department: 'Civil', subject: 'Structural Analysis', attendanceDate: '2026-06-29', currentStatus: 'absent', requestedStatus: 'present', reason: 'Attended the guest lecture, attendance was not marked', attachment: 'guest_lecture_form.pdf', approvalStatus: 'approved', createdAt: '2026-06-29T13:00:00', reviewedBy: 'Prof. Sunita Verma', reviewedAt: '2026-06-30T09:00:00', remarks: 'Guest lecture attendance verified' },
]

export const formInitialData: import('../types/attendanceCorrection.types').RequestFormData = {
  studentName: '',
  rollNumber: '',
  department: '',
  subject: '',
  attendanceDate: '',
  currentStatus: 'present',
  requestedStatus: 'present',
  reason: '',
  attachment: null,
}
