import * as db from '../../shared/utils/db';
import { query } from '../../config/database';

async function getDepartments() {
  const depts = await db.findMany('departments', {
    where: [{ column: 'isDeleted', value: false }],
    orderBy: [{ column: 'name', dir: 'ASC' }],
  });
  const facultyCounts = await query(`SELECT department, COUNT(*)::int AS count FROM faculty WHERE is_deleted = false GROUP BY department`);
  const studentCounts = await query(`SELECT department, COUNT(*)::int AS count FROM students WHERE is_deleted = false GROUP BY department`);
  const fcMap: Record<string, number> = {};
  const scMap: Record<string, number> = {};
  for (const r of facultyCounts.rows) fcMap[r.department] = r.count;
  for (const r of studentCounts.rows) scMap[r.department] = r.count;
  return depts.map((d: any) => ({
    ...d,
    facultyCount: fcMap[d.name] ?? 0,
    studentCount: scMap[d.name] ?? 0,
  }));
}

async function createDepartment(data: { name: string; code: string; logo?: string }) {
  return db.create('departments', {
    name: data.name,
    code: data.code?.toUpperCase(),
    logo: data.logo ?? null,
  });
}

async function updateDepartment(id: string, data: { name?: string; code?: string; logo?: string }) {
  const payload: any = {};
  if (data.name) payload.name = data.name;
  if (data.code) payload.code = data.code.toUpperCase();
  if (data.logo !== undefined) payload.logo = data.logo;
  return db.update('departments', [{ column: 'id', value: id }], payload);
}

async function deleteDepartment(id: string) {
  return db.remove('departments', [{ column: 'id', value: id }]);
}

async function getCourses(department?: string) {
  const where: any[] = [{ column: 'isDeleted', value: false }];
  if (department) {
    where.push({ column: 'name', operator: 'ILIKE', value: department });
  }
  return db.findMany('courses', {
    where,
    orderBy: [{ column: 'name', dir: 'ASC' }],
  });
}

async function createCourse(data: { name: string; code: string; duration?: number }) {
  return db.create('courses', {
    name: data.name,
    code: data.code?.toUpperCase(),
    duration: data.duration ?? null,
  });
}

async function updateCourse(id: string, data: { name?: string; code?: string; duration?: number }) {
  const payload: any = {};
  if (data.name) payload.name = data.name;
  if (data.code) payload.code = data.code.toUpperCase();
  if (data.duration !== undefined) payload.duration = data.duration;
  return db.update('courses', [{ column: 'id', value: id }], payload);
}

async function deleteCourse(id: string) {
  return db.remove('courses', [{ column: 'id', value: id }]);
}

async function getBatches(department?: string, course?: string, semester?: number) {
  const where: any[] = [{ column: 'isDeleted', value: false }];
  if (department) where.push({ column: 'department', value: department });
  if (course) where.push({ column: 'course', value: course });
  if (semester) where.push({ column: 'semester', value: semester });
  return db.findMany('batches', {
    where,
    orderBy: [{ column: 'batchName', dir: 'ASC' }],
  });
}

async function getFaculty(department?: string) {
  const where: any[] = [{ column: 'isDeleted', value: false }];
  if (department) where.push({ column: 'department', value: department });
  return db.findMany('faculty', {
    where,
    orderBy: [{ column: 'fullName', dir: 'ASC' }],
  });
}

export const referencesService = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getBatches,
  getFaculty,
};
