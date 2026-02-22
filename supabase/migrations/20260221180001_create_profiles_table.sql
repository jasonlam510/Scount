-- Profiles table (user_id -> auth.users)
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "name" text NOT NULL,
    "avatar" text,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now()
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";
COMMENT ON TABLE "public"."profiles" IS 'User profiles';

ALTER TABLE ONLY "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");
ALTER TABLE ONLY "public"."profiles" ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");
ALTER TABLE ONLY "public"."profiles" ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");
ALTER TABLE ONLY "public"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

-- Auto-update updated_at via moddatetime
CREATE TRIGGER "handle_updated_at"
    BEFORE UPDATE ON "public"."profiles"
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime('updated_at');
