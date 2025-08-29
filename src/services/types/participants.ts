// Participant-related types (Group Membership)
export interface Participant {
  id: string;
  group_id: string;
  user_id: string;
  is_active: boolean;
  display_name?: string;
  created_at: number;
  updated_at: number;
}

export interface CreateParticipantRequest {
  group_id: string;
  user_id: string;
  is_active?: boolean;
  display_name?: string;
}

export interface UpdateParticipantRequest extends Partial<CreateParticipantRequest> {
  id: string;
}

