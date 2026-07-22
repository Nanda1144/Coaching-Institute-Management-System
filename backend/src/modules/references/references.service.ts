import * as db from '../../shared/utils/db';

async function getDepartments() {
  return db.findMany('departments', {
    where: [{ column: 'isDeleted', value: false }],
    orderBy: [{ column: 'name', dir: 'ASC' }],
  });
}

async function createDepartment(data: { name: string; code: string }) {
  return db.create('departments', {
    name: data.name,
    code: data.code?.toUpperCase(),
  });
}

async function updateDepartment(id: string, data: { name?: string; code?: string }) {
  const payload: any = {};
  if (data.name) payload.name = data.name;
  if (data.code) payload.code = data.code.toUpperCase();
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
