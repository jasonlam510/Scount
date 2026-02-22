-- Auto-create a profile row when a new user is inserted into auth.users.
-- Name: from raw_user_meta_data->>'full_name', or email local part as fallback.

CREATE OR REPLACE FUNCTION public.on_auth_user_created_create_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
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

DROP TRIGGER IF EXISTS auth_users_create_profile_trigger ON auth.users;

CREATE TRIGGER auth_users_create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.on_auth_user_created_create_profile();
