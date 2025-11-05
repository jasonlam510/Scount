-- 1) Function: seed default categories and subcategories for a new auth.user
CREATE OR REPLACE FUNCTION public.on_auth_user_created_seed_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _dummy_count INTEGER;
BEGIN
  ---------------------------------------------------------------------------
  -- CATEGORIES (user_categories)
  -- Required columns in your schema:
  --   user_id, name, name_i18n (nullable), icon, type (public.type), sort_order, is_deleted
  ---------------------------------------------------------------------------
  WITH cat_defs AS (
    SELECT * FROM (VALUES
      ('F&B','餐飲','🍽️','expense',1),
      ('Shopping','購物','🛍️','expense',2),
      ('Entertainment','娛樂','🎮','expense',3),
      ('Traffic','交通','🚌','expense',4),
      ('Housing','住房','🏠','expense',5),
      ('Medical','醫療','💊','expense',6),
      ('Personal Care','個人護理','💇','expense',7),
      ('Social','社交','👥','expense',8),
      ('Other','其他','🔹','expense',9)
    ) AS t(name_en, name_zh, icon, type_txt, sort_order)
  ),
  inserted_cats AS (
    INSERT INTO public.user_categories (user_id, name, name_i18n, icon, type, sort_order)
    SELECT
      NEW.id,
      d.name_en,
      jsonb_build_object('en', d.name_en, 'zh', d.name_zh),  -- defaults include i18n; users may leave NULL for their own
      d.icon,
      d.type_txt::public.type,
      d.sort_order
    FROM cat_defs d
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.user_categories c
      WHERE c.user_id = NEW.id
        AND c.is_deleted = false
        AND lower(c.name) = lower(d.name_en)
    )
    RETURNING id, name, type, sort_order
  ),
  -- Map parent category ids by their English name (works if rows preexist or were just inserted)
  cat_map AS (
    -- Use inserted categories first (from inserted_cats CTE)
    SELECT ic.id, ic.name AS name_en, ic.type
    FROM inserted_cats ic
    
    UNION
    
    -- Also include any pre-existing categories that match our definitions
    SELECT c.id, d.name_en, c.type
    FROM cat_defs d
    JOIN public.user_categories c
      ON c.user_id = NEW.id
     AND c.is_deleted = false
     AND lower(c.name) = lower(d.name_en)
     -- Exclude categories that were just inserted (to avoid duplicates)
     WHERE NOT EXISTS (
       SELECT 1 FROM inserted_cats ic2
       WHERE ic2.id = c.id
     )
  ),
  ---------------------------------------------------------------------------
  -- SUBCATEGORIES (user_subcategories)
  -- Required columns in your schema:
  --   user_id, parent_id, name, name_i18n (nullable), icon, type (public.type), sort_order, is_deleted
  -- NOTE: "Subscription" is treated as subcategories under "Entertainment"
  ---------------------------------------------------------------------------
  inserted_subcats AS (
    INSERT INTO public.user_subcategories (user_id, parent_id, name, name_i18n, icon, type, sort_order)
  SELECT
    NEW.id,
    cm.id AS parent_id,
    s.name_en,
    jsonb_build_object('en', s.name_en, 'zh', s.name_zh),
    s.icon,
      cm.type,
    s.sort_order
  FROM (
    VALUES
      -- F&B
      ('F&B','Breakfast','早餐','🍞',1),
      ('F&B','Lunch','午餐','🍜',2),
      ('F&B','Dinner','晚餐','🍽️',3),
      ('F&B','Snack','點心','🍪',4),
      ('F&B','Drinks','飲品','☕',5),
      ('F&B','Alcohol','酒類','🍸',6),

      -- Shopping
      ('Shopping','Clothing','衣服','👕',1),
      ('Shopping','Gift','禮物','🎁',2),
      ('Shopping','Grocery','雜貨','🛒',3),
      ('Shopping','Accommodation','住宿','🏨',4),

      -- Entertainment (includes subscription-type items)
      ('Entertainment','Movie','電影','🎬',1),
      ('Entertainment','Game','遊戲','🎮',2),
      ('Entertainment','Music','音樂','🎵',3),
      ('Entertainment','Netflix','Netflix','🎬',4),
      ('Entertainment','Spotify','Spotify','🎧',5),
      ('Entertainment','iCloud','iCloud','☁️',6),
      ('Entertainment','Subscription','訂閱','💻',7),

      -- Traffic
      ('Traffic','Taxi','計程車','🚕',1),
      ('Traffic','Bus','公車','🚌',2),
      ('Traffic','Airfare','機票','✈️',3),

      -- Housing
      ('Housing','Rent','租金','🏠',1),
      ('Housing','Utility','水電','💡',2),
      ('Housing','Laundry','洗衣','🧺',3),

      -- Medical
      ('Medical','Hospital','醫院','🏥',1),
      ('Medical','Medicine','藥品','💊',2),

      -- Personal Care
      ('Personal Care','Hair','理髮','💇',1),
      ('Personal Care','Makeup','化妝','💅',2),

      -- Social
      ('Social','Party','派對','🎉',1),
      ('Social','Gathering','聚會','🍻',2),

      -- Other
      ('Other','Uncategorized','未分類','🔹',1)
  ) AS s(parent_name_en, name_en, name_zh, icon, sort_order)
  JOIN cat_map cm
    ON lower(cm.name_en) = lower(s.parent_name_en)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.user_subcategories sc
    WHERE sc.user_id = NEW.id
      AND sc.parent_id = cm.id
      AND sc.is_deleted = false
      AND lower(sc.name) = lower(s.name_en)
    )
    RETURNING id, name, sort_order
  )
  SELECT COUNT(*) INTO _dummy_count FROM inserted_subcats;

  RETURN NEW;
END;
$$;

-- 2) Trigger on auth.users
DROP TRIGGER IF EXISTS auth_users_seed_defaults_trigger ON auth.users;

CREATE TRIGGER auth_users_seed_defaults_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.on_auth_user_created_seed_defaults();
