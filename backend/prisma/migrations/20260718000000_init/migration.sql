-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'late', 'half_day', 'leave');

-- CreateEnum
CREATE TYPE "AttendanceMethod" AS ENUM ('manual', 'face_recognition', 'fingerprint', 'qr_code');

-- CreateEnum
CREATE TYPE "RecognitionStatus" AS ENUM ('pending', 'verified', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "FingerprintStatus" AS ENUM ('pending', 'verified', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "QRStatus" AS ENUM ('active', 'expired', 'revoked');

-- CreateEnum
CREATE TYPE "QRScanStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('draft', 'published', 'under_review', 'revised');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('upcoming_deadline', 'overdue', 'recurring', 'custom');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('pending', 'sent', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('email', 'sms', 'push', 'all');

-- CreateEnum
CREATE TYPE "ReminderFrequency" AS ENUM ('once', 'daily', 'weekly', 'custom');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('submitted', 'late', 'resubmitted', 'graded', 'returned');

-- CreateEnum
CREATE TYPE "AssignmentVisibility" AS ENUM ('visible', 'hidden', 'draft');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('active', 'closed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "HomeworkStatus" AS ENUM ('active', 'closed', 'cancelled', 'archived');

-- CreateEnum
CREATE TYPE "CorrectionApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'IMAGE', 'VIDEO', 'ZIP', 'NOTES');

-- CreateEnum
CREATE TYPE "MaterialVisibility" AS ENUM ('PUBLIC', 'FACULTY_ONLY', 'STUDENTS_ONLY', 'BATCH_ONLY');

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "subject_code" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "credits" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "batch_name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "academic_year" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "id" TEXT NOT NULL,
    "classroom_code" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "room_number" TEXT NOT NULL,
    "capacity" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "alternate_phone" TEXT,
    "profile_image" TEXT,
    "employee_id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "specialization" TEXT[],
    "qualification" TEXT[],
    "experience" DOUBLE PRECISION NOT NULL,
    "joining_date" TIMESTAMP(3) NOT NULL,
    "employment_type" TEXT NOT NULL,
    "salary" DECIMAL(65,30),
    "branch" TEXT NOT NULL,
    "campus" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "emergency_contact" JSONB NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'faculty',
    "permissions" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "assigned_courses" JSONB NOT NULL DEFAULT '[]',
    "assigned_subjects" JSONB NOT NULL DEFAULT '[]',
    "assigned_batches" JSONB NOT NULL DEFAULT '[]',
    "assigned_semesters" JSONB NOT NULL DEFAULT '[]',
    "transfer_history" JSONB NOT NULL DEFAULT '[]',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "roll_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "batch" TEXT NOT NULL,
    "batch_id" TEXT,
    "section" TEXT,
    "gender" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" JSONB,
    "profile_image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "attendance_code" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "classroom_id" TEXT NOT NULL,
    "attendance_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "attendance_method" "AttendanceMethod" NOT NULL,
    "attendance_status" "AttendanceStatus" NOT NULL,
    "remarks" TEXT,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetables" (
    "id" TEXT NOT NULL,
    "timetable_id" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "section" TEXT,
    "subject" TEXT NOT NULL,
    "subject_code" TEXT NOT NULL,
    "subject_id" TEXT,
    "faculty_id" TEXT NOT NULL,
    "faculty_name" TEXT NOT NULL,
    "classroom_id" TEXT NOT NULL,
    "batch_id" TEXT,
    "batch_name" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "room_number" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "remarks" TEXT,
    "recurring_class" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_type" TEXT,
    "recurrence_end_date" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty_transfers" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "from_branch" TEXT NOT NULL,
    "from_department" TEXT NOT NULL,
    "to_branch" TEXT NOT NULL,
    "to_department" TEXT NOT NULL,
    "transfer_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "approved_by" TEXT,
    "status" "CorrectionApprovalStatus" NOT NULL DEFAULT 'pending',
    "performed_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_logs" (
    "id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "entity_name" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "performed_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "holiday_name" TEXT NOT NULL,
    "holiday_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "applicable_departments" TEXT[],
    "academic_year" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "face_recognitions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "attendance_id" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recognition_time" TIMESTAMP(3) NOT NULL,
    "image_url" TEXT,
    "device_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "status" "RecognitionStatus" NOT NULL DEFAULT 'pending',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "face_recognitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fingerprint_attendances" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "fingerprint_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "attendance_id" TEXT,
    "verification_status" "FingerprintStatus" NOT NULL DEFAULT 'pending',
    "recognition_time" TIMESTAMP(3) NOT NULL,
    "scanner_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fingerprint_attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_sessions" (
    "id" TEXT NOT NULL,
    "qr_token" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "classroom_id" TEXT NOT NULL,
    "attendance_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "expiry_time" TIMESTAMP(3) NOT NULL,
    "status" "QRStatus" NOT NULL DEFAULT 'active',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_scans" (
    "id" TEXT NOT NULL,
    "qr_session_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "attendance_id" TEXT,
    "scanned_at" TIMESTAMP(3) NOT NULL,
    "status" "QRScanStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_corrections" (
    "id" TEXT NOT NULL,
    "attendance_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "attendance_date" TIMESTAMP(3) NOT NULL,
    "current_status" "AttendanceStatus" NOT NULL,
    "requested_status" "AttendanceStatus" NOT NULL,
    "reason" TEXT NOT NULL,
    "attachment_url" TEXT,
    "approval_status" "CorrectionApprovalStatus" NOT NULL DEFAULT 'pending',
    "approved_by_id" TEXT,
    "approval_date" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_corrections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semesters" (
    "id" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "assignment_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "department_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "semester_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "total_marks" INTEGER NOT NULL,
    "passing_marks" INTEGER NOT NULL,
    "publish_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "due_time" TIMESTAMP(3) NOT NULL,
    "allow_late_submission" BOOLEAN NOT NULL DEFAULT false,
    "max_file_size" INTEGER,
    "max_attempts" INTEGER NOT NULL DEFAULT 1,
    "visibility" "AssignmentVisibility" NOT NULL DEFAULT 'visible',
    "status" "AssignmentStatus" NOT NULL DEFAULT 'active',
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_attachments" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homeworks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "department_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "HomeworkStatus" NOT NULL DEFAULT 'active',
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homework_attachments" (
    "id" TEXT NOT NULL,
    "homework_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homework_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" TEXT NOT NULL,
    "submission_code" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "submission_date" TIMESTAMP(3) NOT NULL,
    "submission_time" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'submitted',
    "remarks" TEXT,
    "late_flag" BOOLEAN NOT NULL DEFAULT false,
    "graded_by_id" TEXT,
    "graded_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_attachments" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "marks_obtained" DECIMAL(65,30) NOT NULL,
    "total_marks" INTEGER NOT NULL,
    "grade" TEXT,
    "feedback" TEXT,
    "remarks" TEXT,
    "evaluation_date" TIMESTAMP(3) NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'draft',
    "previous_version" JSONB,
    "created_by_id" TEXT NOT NULL,
    "updated_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "chapter_name" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "description" TEXT,
    "chapter_number" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_materials" (
    "id" TEXT NOT NULL,
    "material_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "department_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "semester_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "chapter_id" TEXT,
    "batch_id" TEXT NOT NULL,
    "category_id" TEXT,
    "uploaded_by_id" TEXT NOT NULL,
    "material_type" "MaterialType" NOT NULL,
    "visibility" "MaterialVisibility" NOT NULL DEFAULT 'PUBLIC',
    "file_name" TEXT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "content_hash" TEXT,
    "file_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "file_extension" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "total_downloads" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "study_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_categories" (
    "id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "description" TEXT,
    "department_id" TEXT NOT NULL,
    "course_id" TEXT,
    "semester_id" TEXT,
    "subject_id" TEXT,
    "chapter_id" TEXT,
    "batch_id" TEXT,
    "parent_id" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "material_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_attachments" (
    "id" TEXT NOT NULL,
    "study_material_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "file_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_downloads" (
    "id" TEXT NOT NULL,
    "study_material_id" TEXT NOT NULL,
    "downloaded_by_id" TEXT NOT NULL,
    "downloaded_by_role" TEXT NOT NULL,
    "downloaded_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "device_info" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "material_downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_search_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "filters" JSONB NOT NULL DEFAULT '{}',
    "result_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_search_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_reminders" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "student_id" TEXT,
    "reminder_date" TIMESTAMP(3) NOT NULL,
    "reminder_time" TIMESTAMP(3) NOT NULL,
    "reminder_type" "ReminderType" NOT NULL DEFAULT 'upcoming_deadline',
    "status" "ReminderStatus" NOT NULL DEFAULT 'pending',
    "notification_channel" "NotificationChannel" NOT NULL DEFAULT 'email',
    "frequency" "ReminderFrequency" NOT NULL DEFAULT 'once',
    "custom_cron_expression" TEXT,
    "sent_at" TIMESTAMP(3),
    "error_message" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "assignment_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "thumbnail_url" TEXT,
    "content_hash" TEXT,
    "uploaded_by_id" TEXT,
    "uploaded_by_role" TEXT,
    "module" TEXT,
    "module_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_subject_code_key" ON "subjects"("subject_code");

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_classroom_code_key" ON "classrooms"("classroom_code");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_faculty_id_key" ON "faculty"("faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_phone_key" ON "faculty"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_employee_id_key" ON "faculty"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_username_key" ON "faculty"("username");

-- CreateIndex
CREATE INDEX "faculty_created_by_id_idx" ON "faculty"("created_by_id");

-- CreateIndex
CREATE INDEX "faculty_updated_by_id_idx" ON "faculty"("updated_by_id");

-- CreateIndex
CREATE INDEX "faculty_department_idx" ON "faculty"("department");

-- CreateIndex
CREATE INDEX "faculty_status_idx" ON "faculty"("status");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_key" ON "students"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_batch_id_idx" ON "students"("batch_id");

-- CreateIndex
CREATE INDEX "students_created_by_id_idx" ON "students"("created_by_id");

-- CreateIndex
CREATE INDEX "students_updated_by_id_idx" ON "students"("updated_by_id");

-- CreateIndex
CREATE INDEX "students_department_idx" ON "students"("department");

-- CreateIndex
CREATE INDEX "students_status_idx" ON "students"("status");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_attendance_code_key" ON "attendances"("attendance_code");

-- CreateIndex
CREATE INDEX "attendances_student_id_idx" ON "attendances"("student_id");

-- CreateIndex
CREATE INDEX "attendances_faculty_id_idx" ON "attendances"("faculty_id");

-- CreateIndex
CREATE INDEX "attendances_subject_id_idx" ON "attendances"("subject_id");

-- CreateIndex
CREATE INDEX "attendances_batch_id_idx" ON "attendances"("batch_id");

-- CreateIndex
CREATE INDEX "attendances_classroom_id_idx" ON "attendances"("classroom_id");

-- CreateIndex
CREATE INDEX "attendances_attendance_date_idx" ON "attendances"("attendance_date");

-- CreateIndex
CREATE INDEX "attendances_faculty_id_attendance_date_idx" ON "attendances"("faculty_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "timetables_timetable_id_key" ON "timetables"("timetable_id");

-- CreateIndex
CREATE INDEX "timetables_faculty_id_idx" ON "timetables"("faculty_id");

-- CreateIndex
CREATE INDEX "timetables_subject_id_idx" ON "timetables"("subject_id");

-- CreateIndex
CREATE INDEX "timetables_batch_id_idx" ON "timetables"("batch_id");

-- CreateIndex
CREATE INDEX "timetables_classroom_id_idx" ON "timetables"("classroom_id");

-- CreateIndex
CREATE INDEX "timetables_day_of_week_idx" ON "timetables"("day_of_week");

-- CreateIndex
CREATE INDEX "faculty_transfers_faculty_id_idx" ON "faculty_transfers"("faculty_id");

-- CreateIndex
CREATE INDEX "faculty_transfers_performed_by_idx" ON "faculty_transfers"("performed_by");

-- CreateIndex
CREATE INDEX "faculty_transfers_status_idx" ON "faculty_transfers"("status");

-- CreateIndex
CREATE INDEX "faculty_transfers_transfer_date_idx" ON "faculty_transfers"("transfer_date");

-- CreateIndex
CREATE INDEX "assignment_logs_faculty_id_idx" ON "assignment_logs"("faculty_id");

-- CreateIndex
CREATE INDEX "assignment_logs_performed_by_idx" ON "assignment_logs"("performed_by");

-- CreateIndex
CREATE INDEX "holidays_created_by_idx" ON "holidays"("created_by");

-- CreateIndex
CREATE INDEX "holidays_updated_by_idx" ON "holidays"("updated_by");

-- CreateIndex
CREATE INDEX "holidays_start_date_idx" ON "holidays"("start_date");

-- CreateIndex
CREATE INDEX "holidays_end_date_idx" ON "holidays"("end_date");

-- CreateIndex
CREATE INDEX "holidays_holiday_type_idx" ON "holidays"("holiday_type");

-- CreateIndex
CREATE INDEX "face_recognitions_student_id_idx" ON "face_recognitions"("student_id");

-- CreateIndex
CREATE INDEX "face_recognitions_attendance_id_idx" ON "face_recognitions"("attendance_id");

-- CreateIndex
CREATE INDEX "face_recognitions_created_by_id_idx" ON "face_recognitions"("created_by_id");

-- CreateIndex
CREATE INDEX "face_recognitions_session_id_idx" ON "face_recognitions"("session_id");

-- CreateIndex
CREATE INDEX "face_recognitions_status_idx" ON "face_recognitions"("status");

-- CreateIndex
CREATE INDEX "fingerprint_attendances_student_id_idx" ON "fingerprint_attendances"("student_id");

-- CreateIndex
CREATE INDEX "fingerprint_attendances_attendance_id_idx" ON "fingerprint_attendances"("attendance_id");

-- CreateIndex
CREATE INDEX "fingerprint_attendances_created_by_id_idx" ON "fingerprint_attendances"("created_by_id");

-- CreateIndex
CREATE INDEX "fingerprint_attendances_session_id_idx" ON "fingerprint_attendances"("session_id");

-- CreateIndex
CREATE INDEX "fingerprint_attendances_verification_status_idx" ON "fingerprint_attendances"("verification_status");

-- CreateIndex
CREATE UNIQUE INDEX "qr_sessions_qr_token_key" ON "qr_sessions"("qr_token");

-- CreateIndex
CREATE INDEX "qr_sessions_faculty_id_idx" ON "qr_sessions"("faculty_id");

-- CreateIndex
CREATE INDEX "qr_sessions_subject_id_idx" ON "qr_sessions"("subject_id");

-- CreateIndex
CREATE INDEX "qr_sessions_batch_id_idx" ON "qr_sessions"("batch_id");

-- CreateIndex
CREATE INDEX "qr_sessions_classroom_id_idx" ON "qr_sessions"("classroom_id");

-- CreateIndex
CREATE INDEX "qr_sessions_created_by_id_idx" ON "qr_sessions"("created_by_id");

-- CreateIndex
CREATE INDEX "qr_sessions_status_idx" ON "qr_sessions"("status");

-- CreateIndex
CREATE INDEX "qr_scans_qr_session_id_idx" ON "qr_scans"("qr_session_id");

-- CreateIndex
CREATE INDEX "qr_scans_student_id_idx" ON "qr_scans"("student_id");

-- CreateIndex
CREATE INDEX "qr_scans_attendance_id_idx" ON "qr_scans"("attendance_id");

-- CreateIndex
CREATE INDEX "attendance_corrections_attendance_id_idx" ON "attendance_corrections"("attendance_id");

-- CreateIndex
CREATE INDEX "attendance_corrections_student_id_idx" ON "attendance_corrections"("student_id");

-- CreateIndex
CREATE INDEX "attendance_corrections_approved_by_id_idx" ON "attendance_corrections"("approved_by_id");

-- CreateIndex
CREATE INDEX "attendance_corrections_created_by_id_idx" ON "attendance_corrections"("created_by_id");

-- CreateIndex
CREATE INDEX "attendance_corrections_approval_status_idx" ON "attendance_corrections"("approval_status");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_semester_key" ON "semesters"("semester");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_assignment_code_key" ON "assignments"("assignment_code");

-- CreateIndex
CREATE INDEX "assignments_department_id_idx" ON "assignments"("department_id");

-- CreateIndex
CREATE INDEX "assignments_course_id_idx" ON "assignments"("course_id");

-- CreateIndex
CREATE INDEX "assignments_semester_id_idx" ON "assignments"("semester_id");

-- CreateIndex
CREATE INDEX "assignments_subject_id_idx" ON "assignments"("subject_id");

-- CreateIndex
CREATE INDEX "assignments_batch_id_idx" ON "assignments"("batch_id");

-- CreateIndex
CREATE INDEX "assignments_faculty_id_idx" ON "assignments"("faculty_id");

-- CreateIndex
CREATE INDEX "assignments_status_idx" ON "assignments"("status");

-- CreateIndex
CREATE INDEX "assignments_faculty_id_status_deleted_at_idx" ON "assignments"("faculty_id", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "assignment_attachments_assignment_id_idx" ON "assignment_attachments"("assignment_id");

-- CreateIndex
CREATE INDEX "homeworks_department_id_idx" ON "homeworks"("department_id");

-- CreateIndex
CREATE INDEX "homeworks_course_id_idx" ON "homeworks"("course_id");

-- CreateIndex
CREATE INDEX "homeworks_batch_id_idx" ON "homeworks"("batch_id");

-- CreateIndex
CREATE INDEX "homeworks_subject_id_idx" ON "homeworks"("subject_id");

-- CreateIndex
CREATE INDEX "homeworks_faculty_id_idx" ON "homeworks"("faculty_id");

-- CreateIndex
CREATE INDEX "homework_attachments_homework_id_idx" ON "homework_attachments"("homework_id");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_submissions_submission_code_key" ON "assignment_submissions"("submission_code");

-- CreateIndex
CREATE INDEX "assignment_submissions_assignment_id_idx" ON "assignment_submissions"("assignment_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_student_id_idx" ON "assignment_submissions"("student_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_graded_by_id_idx" ON "assignment_submissions"("graded_by_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_status_idx" ON "assignment_submissions"("status");

-- CreateIndex
CREATE INDEX "assignment_submissions_assignment_id_status_idx" ON "assignment_submissions"("assignment_id", "status");

-- CreateIndex
CREATE INDEX "submission_attachments_submission_id_idx" ON "submission_attachments"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_submission_id_key" ON "evaluations"("submission_id");

-- CreateIndex
CREATE INDEX "evaluations_submission_id_idx" ON "evaluations"("submission_id");

-- CreateIndex
CREATE INDEX "evaluations_faculty_id_idx" ON "evaluations"("faculty_id");

-- CreateIndex
CREATE INDEX "evaluations_created_by_id_idx" ON "evaluations"("created_by_id");

-- CreateIndex
CREATE INDEX "evaluations_updated_by_id_idx" ON "evaluations"("updated_by_id");

-- CreateIndex
CREATE INDEX "evaluations_status_idx" ON "evaluations"("status");

-- CreateIndex
CREATE INDEX "chapters_subject_id_idx" ON "chapters"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_materials_material_code_key" ON "study_materials"("material_code");

-- CreateIndex
CREATE INDEX "study_materials_department_id_idx" ON "study_materials"("department_id");

-- CreateIndex
CREATE INDEX "study_materials_course_id_idx" ON "study_materials"("course_id");

-- CreateIndex
CREATE INDEX "study_materials_semester_id_idx" ON "study_materials"("semester_id");

-- CreateIndex
CREATE INDEX "study_materials_subject_id_idx" ON "study_materials"("subject_id");

-- CreateIndex
CREATE INDEX "study_materials_chapter_id_idx" ON "study_materials"("chapter_id");

-- CreateIndex
CREATE INDEX "study_materials_batch_id_idx" ON "study_materials"("batch_id");

-- CreateIndex
CREATE INDEX "study_materials_category_id_idx" ON "study_materials"("category_id");

-- CreateIndex
CREATE INDEX "study_materials_uploaded_by_id_idx" ON "study_materials"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "study_materials_material_type_idx" ON "study_materials"("material_type");

-- CreateIndex
CREATE INDEX "study_materials_status_idx" ON "study_materials"("status");

-- CreateIndex
CREATE INDEX "study_materials_visibility_idx" ON "study_materials"("visibility");

-- CreateIndex
CREATE INDEX "material_categories_department_id_idx" ON "material_categories"("department_id");

-- CreateIndex
CREATE INDEX "material_categories_course_id_idx" ON "material_categories"("course_id");

-- CreateIndex
CREATE INDEX "material_categories_semester_id_idx" ON "material_categories"("semester_id");

-- CreateIndex
CREATE INDEX "material_categories_subject_id_idx" ON "material_categories"("subject_id");

-- CreateIndex
CREATE INDEX "material_categories_chapter_id_idx" ON "material_categories"("chapter_id");

-- CreateIndex
CREATE INDEX "material_categories_batch_id_idx" ON "material_categories"("batch_id");

-- CreateIndex
CREATE INDEX "material_categories_parent_id_idx" ON "material_categories"("parent_id");

-- CreateIndex
CREATE INDEX "material_attachments_study_material_id_idx" ON "material_attachments"("study_material_id");

-- CreateIndex
CREATE INDEX "material_downloads_study_material_id_idx" ON "material_downloads"("study_material_id");

-- CreateIndex
CREATE INDEX "material_downloads_downloaded_by_id_idx" ON "material_downloads"("downloaded_by_id");

-- CreateIndex
CREATE INDEX "material_search_logs_user_id_idx" ON "material_search_logs"("user_id");

-- CreateIndex
CREATE INDEX "material_search_logs_query_idx" ON "material_search_logs"("query");

-- CreateIndex
CREATE INDEX "assignment_reminders_assignment_id_idx" ON "assignment_reminders"("assignment_id");

-- CreateIndex
CREATE INDEX "assignment_reminders_student_id_idx" ON "assignment_reminders"("student_id");

-- CreateIndex
CREATE INDEX "assignment_reminders_created_by_id_idx" ON "assignment_reminders"("created_by_id");

-- CreateIndex
CREATE INDEX "assignment_reminders_status_idx" ON "assignment_reminders"("status");

-- CreateIndex
CREATE INDEX "assignment_reminders_reminder_type_idx" ON "assignment_reminders"("reminder_type");

-- CreateIndex
CREATE INDEX "assignment_reminders_reminder_date_idx" ON "assignment_reminders"("reminder_date");

-- CreateIndex
CREATE INDEX "uploads_uploaded_by_id_idx" ON "uploads"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "uploads_module_idx" ON "uploads"("module");

-- CreateIndex
CREATE INDEX "uploads_module_id_idx" ON "uploads"("module_id");

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_transfers" ADD CONSTRAINT "faculty_transfers_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_transfers" ADD CONSTRAINT "faculty_transfers_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_logs" ADD CONSTRAINT "assignment_logs_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_logs" ADD CONSTRAINT "assignment_logs_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "face_recognitions" ADD CONSTRAINT "face_recognitions_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "face_recognitions" ADD CONSTRAINT "face_recognitions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "face_recognitions" ADD CONSTRAINT "face_recognitions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fingerprint_attendances" ADD CONSTRAINT "fingerprint_attendances_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fingerprint_attendances" ADD CONSTRAINT "fingerprint_attendances_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fingerprint_attendances" ADD CONSTRAINT "fingerprint_attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_sessions" ADD CONSTRAINT "qr_sessions_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_sessions" ADD CONSTRAINT "qr_sessions_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_sessions" ADD CONSTRAINT "qr_sessions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_sessions" ADD CONSTRAINT "qr_sessions_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_sessions" ADD CONSTRAINT "qr_sessions_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_qr_session_id_fkey" FOREIGN KEY ("qr_session_id") REFERENCES "qr_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_corrections" ADD CONSTRAINT "attendance_corrections_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_corrections" ADD CONSTRAINT "attendance_corrections_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_corrections" ADD CONSTRAINT "attendance_corrections_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_corrections" ADD CONSTRAINT "attendance_corrections_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_attachments" ADD CONSTRAINT "assignment_attachments_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_attachments" ADD CONSTRAINT "homework_attachments_homework_id_fkey" FOREIGN KEY ("homework_id") REFERENCES "homeworks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_graded_by_id_fkey" FOREIGN KEY ("graded_by_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_attachments" ADD CONSTRAINT "submission_attachments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "assignment_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "assignment_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "material_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_materials" ADD CONSTRAINT "study_materials_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "material_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semesters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_categories" ADD CONSTRAINT "material_categories_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_attachments" ADD CONSTRAINT "material_attachments_study_material_id_fkey" FOREIGN KEY ("study_material_id") REFERENCES "study_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_downloads" ADD CONSTRAINT "material_downloads_study_material_id_fkey" FOREIGN KEY ("study_material_id") REFERENCES "study_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_reminders" ADD CONSTRAINT "assignment_reminders_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_reminders" ADD CONSTRAINT "assignment_reminders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_reminders" ADD CONSTRAINT "assignment_reminders_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
