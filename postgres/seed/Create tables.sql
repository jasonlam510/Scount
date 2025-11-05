-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE scope AS ENUM ('user', 'group');
CREATE TYPE type AS ENUM ('income', 'expense');

-- ============================================================================
-- PROFILES
-- ============================================================================
create table public.profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,

  name text not null,
  avatar text null,
  created_at timestamp with time zone default now() null,
  updated_at timestamp with time zone default now() null,

  constraint profiles_pkey primary key (user_id),
  constraint profiles_id_key unique (id),
  constraint profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

--- ============================================================================
-- USER CATEGORIES
-- ============================================================================
create table public.user_categories (
  id uuid not null default gen_random_uuid (),
  user_id uuid null default auth.uid (),

  name text not null,
  name_i18n jsonb null,
  icon text not null,
  type public.type not null,
  sort_order integer not null,
  is_deleted boolean null default false,
  created_at timestamp with time zone null default now() null,
  updated_at timestamp with time zone null default now() null,
  
  constraint user_categories_pkey primary key (id),
  constraint user_categories_id_user_id_key unique (id, user_id),
  constraint user_categories_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create unique INDEX IF not exists user_categories_user_id_lower_idx on public.user_categories using btree (user_id, lower(name)) TABLESPACE pg_default
where
  (is_deleted = false);

-- ============================================================================
-- USER SUBCATEGORIES
-- ============================================================================
create table public.user_subcategories (
  id uuid not null default gen_random_uuid (),
  user_id uuid null default auth.uid (),
  parent_id uuid not null,

  name text not null,
  name_i18n jsonb null,
  icon text not null,
  type public.type not null,
  sort_order integer not null,
  is_deleted boolean null default false,
  created_at timestamp with time zone null default now() null,
  updated_at timestamp with time zone null default now() null,
  
  constraint user_subcategories_pkey primary key (id),
  constraint user_subcategories_id_user_id_key unique (id, user_id),
  constraint fk_sub_parent_same_user foreign KEY (parent_id, user_id) references user_categories (id, user_id) on delete CASCADE,
  constraint user_subcategories_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create unique INDEX IF not exists user_subcategories_user_id_parent_id_lower_idx on public.user_subcategories using btree (user_id, parent_id, lower(name)) TABLESPACE pg_default
where
  (is_deleted = false);

