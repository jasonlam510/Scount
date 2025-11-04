export interface Participant {
  id: string;
  created_at: string;
  display_name: string;
  user_id: string | null;
  group_id: string | null;
}
