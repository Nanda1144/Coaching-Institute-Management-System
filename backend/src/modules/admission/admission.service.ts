import { query } from '../../config/database';
import * as db from '../../shared/utils/db';

interface EligibilityResult {
  eligible: boolean;
  rules: { rule: string; passed: boolean; message: string }[];
}

export const admissionService = {
  async getAll(params: any) {
    const { page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    const conditions: any[] = [];
    if (status) conditions.push({ column: 'status', value: status });
    if (search) conditions.push({ column: 'fullName', value: search, operator: 'ILIKE' });
    const records = await db.findMany('students', {
      where: conditions,
      orderBy: [{ column: sortBy, dir: sortOrder }],
      offset: (page - 1) * limit,
      limit,
    });
    const total = await db.count('students', conditions);
    return { data: records, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    return db.findUnique('students', [{ column: 'id', value: id }]);
  },

  async create(data: any) {
    const fullName = `${data.firstName} ${data.lastName}`;
    return db.create('students', {
      studentId: data.admissionNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      email: data.email,
      phone: data.mobileNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      department: data.department || '',
      course: data.course || '',
      semester: data.semester || 1,
      batch: data.batch || '',
      batchId: data.batchId,
      rollNumber: data.admissionNumber,
      status: data.status || 'active',
      address: data.address || {},
      ...(data.qualification ? { qualification: data.qualification } : {}),
    });
  },

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.firstName || data.lastName) {
      const existing = await db.findUnique('students', [{ column: 'id', value: id }]);
      updateData.fullName = `${data.firstName || existing?.firstName} ${data.lastName || existing?.lastName}`;
    }
    if (data.mobileNumber) updateData.phone = data.mobileNumber;
    if (data.admissionNumber) updateData.studentId = data.admissionNumber;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    delete updateData.mobileNumber;
    delete updateData.admissionNumber;
    delete updateData.dateOfBirth;
    return db.update('students', [{ column: 'id', value: id }], updateData);
  },

  async delete(id: string) {
    return db.remove('students', [{ column: 'id', value: id }], false);
  },

  async checkEligibility(courseId: string, dateOfBirth?: string, qualification?: string): Promise<EligibilityResult> {
    const rules: EligibilityResult['rules'] = [];

    const courseResult = await query(`SELECT * FROM courses WHERE id = $1`, [courseId]);
    const course = courseResult.rows[0];
    if (!course) throw new Error('Course not found');

    rules.push({ rule: 'course_availability', passed: course.is_active, message: course.is_active ? 'Course is available' : 'Course is currently not available' });

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (course.min_age) {
        rules.push({ rule: 'min_age', passed: age >= course.min_age, message: age >= course.min_age ? `Age ${age} meets minimum ${course.min_age}` : `Minimum age requirement is ${course.min_age} years` });
      }
      if (course.max_age) {
        rules.push({ rule: 'max_age', passed: age <= course.max_age, message: age <= course.max_age ? `Age ${age} within maximum ${course.max_age}` : `Maximum age is ${course.max_age} years` });
      }
    }

    if (course.required_qualification) {
      const qual = (qualification || '').toLowerCase();
      const required = course.required_qualification.toLowerCase();
      rules.push({ rule: 'qualification', passed: qual.includes(required), message: qual.includes(required) ? 'Qualification requirement met' : `Required qualification: ${course.required_qualification}` });
    }

    const prereqs = await query(`SELECT pc.course_code, pc.course_name FROM course_prerequisites cp JOIN courses pc ON pc.id = cp.prerequisite_course_id WHERE cp.course_id = $1`, [courseId]);
    if (prereqs.rows.length > 0) {
      rules.push({ rule: 'prerequisites', passed: false, message: `${prereqs.rows.length} prerequisite(s) required. Use enrollment endpoint for full verification.` });
    }

    return { eligible: rules.every((r) => r.passed), rules };
  },

  async enroll(data: any) {
    const courseResult = await query(`SELECT * FROM courses WHERE id = $1`, [data.courseId]);
    const course = courseResult.rows[0];
    if (!course) throw new Error('Course not found');
    if (!course.is_active) throw new Error('Course is not active');

    const eligibility = await this.checkEligibility(data.courseId, data.dateOfBirth, data.qualification);
    if (!eligibility.eligible) {
      throw new Error(`Enrollment failed: ${eligibility.rules.filter((r) => !r.passed).map((r) => r.message).join('; ')}`);
    }

    const fullName = `${data.firstName} ${data.lastName}`;
    return db.create('students', {
      studentId: data.admissionNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      email: data.email,
      phone: data.mobileNumber,
      dateOfBirth: new Date(data.dateOfBirth),
      department: course.name || '',
      course: course.name,
      semester: 1,
      batch: data.batch || '',
      batchId: data.batchId,
      rollNumber: data.admissionNumber,
      qualification: data.qualification,
      status: 'active',
      address: {},
    });
  },

  async getBatchCapacity(batchId: string) {
    const result = await query(`SELECT id, batch_name as "batchName", capacity, current_strength as "currentStrength", status FROM batches WHERE id = $1`, [batchId]);
    const batch = result.rows[0];
    if (!batch) throw new Error('Batch not found');
    return {
      batchId: batch.id,
      batchName: batch.batchName,
      capacity: batch.capacity,
      currentStrength: batch.currentStrength,
      availableSeats: batch.capacity ? batch.capacity - (batch.currentStrength || 0) : null,
      isFull: batch.capacity ? (batch.currentStrength || 0) >= batch.capacity : false,
      status: batch.status,
    };
  },

  async enrollInBatch(batchId: string, data: any) {
    const batchResult = await query(`SELECT * FROM batches WHERE id = $1 FOR UPDATE`, [batchId]);
    const batch = batchResult.rows[0];
    if (!batch) throw new Error('Batch not found');
    if (batch.status !== 'active') throw new Error('Batch is not active');
    if (batch.capacity && (batch.current_strength || 0) >= batch.capacity) throw new Error('Batch is full');

    const dupCheck = await query(`SELECT id FROM students WHERE first_name ILIKE $1 AND last_name ILIKE $2 AND batch_id = $3 AND is_deleted = false`, [data.firstName, data.lastName, batchId]);
    if (dupCheck.rows.length > 0) throw new Error('Student already enrolled in this batch');

    await query(`UPDATE batches SET current_strength = current_strength + 1, updated_at = NOW() WHERE id = $1`, [batchId]);

    const fullName = `${data.firstName} ${data.lastName}`;
    const student = await db.create('students', {
      studentId: data.admissionNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      email: data.email,
      phone: data.mobileNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      department: batch.department || '',
      course: batch.course || '',
      semester: batch.semester || 1,
      batch: batch.batchName,
      batchId,
      rollNumber: data.admissionNumber,
      status: 'active',
      address: {},
    });

    return { student, batch: await this.getBatchCapacity(batchId) };
  },
};
