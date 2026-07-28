-- Create app_settings table for storing application settings
CREATE TABLE "app_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "section" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "app_settings_section_key" UNIQUE ("section")
);
