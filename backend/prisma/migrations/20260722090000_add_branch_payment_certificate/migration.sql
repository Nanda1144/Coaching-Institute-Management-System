-- CreateTable: branches
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "branch_code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "contact_person" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "email" TEXT,
    "branch_head" TEXT,
    "maximum_capacity" INTEGER,
    "opening_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "student_count" INTEGER DEFAULT 0,
    "faculty_count" INTEGER DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable: payments
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "refunded_amount" DECIMAL(65,30) DEFAULT 0,
    "refund_reason" TEXT,
    "refunded_at" TIMESTAMP(3),
    "refunded_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: certificates
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "student_name" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "completion_date" TIMESTAMP(3),
    "grade" TEXT,
    "certificate_number" TEXT,
    "template_name" TEXT NOT NULL DEFAULT 'Standard',
    "template_style" TEXT NOT NULL DEFAULT 'classic',
    "issue_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: branches
CREATE UNIQUE INDEX "branches_branch_code_key" ON "branches"("branch_code");
CREATE INDEX "branches_status_idx" ON "branches"("status");

-- CreateIndex: payments
CREATE UNIQUE INDEX "payments_transaction_id_key" ON "payments"("transaction_id");
CREATE INDEX "payments_student_id_idx" ON "payments"("student_id");
CREATE INDEX "payments_status_idx" ON "payments"("status");
CREATE INDEX "payments_transaction_id_idx" ON "payments"("transaction_id");

-- CreateIndex: certificates
CREATE UNIQUE INDEX "certificates_certificate_number_key" ON "certificates"("certificate_number");
CREATE INDEX "certificates_student_id_idx" ON "certificates"("student_id");
CREATE INDEX "certificates_status_idx" ON "certificates"("status");
