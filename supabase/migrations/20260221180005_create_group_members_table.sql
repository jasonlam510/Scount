-- Group members table (depends on public.groups and auth.users)
CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "id" uuid DEFAULT gen_random_uuid(),
    "group_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "display_name" text NOT NULL,
    "is_archived" boolean DEFAULT false,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now()
);

ALTER TABLE "public"."group_members" OWNER TO "postgres";
ALTER TABLE ONLY "public"."group_members" ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("group_id", "user_id");
ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;
ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE TRIGGER "handle_updated_at"
    BEFORE UPDATE ON "public"."group_members"
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime('updated_at');
