import { Response } from 'express';
import crypto from 'crypto';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { attendanceService } from './attendance.service';
import { faceRecognitionService } from './face-recognition.service';
import { studentFaceService } from './student-face.service';
import { fingerprintAttendanceService } from './fingerprint-attendance.service';
import { qrAttendanceService } from './qr-attendance.service';
import { correctionService } from './correction.service';
import * as db from '../../shared/utils/db';

export const attendanceController = {
  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const attendance = await attendanceService.create(req.body, req.user!.id);
    sendCreated(res, attendance, 'Attendance marked successfully');
  }),

  findAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await attendanceService.findAll(req.query);
    sendSuccess(res, result, 'Attendance records fetched successfully');
  }),

  findById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const attendance = await attendanceService.findById(req.params.id);
    sendSuccess(res, attendance, 'Attendance record fetched successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const attendance = await attendanceService.update(req.params.id, req.body, req.user!.id);
    sendSuccess(res, attendance, 'Attendance record updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await attendanceService.delete(req.params.id, req.user!.id);
    sendSuccess(res, null, 'Attendance record deleted successfully');
  }),

  getTodayAttendance: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await attendanceService.getTodayAttendance(
      req.user!.facultyId!,
      req.query.date as string | undefined
    );
    sendSuccess(res, result, 'Today\'s attendance fetched successfully');
  }),

  getAttendanceStats: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await attendanceService.getAttendanceStats(req.user!.facultyId!, {
      subjectId: req.query.subjectId as string | undefined,
      month: req.query.month ? Number(req.query.month) : undefined,
      year: req.query.year ? Number(req.query.year) : undefined,
    });
    sendSuccess(res, result, 'Attendance statistics fetched successfully');
  }),

  createFaceRecognitionSession: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const sessionId = crypto.randomUUID();
    const student = await db.findUnique('students', [{ column: 'id', value: req.body.studentId }], ['id', 'full_name', 'roll_number', 'department', 'batch', 'profile_image']);
    const session = await faceRecognitionService.createSession({
      sessionId,
      studentId: req.body.studentId,
      confidence: req.body.confidence ?? 0,
      imageUrl: req.body.imageUrl,
      deviceId: req.body.deviceId,
      metadata: req.body.metadata,
    }, req.user!.id);
    sendCreated(res, { ...session, student }, 'Face recognition session created');
  }),

  verifyFaceRecognition: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { studentId, confidence } = req.body;
    const result = await faceRecognitionService.verifyRecognition(
      req.params.sessionId, studentId, confidence ?? 0.95, req.user!.id
    );
    sendSuccess(res, result, 'Face recognition verified');
  }),

  getFaceRecognitionSession: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const session = await faceRecognitionService.getSession(req.params.id);
    sendSuccess(res, session, 'Face recognition session fetched');
  }),

  scanFaceAndMarkAttendance: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await faceRecognitionService.scanAndMarkAttendance({
      faceImage: req.body.faceImage,
      confidence: req.body.confidence,
      deviceId: req.body.deviceId,
      metadata: req.body.metadata,
    }, req.user!.id);
    sendCreated(res, result, 'Attendance marked via face recognition');
  }),

  enrollStudentFace: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const enrolled = await studentFaceService.enroll({
      studentId: req.body.studentId,
      faceImage: req.body.faceImage,
      metadata: req.body.metadata,
    }, req.user!.id);
    sendSuccess(res, enrolled, 'Student face enrolled');
  }),

  getEnrolledFaces: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const enrolled = await studentFaceService.getEnrolledStudents();
    sendSuccess(res, enrolled, 'Enrolled faces fetched');
  }),

  unenrollStudentFace: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await studentFaceService.unenroll(req.params.studentId);
    sendSuccess(res, result, 'Student face unenrolled');
  }),

  markFingerprintAttendance: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const record = await fingerprintAttendanceService.markAttendance(req.body, req.user!.id);
    sendCreated(res, record, 'Fingerprint attendance marked');
  }),

  verifyFingerprint: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { fingerprintId, status } = req.body;
    const result = await fingerprintAttendanceService.verifyFingerprint(
      req.params.sessionId, fingerprintId, status, req.user!.id
    );
    sendSuccess(res, result, 'Fingerprint verified');
  }),

  getFingerprintSession: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const session = await fingerprintAttendanceService.getSession(req.params.id);
    sendSuccess(res, session, 'Fingerprint session fetched');
  }),

  createQrSession: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const duration = req.body.duration ?? 900;
    const now = new Date();
    const end = new Date(now.getTime() + duration * 1000);
    const batch = await db.findFirst('batches', { where: [{ column: 'status', value: 'active' }], select: ['id'] });
    const subject = await db.findFirst('subjects', { select: ['id'] });
    if (!batch || !subject) {
      throw AppError.badRequest('No active batch or subject found. Please set up batches and subjects first.');
    }
    let classroomId = req.body.classroomId;
    if (!classroomId) {
      const classroom = await db.findFirst('classrooms', { select: ['id'], where: [] });
      if (classroom) classroomId = classroom.id;
    }
    if (!classroomId) {
      throw AppError.badRequest('No classroom found. Please create a classroom first or provide a classroomId.');
    }
    const session = await qrAttendanceService.createSession({
      subjectId: subject.id,
      batchId: batch.id,
      classroomId,
      startTime: now.toISOString(),
      endTime: end.toISOString(),
    }, req.user!.id);
    sendCreated(res, session, 'QR session created');
  }),

  scanQr: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const scan = await qrAttendanceService.scanQR(req.body, req.user!.id);
    sendSuccess(res, scan, 'QR scanned successfully');
  }),

  getActiveQrSessions: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const sessions = await qrAttendanceService.getActiveSessions(req.user!.facultyId!);
    sendSuccess(res, sessions, 'Active QR sessions fetched');
  }),

  getQrSession: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const session = await qrAttendanceService.getSession(req.params.id);
    sendSuccess(res, session, 'QR session fetched');
  }),

  requestCorrection: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const correction = await correctionService.requestCorrection(req.body, req.user!.id);
    sendCreated(res, correction, 'Correction request submitted');
  }),

  approveCorrection: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const correction = await correctionService.approveCorrection(req.params.id, req.user!.id);
    sendSuccess(res, correction, 'Correction approved');
  }),

  rejectCorrection: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const correction = await correctionService.rejectCorrection(req.params.id, req.user!.id);
    sendSuccess(res, correction, 'Correction rejected');
  }),

  getCorrections: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await correctionService.getCorrections(req.query as any);
    sendSuccess(res, result, 'Correction requests fetched successfully');
  }),
};
