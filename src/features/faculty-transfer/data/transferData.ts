export const facultyTransferList = [
  { id: 'FAC-001', name: 'Dr. Rajesh Kumar', branch: 'Main Campus', department: 'Computer Science' },
  { id: 'FAC-002', name: 'Prof. Sunita Sharma', branch: 'Main Campus', department: 'Mathematics' },
  { id: 'FAC-003', name: 'Dr. Amit Verma', branch: 'Science Block', department: 'Physics' },
  { id: 'FAC-004', name: 'Prof. Priya Patel', branch: 'Main Campus', department: 'Computer Science' },
  { id: 'FAC-006', name: 'Prof. Anjali Gupta', branch: 'Science Block', department: 'Chemistry' },
  { id: 'FAC-007', name: 'Dr. Suresh Reddy', branch: 'Main Campus', department: 'Mathematics' },
  { id: 'FAC-010', name: 'Prof. Deepa Krishnan', branch: 'Main Campus', department: 'Computer Science' },
  { id: 'FAC-011', name: 'Dr. Manoj Tiwari', branch: 'Engineering Block', department: 'Mechanical' },
  { id: 'FAC-013', name: 'Dr. Karan Mehta', branch: 'Management Block', department: 'Business Administration' },
  { id: 'FAC-015', name: 'Dr. Pradeep Jain', branch: 'Engineering Block', department: 'Civil' },
  { id: 'FAC-019', name: 'Dr. Akash Dave', branch: 'Engineering Block', department: 'Mechanical' },
  { id: 'FAC-022', name: 'Prof. Nidhi Kapoor', branch: 'Arts Block', department: 'English' },
]

export const branchOptions = [
  'Main Campus', 'Science Block', 'Engineering Block', 'Arts Block', 'Management Block',
]

export const departmentOptions = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics',
  'Mechanical', 'Civil', 'English', 'Biotechnology', 'Business Administration',
]

export const transferHistoryData = [
  { id: 'TRF-001', facultyName: 'Dr. Suresh Reddy', oldBranch: 'Engineering Block', newBranch: 'Main Campus', date: '2024-08-15', status: 'Completed' as const },
  { id: 'TRF-002', facultyName: 'Prof. Priya Patel', oldBranch: 'Science Block', newBranch: 'Main Campus', date: '2024-06-10', status: 'Completed' as const },
  { id: 'TRF-003', facultyName: 'Dr. Manoj Tiwari', oldBranch: 'Main Campus', newBranch: 'Engineering Block', date: '2025-01-20', status: 'Approved' as const },
  { id: 'TRF-004', facultyName: 'Prof. Nidhi Kapoor', oldBranch: 'Main Campus', newBranch: 'Arts Block', date: '2025-03-05', status: 'Pending' as const },
  { id: 'TRF-005', facultyName: 'Dr. Karan Mehta', oldBranch: 'Main Campus', newBranch: 'Management Block', date: '2024-11-01', status: 'Rejected' as const },
  { id: 'TRF-006', facultyName: 'Dr. Amit Verma', oldBranch: 'Main Campus', newBranch: 'Science Block', date: '2025-02-14', status: 'Completed' as const },
]
