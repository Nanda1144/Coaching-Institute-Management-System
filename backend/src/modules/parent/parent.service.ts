import { query } from '../../config/database';
import * as db from '../../shared/utils/db';

export const parentService = {
  async getAll(params?: Record<string, unknown>) {
    const where: any[] = [{ column: 'isDeleted', value: false }];
    if (params?.search) {
      const s = String(params.search);
      where.push({ operator: 'OR', conditions: [
        { column: 'fullName', operator: 'ILIKE', value: s },
        { column: 'email', operator: 'ILIKE', value: s },
        { column: 'phone', operator: 'ILIKE', value: s },
      ]});
    }
    return db.findMany('parents', { where, orderBy: [{ column: 'createdAt', dir: 'DESC' }] });
  },

  async getById(id: string) {
    return db.findUnique('parents', [{ column: 'id', value: id }]);
  },

  async create(data: Record<string, unknown>) {
    return db.create('parents', data);
  },

  async update(id: string, data: Record<string, unknown>) {
    return db.update('parents', [{ column: 'id', value: id }], data);
  },

  async delete(id: string) {
    return db.remove('parents', [{ column: 'id', value: id }], false);
  },

  // =========== Parent-Student Linking ===========
  async getLinkedStudents(parentId: string) {
    const result = await query(
      `SELECT s.id, s.student_id, s.full_name, s.email, s.phone, s.roll_number, s.department, s.course, s.batch, s.status, ps.relationship
       FROM parent_students ps JOIN students s ON s.id = ps.student_id
       WHERE ps.parent_id = $1`,
      [parentId]
    );
    return result.rows;
  },

  async linkStudent(parentId: string, studentId: string, relationship?: string) {
    return query(
      `INSERT INTO parent_students (parent_id, student_id, relationship) VALUES ($1, $2, $3) RETURNING *`,
      [parentId, studentId, relationship || null]
    );
  },

  async unlinkStudent(parentId: string, studentId: string) {
    return query(
      `DELETE FROM parent_students WHERE parent_id = $1 AND student_id = $2`,
      [parentId, studentId]
    );
  },

  async getParentsByStudent(studentId: string) {
    const result = await query(
      `SELECT p.id, p.full_name, p.email, p.phone, p.relationship, p.status, ps.relationship as link_relationship
       FROM parent_students ps JOIN parents p ON p.id = ps.parent_id
       WHERE ps.student_id = $1`,
      [studentId]
    );
    return result.rows;
  },

  // =========== Notification Preferences ===========
  async updateNotificationPrefs(id: string, prefs: Record<string, unknown>) {
    return db.update('parents', [{ column: 'id', value: id }], { notificationPrefs: JSON.stringify(prefs) });
  },

  // =========== Dashboard ===========
  async getDashboard(parentId: string) {
    const parent = await this.getById(parentId);
    if (!parent) return null;
    const students = await this.getLinkedStudents(parentId);
    return { parent, students };
  },
};
