export interface Profile {
  id: string;
  name: string;
  nickname: string;
  email: string;
  avatar?: string;
  created_at: string; // timestamptz in DB
}
