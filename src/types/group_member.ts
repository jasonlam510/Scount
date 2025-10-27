export interface GroupMember {
  id: string;
  member_id: string;
  group_id: string;
  user_id: string;
  display_name: string;
  status: string;
  join_method: string;
  invite_token?: string;
  invite_expires_at?: string;
  invited_at?: string;
  joined_at?: string;
  claimed_at?: string;
  left_at?: string;
  avatar_url?: string;
  note?: string;
  updated_at: string;
}
