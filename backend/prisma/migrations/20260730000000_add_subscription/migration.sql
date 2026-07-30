-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS "subscription_plans" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "features" JSONB DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- Create admin_subscriptions table
CREATE TABLE IF NOT EXISTS "admin_subscriptions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "admin_id" TEXT NOT NULL,
    "plan_id" TEXT,
    "start_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ,
    "trial_ends_at" TIMESTAMPTZ,
    "status" TEXT NOT NULL DEFAULT 'TRIAL',
    "paid_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_subscriptions_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys after tables exist
ALTER TABLE "admin_subscriptions" ADD CONSTRAINT "admin_subscriptions_admin_id_fkey"
    FOREIGN KEY ("admin_id") REFERENCES "faculty"("id") ON DELETE CASCADE;

ALTER TABLE "admin_subscriptions" ADD CONSTRAINT "admin_subscriptions_plan_id_fkey"
    FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE SET NULL;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "admin_subscriptions_admin_id_idx" ON "admin_subscriptions"("admin_id");
CREATE INDEX IF NOT EXISTS "admin_subscriptions_status_idx" ON "admin_subscriptions"("status");
