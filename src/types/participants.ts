export interface GroupParticipant {
  id: string;
  group_id: string;
  user_id: string;
  display_name: string;
  created_at: string; // timestamptz in DB
}
