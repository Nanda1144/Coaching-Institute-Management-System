export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  HOD: 'HOD',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
