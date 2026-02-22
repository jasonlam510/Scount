-- Allow users to update their own profile
CREATE POLICY "Enable users to update their own profile"
    ON "public"."profiles"
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);
