import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/utils/api-response';
import { reportService } from './reports.service';
import { exportService } from './export.service';

export const reportController = {
  getAll: asyncHandler(async (_req: IAuthRequest, res: Response) => {
    const data = await reportService.getAllRecent();
    sendSuccess(res, data, 'Reports retrieved successfully');
  }),

  getAttendance: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await reportService.getAttendance(req.query as any);
    sendSuccess(res, data, 'Attendance report generated');
  }),

  getStudents: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await reportService.getStudents(req.query as any);
    sendSuccess(res, data, 'Student report generated');
  }),

  getFaculty: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await reportService.getFaculty(req.query as any);
    sendSuccess(res, data, 'Faculty report generated');
  }),

  getFees: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await reportService.getFees(req.query as any);
    sendSuccess(res, data, 'Fee report generated');
  }),

  getExams: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await reportService.getExams(req.query as any);
    sendSuccess(res, data, 'Exam report generated');
  }),

  getStudentReport: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await reportService.getStudentReport(req.query as any);
    if (!data) {
      sendError(res, 404, 'Student not found');
      return;
    }
    sendSuccess(res, data, 'Student report generated');
  }),

  exportPdf: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { type, ...filters } = req.query as any;
    if (!type) {
      sendError(res, 400, 'Report type is required (attendance, students, faculty, fees, exams)');
      return;
    }

    let data: any;
    const title = `Report: ${type}`;

    switch (type) {
      case 'attendance':
        data = await reportService.getAttendance(filters);
        break;
      case 'students':
        data = await reportService.getStudents(filters);
        break;
      case 'faculty':
        data = await reportService.getFaculty(filters);
        break;
      case 'fees':
        data = await reportService.getFees(filters);
        break;
      case 'exams':
        data = await reportService.getExams(filters);
        break;
      case 'student':
        data = await reportService.getStudentReport(filters);
        if (!data) { sendError(res, 404, 'Student not found'); return; }
        break;
      default:
        sendError(res, 400, `Unknown report type: ${type}`);
        return;
    }

    const pdfBuffer = await exportService.generatePdf(type, title, data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report-${Date.now()}.pdf"`);
    res.send(pdfBuffer);
  }),

  exportExcel: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { type, ...filters } = req.query as any;
    if (!type) {
      sendError(res, 400, 'Report type is required (attendance, students, faculty, fees, exams)');
      return;
    }

    let data: any;

    switch (type) {
      case 'attendance':
        data = await reportService.getAttendance(filters);
        break;
      case 'students':
        data = await reportService.getStudents(filters);
        break;
      case 'faculty':
        data = await reportService.getFaculty(filters);
        break;
      case 'fees':
        data = await reportService.getFees(filters);
        break;
      case 'exams':
        data = await reportService.getExams(filters);
        break;
      case 'student':
        data = await reportService.getStudentReport(filters);
        if (!data) { sendError(res, 404, 'Student not found'); return; }
        break;
      default:
        sendError(res, 400, `Unknown report type: ${type}`);
        return;
    }

    const buffer = await exportService.generateExcel(type, data);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report-${Date.now()}.xlsx"`);
    res.send(buffer);
  }),
};
