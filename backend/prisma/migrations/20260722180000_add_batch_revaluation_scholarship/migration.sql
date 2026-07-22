-- AlterTable: batches - add new columns
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "batch_timing" TEXT;
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "classroom" TEXT;
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "mode" TEXT DEFAULT 'offline';
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "faculty_id" TEXT;
CREATE INDEX IF NOT EXISTS "batches_faculty_id_idx" ON "batches"("faculty_id");

-- CreateTable: batch_students
CREATE TABLE IF NOT EXISTS "batch_students" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "allocated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "batch_students_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "batch_students_batch_id_student_id_key" ON "batch_students"("batch_id", "student_id");
CREATE INDEX IF NOT EXISTS "batch_students_batch_id_idx" ON "batch_students"("batch_id");
CREATE INDEX IF NOT EXISTS "batch_students_student_id_idx" ON "batch_students"("student_id");

-- CreateTable: batch_transfers
CREATE TABLE IF NOT EXISTS "batch_transfers" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "old_batch_id" TEXT NOT NULL,
    "new_batch_id" TEXT NOT NULL,
    "transfer_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "batch_transfers_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "batch_transfers_student_id_idx" ON "batch_transfers"("student_id");
CREATE INDEX IF NOT EXISTS "batch_transfers_old_batch_id_idx" ON "batch_transfers"("old_batch_id");
CREATE INDEX IF NOT EXISTS "batch_transfers_new_batch_id_idx" ON "batch_transfers"("new_batch_id");

-- CreateTable: revaluation_requests
CREATE TABLE IF NOT EXISTS "revaluation_requests" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT,
    "current_marks" DOUBLE PRECISION NOT NULL,
    "expected_marks" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "remarks" TEXT,
    "revised_marks" DOUBLE PRECISION,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "revaluation_requests_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "revaluation_requests_exam_id_idx" ON "revaluation_requests"("exam_id");
CREATE INDEX IF NOT EXISTS "revaluation_requests_student_id_idx" ON "revaluation_requests"("student_id");
CREATE INDEX IF NOT EXISTS "revaluation_requests_status_idx" ON "revaluation_requests"("status");

-- CreateTable: revaluation_timelines
CREATE TABLE IF NOT EXISTS "revaluation_timelines" (
    "id" TEXT NOT NULL,
    "revaluation_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "performed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "revaluation_timelines_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "revaluation_timelines_revaluation_id_idx" ON "revaluation_timelines"("revaluation_id");

-- CreateTable: scholarships
CREATE TABLE IF NOT EXISTS "scholarships" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "scholarship_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "description" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "scholarships_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "scholarships_student_id_idx" ON "scholarships"("student_id");
CREATE INDEX IF NOT EXISTS "scholarships_status_idx" ON "scholarships"("status");
