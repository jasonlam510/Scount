-- Row Level Security for public.groups
ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for authenticated users only"
    ON "public"."groups"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable users to view their own data only"
    ON "public"."groups"
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = id);
