-- CreateTable: parents
CREATE TABLE IF NOT EXISTS "parents" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "linked_student" TEXT NOT NULL,
    "linked_roll" TEXT NOT NULL,
    "relationship" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "parents_email_key" ON "parents"("email");
CREATE INDEX IF NOT EXISTS "parents_email_idx" ON "parents"("email");
CREATE INDEX IF NOT EXISTS "parents_linked_roll_idx" ON "parents"("linked_roll");

-- CreateTable: exams
CREATE TABLE IF NOT EXISTS "exams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "max_marks" INTEGER,
    "type" TEXT,
    "location" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "exams_status_idx" ON "exams"("status");
CREATE INDEX IF NOT EXISTS "exams_date_idx" ON "exams"("date");

-- CreateTable: fee_transactions
CREATE TABLE IF NOT EXISTS "fee_transactions" (
    "id" TEXT NOT NULL,
    "student" TEXT NOT NULL,
    "roll" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "method" TEXT,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "fee_transactions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "fee_transactions_roll_idx" ON "fee_transactions"("roll");
CREATE INDEX IF NOT EXISTS "fee_transactions_status_idx" ON "fee_transactions"("status");

-- CreateTable: fee_pending
CREATE TABLE IF NOT EXISTS "fee_pending" (
    "id" TEXT NOT NULL,
    "student" TEXT NOT NULL,
    "roll" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "days_overdue" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "fee_pending_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "fee_pending_roll_idx" ON "fee_pending"("roll");

-- CreateTable: fee_structure
CREATE TABLE IF NOT EXISTS "fee_structure" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "due_date" TEXT NOT NULL,
    "semester" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "fee_structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable: notification_broadcasts
CREATE TABLE IF NOT EXISTS "notification_broadcasts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "sent_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "notification_broadcasts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "notification_broadcasts_created_at_idx" ON "notification_broadcasts"("created_at");
