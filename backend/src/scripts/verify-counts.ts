import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const counts = {
    departments: await prisma.department.count(),
    courses: await prisma.course.count(),
    semesters: await prisma.semester.count(),
    subjects: await prisma.subject.count(),
    batches: await prisma.batch.count(),
    classrooms: await prisma.classroom.count(),
    faculty: await prisma.faculty.count(),
    students: await prisma.student.count(),
    chapters: await prisma.chapter.count(),
    materialCategories: await prisma.materialCategory.count(),
    holidays: await prisma.holiday.count(),
    timetables: await prisma.timetable.count(),
    assignments: await prisma.assignment.count(),
    homeworks: await prisma.homework.count(),
    studyMaterials: await prisma.studyMaterial.count(),
    attendance: await prisma.attendance.count(),
    assignmentSubmissions: await prisma.assignmentSubmission.count(),
    evaluations: await prisma.evaluation.count(),
    qrSessions: await prisma.qRSession.count(),
    qrScans: await prisma.qRScan.count(),
    faceRecognitions: await prisma.faceRecognition.count(),
    fingerprintAttendances: await prisma.fingerprintAttendance.count(),
    attendanceCorrections: await prisma.attendanceCorrection.count(),
    facultyTransfers: await prisma.facultyTransfer.count(),
    assignmentLogs: await prisma.assignmentLog.count(),
    materialDownloads: await prisma.materialDownload.count(),
    materialSearchLogs: await prisma.materialSearchLog.count(),
    assignmentReminders: await prisma.assignmentReminder.count(),
    uploads: await prisma.upload.count(),
    parents: await prisma.parent.count(),
    exams: await prisma.exam.count(),
    feeTransactions: await prisma.feeTransaction.count(),
    feePending: await prisma.feePending.count(),
    feeStructure: await prisma.feeStructure.count(),
    notificationBroadcasts: await prisma.notificationBroadcast.count(),
    blacklistedTokens: await prisma.blacklistedToken.count(),
    auditLogs: await prisma.auditLog.count(),
  };
  console.table(counts);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`Total records: ${total}`);
  console.log(`Tables with data: ${Object.entries(counts).filter(([,v]) => v > 0).length}/${Object.keys(counts).length}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
