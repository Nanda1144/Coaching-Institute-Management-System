-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'HOLD', 'UPLOAD', 'DOWNLOAD', 'OTHER');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'HOLD', 'REJECTED');

-- DropForeignKey
ALTER TABLE "assignment_attachments" DROP CONSTRAINT "assignment_attachments_assignment_id_fkey";

-- DropForeignKey
ALTER TABLE "assignment_reminders" DROP CONSTRAINT "assignment_reminders_assignment_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance_corrections" DROP CONSTRAINT "attendance_corrections_attendance_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluations" DROP CONSTRAINT "evaluations_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "homework_attachments" DROP CONSTRAINT "homework_attachments_homework_id_fkey";

-- DropForeignKey
ALTER TABLE "material_attachments" DROP CONSTRAINT "material_attachments_study_material_id_fkey";

-- DropForeignKey
ALTER TABLE "material_downloads" DROP CONSTRAINT "material_downloads_study_material_id_fkey";

-- DropForeignKey
ALTER TABLE "qr_scans" DROP CONSTRAINT "qr_scans_qr_session_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_attachments" DROP CONSTRAINT "submission_attachments_submission_id_fkey";

-- AlterTable
ALTER TABLE "assignment_logs" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "attendance_corrections" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "face_recognitions" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "faculty_transfers" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "fingerprint_attendances" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "material_attachments" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "material_downloads" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "material_search_logs" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notification_broadcasts" ADD COLUMN     "read_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'PARENT',
ADD COLUMN     "status" TEXT DEFAULT 'active',
ALTER COLUMN "linked_student" DROP NOT NULL,
ALTER COLUMN "linked_roll" DROP NOT NULL;

-- AlterTable
ALTER TABLE "qr_scans" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "qr_sessions" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "semesters" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE "blacklisted_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklisted_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "actor_role" TEXT,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_registration_requests" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT,
    "gender" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "address" JSONB,
    "department" TEXT NOT NULL,
    "course" TEXT,
    "semester" INTEGER,
    "batch" TEXT,
    "preferred_faculty_id" TEXT,
    "parent_name" TEXT,
    "parent_email" TEXT,
    "parent_phone" TEXT,
    "profile_image" TEXT,
    "documents" JSONB DEFAULT '[]',
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_registration_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklisted_tokens_token_key" ON "blacklisted_tokens"("token");

-- CreateIndex
CREATE INDEX "blacklisted_tokens_expires_at_idx" ON "blacklisted_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs"("entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "student_registration_requests_email_key" ON "student_registration_requests"("email");

-- CreateIndex
CREATE INDEX "student_registration_requests_email_idx" ON "student_registration_requests"("email");

-- CreateIndex
CREATE INDEX "student_registration_requests_status_idx" ON "student_registration_requests"("status");

-- CreateIndex
CREATE INDEX "student_registration_requests_created_at_idx" ON "student_registration_requests"("created_at");

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_qr_session_id_fkey" FOREIGN KEY ("qr_session_id") REFERENCES "qr_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_corrections" ADD CONSTRAINT "attendance_corrections_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_attachments" ADD CONSTRAINT "assignment_attachments_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework_attachments" ADD CONSTRAINT "homework_attachments_homework_id_fkey" FOREIGN KEY ("homework_id") REFERENCES "homeworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_attachments" ADD CONSTRAINT "submission_attachments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "assignment_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "assignment_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_attachments" ADD CONSTRAINT "material_attachments_study_material_id_fkey" FOREIGN KEY ("study_material_id") REFERENCES "study_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_downloads" ADD CONSTRAINT "material_downloads_study_material_id_fkey" FOREIGN KEY ("study_material_id") REFERENCES "study_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_reminders" ADD CONSTRAINT "assignment_reminders_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
