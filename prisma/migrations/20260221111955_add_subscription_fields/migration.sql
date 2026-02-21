-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ai_generations_reset_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ai_generations_today" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_pro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "polar_customer_id" TEXT,
ADD COLUMN     "polar_subscription_id" TEXT,
ADD COLUMN     "subscription_ends_at" TIMESTAMP(3),
ADD COLUMN     "subscription_started_at" TIMESTAMP(3),
ADD COLUMN     "subscription_status" TEXT;
