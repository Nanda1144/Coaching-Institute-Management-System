-- CreateTable: branches (already done in earlier migration, added here for completeness)
-- Skipped - already in 20260722090000_add_branch_payment_certificate

-- CreateTable: payments (already done in earlier migration)
-- Skipped

-- CreateTable: certificates (already done in earlier migration)
-- Skipped

-- AlterTable: courses - add new columns
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "duration_unit" TEXT DEFAULT 'months';
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "fee" DECIMAL(65,30) DEFAULT 0;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "maximum_capacity" INTEGER;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "enrolled_count" INTEGER DEFAULT 0;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "min_age" INTEGER;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "max_age" INTEGER;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "required_qualification" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN DEFAULT true;

-- AlterTable: batches - add new columns
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "batch_code" TEXT;
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "course_id" TEXT;
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "capacity" INTEGER;
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "current_strength" INTEGER DEFAULT 0;
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "start_date" TIMESTAMP(3);
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "end_date" TIMESTAMP(3);
ALTER TABLE "batches" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active';

-- AlterTable: fee_structure - add new columns
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "course_id" TEXT;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "batch_id" TEXT;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "academic_year" TEXT;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "registration_fee" DECIMAL(65,30) DEFAULT 0;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "tuition_fee" DECIMAL(65,30) DEFAULT 0;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "examination_fee" DECIMAL(65,30) DEFAULT 0;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "miscellaneous_fee" DECIMAL(65,30) DEFAULT 0;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "total_fee" DECIMAL(65,30) DEFAULT 0;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "installment_count" INTEGER DEFAULT 1;
ALTER TABLE "fee_structure" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "batches_batch_code_key" ON "batches"("batch_code");

-- CreateTable: course_prerequisites
CREATE TABLE IF NOT EXISTS "course_prerequisites" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "prerequisite_course_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "course_prerequisites_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "course_prerequisites_course_id_prerequisite_course_id_key" ON "course_prerequisites"("course_id", "prerequisite_course_id");
CREATE INDEX IF NOT EXISTS "course_prerequisites_course_id_idx" ON "course_prerequisites"("course_id");
CREATE INDEX IF NOT EXISTS "course_prerequisites_prerequisite_course_id_idx" ON "course_prerequisites"("prerequisite_course_id");

-- CreateTable: enrollments
CREATE TABLE IF NOT EXISTS "enrollments" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "enrollments_student_id_course_id_key" ON "enrollments"("student_id", "course_id");
CREATE INDEX IF NOT EXISTS "enrollments_student_id_idx" ON "enrollments"("student_id");
CREATE INDEX IF NOT EXISTS "enrollments_course_id_idx" ON "enrollments"("course_id");
CREATE INDEX IF NOT EXISTS "enrollments_status_idx" ON "enrollments"("status");

-- CreateTable: installments
CREATE TABLE IF NOT EXISTS "installments" (
    "id" TEXT NOT NULL,
    "fee_structure_id" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paid_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "installments_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "installments_fee_structure_id_idx" ON "installments"("fee_structure_id");
