-- 1) Create the trigger function (security definer so it can bypass RLS when needed)
CREATE OR REPLACE FUNCTION public.on_auth_user_created_create_profile()
RETURNS trigger
LANGUAGE plpgsql
security definer set search_path = ''
AS $$
BEGIN
  -- Insert a profile for the new user. Attempt to set name from raw_user_meta_data->>'full_name'
  -- Fallback to email if no full_name is present. Avoid duplicate inserts using ON CONFLICT DO NOTHING.
  INSERT INTO public.profiles (user_id, name)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF((NEW.raw_user_meta_data ->> 'full_name')::text, ''),
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2) Create the trigger on auth.users
DROP TRIGGER IF EXISTS auth_users_create_profile_trigger ON auth.users;

CREATE TRIGGER auth_users_create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.on_auth_user_created_create_profile();