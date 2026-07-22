-- Add is_deleted column to evaluations table
ALTER TABLE "evaluations" ADD COLUMN IF NOT EXISTS "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "evaluations" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);
