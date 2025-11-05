create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure moddatetime (updated_at);

create trigger handle_updated_at before update on public.user_categories
  for each row execute procedure moddatetime (updated_at);

create trigger handle_updated_at before update on public.user_subcategories
  for each row execute procedure moddatetime (updated_at);