export interface Profile {
  id: string;
  name: string;
  nickname: string;
  email: string;
  avatar?: string;
  created_at: number;
}

export interface Group {
  id: string;
  title: string;
  icon: string;
  currency: string;
  is_archived: boolean;
  created_at: number;
  updated_at: number;
}

export interface GroupParticipant {
  id: string;
  group_id: string;
  user_id: string;
  is_active: boolean;
  display_name: string;
  created_at: number;
  updated_at: number;
}
