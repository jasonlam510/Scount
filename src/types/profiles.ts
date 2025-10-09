export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  created_at: string; // timestamptz in DB
}
