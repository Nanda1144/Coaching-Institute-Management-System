import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { attendanceController } from './attendance.controller';
import {
  createAttendanceSchema,
  updateAttendanceSchema,
  attendanceQuerySchema,
  faceRecognitionSchema,
  fingerprintSchema,
  qrSessionSchema,
  qrScanSchema,
  correctionSchema,
} from './attendance.validator';
import { prisma } from '../../config/database';
import {
  createBulkDeleteHandler,
  createBulkUpdateHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.use(authenticate);

router.get('/today', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.getTodayAttendance);
router.get('/stats', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.getAttendanceStats);
router.get('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(attendanceQuerySchema, 'query'), attendanceController.findAll);
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), validate(createAttendanceSchema), attendanceController.create);
router.get('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.findById);
router.patch('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(updateAttendanceSchema), attendanceController.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), attendanceController.delete);

router.post('/bulk-delete', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler(prisma.attendance, 'Attendance'));
router.post('/bulk-update', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler(prisma.attendance, 'Attendance'));
router.post('/import', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler(prisma.attendance, 'Attendance'));
router.get('/export', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler(prisma.attendance, 'Attendance'));

router.post('/face-recognition/session', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), validate(faceRecognitionSchema), attendanceController.createFaceRecognitionSession);
router.patch('/face-recognition/:sessionId/verify', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.verifyFaceRecognition);
router.get('/face-recognition/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.getFaceRecognitionSession);

router.post('/fingerprint/mark', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), validate(fingerprintSchema), attendanceController.markFingerprintAttendance);
router.patch('/fingerprint/:sessionId/verify', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.verifyFingerprint);
router.get('/fingerprint/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.getFingerprintSession);

router.post('/qr/session', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), validate(qrSessionSchema), attendanceController.createQrSession);
router.post('/qr/scan', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), validate(qrScanSchema), attendanceController.scanQr);
router.get('/qr/active', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.getActiveQrSessions);
router.get('/qr/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), attendanceController.getQrSession);

router.post('/corrections', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), validate(correctionSchema), attendanceController.requestCorrection);
router.patch('/corrections/:id/approve', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), attendanceController.approveCorrection);
router.patch('/corrections/:id/reject', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), attendanceController.rejectCorrection);
router.get('/corrections', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), attendanceController.getCorrections);

export default router;
