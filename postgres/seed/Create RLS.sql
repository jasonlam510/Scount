-- ============================================================================
-- PROFILES
-- ============================================================================
create policy "Enable users to view their own data only"
on "public"."profiles"
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "Enable insert for users based on user_id"
on "public"."profiles"
for insert with check (
  (select auth.uid()) = user_id
);
-- ============================================================================
-- USER CATEGORIES
-- ============================================================================
create policy "Enable users to view their own data only"
on "public"."user_categories"
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "Enable insert for users based on user_id"
on "public"."user_categories"
for insert with check (
  (select auth.uid()) = user_id
);

-- ============================================================================
-- USER SUBCATEGORIES
-- ============================================================================
create policy "Enable users to view their own data only"
on "public"."user_subcategories"
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "Enable insert for users based on user_id"
on "public"."user_subcategories"
for insert with check (
  (select auth.uid()) = user_id
);  