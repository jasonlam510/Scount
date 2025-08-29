// Group-related types
export interface Group {
  id: string;
  title: string;
  icon?: string;
  currency: string;
  is_archived: boolean;
  created_at: number;
  updated_at: number;
}

export interface CreateGroupRequest {
  title: string;
  icon?: string;
  currency: string;
  is_archived?: boolean;
}

export interface UpdateGroupRequest extends Partial<CreateGroupRequest> {
  id: string;
}

