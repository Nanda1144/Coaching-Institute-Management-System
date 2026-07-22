export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HOD: 'HOD',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const Permission = {
  // User/Faculty management
  CREATE_FACULTY: 'create:faculty',
  READ_FACULTY: 'read:faculty',
  UPDATE_FACULTY: 'update:faculty',
  DELETE_FACULTY: 'delete:faculty',

  // Student management
  CREATE_STUDENT: 'create:student',
  READ_STUDENT: 'read:student',
  UPDATE_STUDENT: 'update:student',
  DELETE_STUDENT: 'delete:student',

  // Parent management
  CREATE_PARENT: 'create:parent',
  READ_PARENT: 'read:parent',
  UPDATE_PARENT: 'update:parent',
  DELETE_PARENT: 'delete:parent',

  // Course/Subject/Department
  CREATE_COURSE: 'create:course',
  READ_COURSE: 'read:course',
  UPDATE_COURSE: 'update:course',
  DELETE_COURSE: 'delete:course',

  // Attendance
  CREATE_ATTENDANCE: 'create:attendance',
  READ_ATTENDANCE: 'read:attendance',
  UPDATE_ATTENDANCE: 'update:attendance',
  DELETE_ATTENDANCE: 'delete:attendance',

  // Timetable
  CREATE_TIMETABLE: 'create:timetable',
  READ_TIMETABLE: 'read:timetable',
  UPDATE_TIMETABLE: 'update:timetable',
  DELETE_TIMETABLE: 'delete:timetable',

  // Assignment & Homework
  CREATE_ASSIGNMENT: 'create:assignment',
  READ_ASSIGNMENT: 'read:assignment',
  UPDATE_ASSIGNMENT: 'update:assignment',
  DELETE_ASSIGNMENT: 'delete:assignment',
  CREATE_HOMEWORK: 'create:homework',
  READ_HOMEWORK: 'read:homework',
  UPDATE_HOMEWORK: 'update:homework',
  DELETE_HOMEWORK: 'delete:homework',

  // Submission & Evaluation
  READ_SUBMISSION: 'read:submission',
  GRADE_SUBMISSION: 'grade:submission',
  CREATE_EVALUATION: 'create:evaluation',
  READ_EVALUATION: 'read:evaluation',

  // Exam
  CREATE_EXAM: 'create:exam',
  READ_EXAM: 'read:exam',
  UPDATE_EXAM: 'update:exam',
  DELETE_EXAM: 'delete:exam',

  // Fees
  CREATE_FEE: 'create:fee',
  READ_FEE: 'read:fee',
  UPDATE_FEE: 'update:fee',
  DELETE_FEE: 'delete:fee',

  // Materials
  CREATE_MATERIAL: 'create:material',
  READ_MATERIAL: 'read:material',
  UPDATE_MATERIAL: 'update:material',
  DELETE_MATERIAL: 'delete:material',

  // Notifications
  SEND_NOTIFICATION: 'send:notification',
  READ_NOTIFICATION: 'read:notification',

  // Dashboard & Reports
  READ_DASHBOARD: 'read:dashboard',
  READ_ANALYTICS: 'read:analytics',
  READ_REPORT: 'read:report',

  // Payments
  CREATE_PAYMENT: 'create:payment',
  READ_PAYMENT: 'read:payment',
  UPDATE_PAYMENT: 'update:payment',
  DELETE_PAYMENT: 'delete:payment',
  PROCESS_REFUND: 'process:refund',

  // Certificates
  CREATE_CERTIFICATE: 'create:certificate',
  READ_CERTIFICATE: 'read:certificate',
  UPDATE_CERTIFICATE: 'update:certificate',
  DELETE_CERTIFICATE: 'delete:certificate',

  // Branches
  CREATE_BRANCH: 'create:branch',
  READ_BRANCH: 'read:branch',
  UPDATE_BRANCH: 'update:branch',
  DELETE_BRANCH: 'delete:branch',

  // System
  MANAGE_ROLES: 'manage:roles',
  MANAGE_SETTINGS: 'manage:settings',
} as const;

export type PermissionType = (typeof Permission)[keyof typeof Permission];

export const ROLE_PERMISSIONS: Record<string, string[] | null> = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['*'],
  HOD: ['*'],
  FACULTY: ['*'],
  STUDENT: [
    Permission.READ_DASHBOARD,
    Permission.READ_ATTENDANCE,
    Permission.READ_TIMETABLE,
    Permission.READ_ASSIGNMENT,
    Permission.READ_SUBMISSION,
    Permission.READ_MATERIAL,
    Permission.READ_EXAM,
    Permission.READ_EVALUATION,
    Permission.READ_FEE,
    Permission.READ_NOTIFICATION,
  ],
  PARENT: [
    Permission.READ_DASHBOARD,
    Permission.READ_ATTENDANCE,
    Permission.READ_TIMETABLE,
    Permission.READ_ASSIGNMENT,
    Permission.READ_MATERIAL,
    Permission.READ_EXAM,
    Permission.READ_EVALUATION,
    Permission.READ_FEE,
    Permission.READ_NOTIFICATION,
    Permission.READ_FACULTY,
  ],
};
