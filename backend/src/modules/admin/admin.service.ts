import * as db from '../../shared/utils/db';

export const adminService = {
  async listUsers() {
    const users = await db.findMany('faculty', {
      where: [{ column: 'isDeleted', value: false }],
      select: ['id', 'facultyId', 'firstName', 'lastName', 'fullName', 'email', 'role', 'permissions', 'status', 'department', 'designation'],
      orderBy: [{ column: 'createdAt', dir: 'ASC' }],
    });
    return users;
  },

  async updatePermissions(id: string, permissions: string[]) {
    return db.update('faculty', [{ column: 'id', value: id }], { permissions });
  },
};
