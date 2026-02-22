-- Row Level Security for public.profiles
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for users based on user_id"
    ON "public"."profiles"
    FOR INSERT
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Enable users to view their own data only"
    ON "public"."profiles"
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);
