-- Migration to support placeholder members
BEGIN;

-- 1. Drop the existing composite primary key
ALTER TABLE "public"."group_members" DROP CONSTRAINT "group_members_pkey";

-- 2. Add a new primary key constraint on the 'id' column
-- The 'id' column already exists with gen_random_uuid()
ALTER TABLE "public"."group_members" ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("id");

-- 3. Make 'user_id' nullable
ALTER TABLE "public"."group_members" ALTER COLUMN "user_id" DROP NOT NULL;

-- 4. Update the unique constraint to allow multiple placeholder members (NULL user_id)
-- but keep (group_id, user_id) unique for non-NULL users
CREATE UNIQUE INDEX "group_members_group_id_user_id_idx" ON "public"."group_members" ("group_id", "user_id") WHERE "user_id" IS NOT NULL;

COMMIT;
