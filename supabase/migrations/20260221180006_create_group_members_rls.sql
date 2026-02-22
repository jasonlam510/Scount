-- Row Level Security for public.group_members
ALTER TABLE "public"."group_members" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for authenticated users only"
    ON "public"."group_members"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable users to view their own data only"
    ON "public"."group_members"
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);
