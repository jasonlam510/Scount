export interface Group {
  id: string;
  group_id: string | null;
  created_at: string | null; // timestamptz in DB
  title: string | null;
  icon: string | null;
  currency: string | null;
  is_deleted: number | null;
  updated_at: string | null;
}
