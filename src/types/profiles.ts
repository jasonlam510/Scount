export interface Profile {
  user_id: string;
  name: string;
  avatar?: string;
  created_at: string; // timestamptz in DB
}
