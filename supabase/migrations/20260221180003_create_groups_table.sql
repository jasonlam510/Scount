-- Groups table (must exist before group_members due to FK)
CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "title" text NOT NULL,
    "icon" text NOT NULL,
    "currency" text NOT NULL,
    "is_deleted" boolean DEFAULT false,
    "invite_token" uuid DEFAULT gen_random_uuid(),
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE "public"."groups" OWNER TO "postgres";
ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."groups" ADD CONSTRAINT "groups_invite_token_key" UNIQUE ("invite_token");
ALTER TABLE ONLY "public"."groups" REPLICA IDENTITY FULL;

CREATE TRIGGER "handle_updated_at"
    BEFORE UPDATE ON "public"."groups"
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime('updated_at');
