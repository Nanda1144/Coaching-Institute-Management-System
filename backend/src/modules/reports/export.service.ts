import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

function sanitize(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function formatDate(d: any): string {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : dt.toISOString().split('T')[0];
}

export const exportService = {
  async generatePdf(type: string, title: string, data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text(title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated: ${new Date().toISOString()}`, { align: 'right' });
      doc.moveDown();

      const drawTable = (headers: string[], rows: any[][]) => {
        const pageWidth = doc.page.width - 80;
        const colWidth = pageWidth / headers.length;
        const rowHeight = 18;

        let y = doc.y;
        if (y + (rows.length + 1) * rowHeight > doc.page.height - 60) {
          doc.addPage();
          y = doc.y;
        }

        doc.fontSize(9).font('Helvetica-Bold');
        headers.forEach((h, i) => {
          doc.text(h, 40 + i * colWidth, y, { width: colWidth, align: 'left' });
        });
        y += rowHeight;

        doc.font('Helvetica').fontSize(8);
        for (const row of rows) {
          if (y + rowHeight > doc.page.height - 60) {
            doc.addPage();
            y = doc.y;
            doc.font('Helvetica-Bold').fontSize(9);
            headers.forEach((h, i) => {
              doc.text(h, 40 + i * colWidth, y, { width: colWidth, align: 'left' });
            });
            y += rowHeight;
            doc.font('Helvetica').fontSize(8);
          }
          row.forEach((cell, i) => {
            doc.text(sanitize(cell), 40 + i * colWidth, y, { width: colWidth, align: 'left' });
          });
          y += rowHeight;
        }
        doc.moveDown(0.5);
      };

      switch (type) {
        case 'attendance': {
          const s = data.summary || {};
          doc.fontSize(12).text('Summary', { underline: true });
          doc.fontSize(10).text(`Total: ${s.total || 0} | Present: ${s.present || 0} | Absent: ${s.absent || 0} | Late: ${s.late || 0} | Percentage: ${s.percentage || 0}%`);
          doc.moveDown();
          const records = data.records || [];
          if (records.length) {
            drawTable(
              ['Date', 'Student', 'Status'],
              records.map((r: any) => [formatDate(r.attendanceDate), r.studentId, r.attendanceStatus])
            );
          }
          break;
        }
        case 'students': {
          doc.fontSize(12).text('Summary', { underline: true });
          doc.fontSize(10).text(`Total Students: ${data.totalStudents || 0} | Active: ${data.activeStudents || 0}`);
          doc.moveDown();
          const students = data.students || [];
          if (students.length) {
            drawTable(
              ['Name', 'Roll', 'Department', 'Semester', 'Status'],
              students.map((s: any) => [s.fullName || `${s.firstName || ''} ${s.lastName || ''}`, s.rollNumber, s.department, s.semester, s.status])
            );
          }
          break;
        }
        case 'faculty': {
          doc.fontSize(12).text('Summary', { underline: true });
          doc.fontSize(10).text(`Total Faculty: ${data.totalFaculty || 0} | Active: ${data.activeFaculty || 0}`);
          doc.moveDown();
          const faculty = data.faculty || [];
          if (faculty.length) {
            drawTable(
              ['Name', 'Employee ID', 'Department', 'Designation', 'Status'],
              faculty.map((f: any) => [f.fullName || `${f.firstName || ''} ${f.lastName || ''}`, f.employeeId, f.department, f.designation, f.status])
            );
          }
          break;
        }
        case 'fees': {
          const s = data.summary || {};
          doc.fontSize(12).text('Summary', { underline: true });
          doc.fontSize(10).text(`Collected: ${s.totalCollected || 0} | Transactions: ${s.totalTransactions || 0} | Pending: ${s.totalPending || 0}`);
          doc.moveDown();
          const txns = data.transactions || [];
          if (txns.length) {
            drawTable(
              ['Student', 'Roll', 'Amount', 'Date', 'Method', 'Status'],
              txns.map((t: any) => [t.student, t.roll, t.amount, formatDate(t.date), t.method, t.status])
            );
          }
          break;
        }
        case 'exams': {
          const s = data.summary || {};
          doc.fontSize(12).text('Summary', { underline: true });
          doc.fontSize(10).text(`Total: ${s.totalExams || 0} | Scheduled: ${s.scheduled || 0} | Completed: ${s.completed || 0}`);
          doc.moveDown();
          const exams = data.exams || [];
          if (exams.length) {
            drawTable(
              ['Title', 'Subject', 'Batch', 'Date', 'Status'],
              exams.map((e: any) => [e.title, e.subject, e.batch, formatDate(e.date), e.status])
            );
          }
          break;
        }
        case 'student': {
          doc.fontSize(12).text(`Student: ${data.student?.fullName || data.student?.firstName || ''} (${data.student?.rollNumber || data.student?.studentId || ''})`, { underline: true });
          doc.moveDown();
          if (data.attendance) {
            const a = data.attendance;
            doc.fontSize(10).text(`Attendance: ${a.present}/${a.total} (${a.percentage}%)`);
          }
          if (data.assignments) {
            const as = data.assignments;
            doc.fontSize(10).text(`Assignments: ${as.submitted || 0} submitted, ${as.graded || 0} graded`);
          }
          if (data.fees) {
            doc.fontSize(10).text(`Fees Paid: ${data.fees.totalPaid || 0}`);
          }
          break;
        }
        default: {
          doc.fontSize(12).text('Unknown report type');
        }
      }

      doc.end();
    });
  },

  async generateExcel(type: string, data: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'College ERP';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(type.charAt(0).toUpperCase() + type.slice(1));

    const addSummary = (label: string, value: any) => {
      const row = sheet.addRow([label, value]);
      row.getCell(1).font = { bold: true };
    };

    switch (type) {
      case 'attendance': {
        const s = data.summary || {};
        addSummary('Total Records', s.total || 0);
        addSummary('Present', s.present || 0);
        addSummary('Absent', s.absent || 0);
        addSummary('Late', s.late || 0);
        addSummary('Percentage', `${s.percentage || 0}%`);
        sheet.addRow([]);
        sheet.addRow(['Date', 'Student ID', 'Faculty ID', 'Subject ID', 'Batch ID', 'Status', 'Method']);
        sheet.getRow(sheet.rowCount).font = { bold: true };
        (data.records || []).forEach((r: any) => {
          sheet.addRow([formatDate(r.attendanceDate), r.studentId, r.facultyId, r.subjectId, r.batchId, r.attendanceStatus, r.attendanceMethod]);
        });
        break;
      }
      case 'students': {
        addSummary('Total Students', data.totalStudents || 0);
        addSummary('Active Students', data.activeStudents || 0);
        addSummary('Total Batches', data.totalBatches || 0);
        addSummary('Total Courses', data.totalCourses || 0);
        sheet.addRow([]);
        sheet.addRow(['Name', 'Roll Number', 'Department', 'Course', 'Semester', 'Batch', 'Status', 'Attendance %']);
        sheet.getRow(sheet.rowCount).font = { bold: true };
        (data.students || []).forEach((s: any) => {
          sheet.addRow([
            s.fullName || `${s.firstName || ''} ${s.lastName || ''}`,
            s.rollNumber,
            s.department,
            s.course,
            s.semester,
            s.batch,
            s.status,
            s.attendanceStats?.percentage ?? '',
          ]);
        });
        break;
      }
      case 'faculty': {
        addSummary('Total Faculty', data.totalFaculty || 0);
        addSummary('Active Faculty', data.activeFaculty || 0);
        sheet.addRow([]);
        sheet.addRow(['Name', 'Employee ID', 'Department', 'Designation', 'Status', 'Email', 'Phone']);
        sheet.getRow(sheet.rowCount).font = { bold: true };
        (data.faculty || []).forEach((f: any) => {
          sheet.addRow([
            f.fullName || `${f.firstName || ''} ${f.lastName || ''}`,
            f.employeeId,
            f.department,
            f.designation,
            f.status,
            f.email,
            f.phone,
          ]);
        });
        break;
      }
      case 'fees': {
        const s = data.summary || {};
        addSummary('Total Collected', s.totalCollected || 0);
        addSummary('Total Transactions', s.totalTransactions || 0);
        addSummary('Total Pending', s.totalPending || 0);
        addSummary('Pending Count', s.pendingCount || 0);
        sheet.addRow([]);
        sheet.addRow(['Student', 'Roll', 'Amount', 'Date', 'Method', 'Status']);
        sheet.getRow(sheet.rowCount).font = { bold: true };
        (data.transactions || []).forEach((t: any) => {
          sheet.addRow([t.student, t.roll, t.amount, formatDate(t.date), t.method, t.status]);
        });
        break;
      }
      case 'exams': {
        const s = data.summary || {};
        addSummary('Total Exams', s.totalExams || 0);
        addSummary('Scheduled', s.scheduled || 0);
        addSummary('Completed', s.completed || 0);
        addSummary('Cancelled', s.cancelled || 0);
        sheet.addRow([]);
        sheet.addRow(['Title', 'Subject', 'Batch', 'Date', 'Status', 'Type', 'Max Marks']);
        sheet.getRow(sheet.rowCount).font = { bold: true };
        (data.exams || []).forEach((e: any) => {
          sheet.addRow([e.title, e.subject, e.batch, formatDate(e.date), e.status, e.type, e.maxMarks]);
        });
        break;
      }
      case 'student': {
        addSummary('Student', data.student?.fullName || data.student?.firstName || '');
        addSummary('Roll', data.student?.rollNumber || data.student?.studentId || '');
        addSummary('Department', data.student?.department || '');
        addSummary('Course', data.student?.course || '');
        addSummary('Semester', data.student?.semester || '');
        sheet.addRow([]);
        if (data.attendance) {
          const a = data.attendance;
          addSummary('Attendance Present', `${a.present}/${a.total} (${a.percentage}%)`);
          sheet.addRow([]);
          sheet.addRow(['Date', 'Status', 'Subject', 'Method']);
          sheet.getRow(sheet.rowCount).font = { bold: true };
          (a.records || []).forEach((r: any) => {
            sheet.addRow([formatDate(r.attendanceDate), r.attendanceStatus, r.subjectId, r.attendanceMethod]);
          });
        }
        sheet.addRow([]);
        if (data.assignments) {
          addSummary('Assignments Submitted', data.assignments.submitted || 0);
          addSummary('Assignments Graded', data.assignments.graded || 0);
          sheet.addRow([]);
          sheet.addRow(['Assignment', 'Status', 'Date', 'Marks', 'Grade']);
          sheet.getRow(sheet.rowCount).font = { bold: true };
          (data.assignments.submissions || []).forEach((sub: any) => {
            sheet.addRow([sub.assignmentId, sub.status, formatDate(sub.submissionDate), sub.marksObtained ?? '', sub.grade ?? '']);
          });
        }
        sheet.addRow([]);
        if (data.fees) {
          addSummary('Fees Total Paid', data.fees.totalPaid || 0);
          sheet.addRow([]);
          sheet.addRow(['Description', 'Amount', 'Date', 'Method', 'Status']);
          sheet.getRow(sheet.rowCount).font = { bold: true };
          (data.fees.transactions || []).forEach((t: any) => {
            sheet.addRow([t.description, t.amount, formatDate(t.date), t.method, t.status]);
          });
        }
        break;
      }
    }

    sheet.columns.forEach((col: any) => {
      if (col.values) {
        const maxLen = Math.max(...col.values.map((v: any) => String(v || '').length));
        col.width = Math.min(Math.max(maxLen + 2, 10), 50);
      } else {
        col.width = 15;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  },
};
