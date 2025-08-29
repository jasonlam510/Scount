// Tag-related types
export interface Tag {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest extends Partial<CreateTagRequest> {
  id: string;
}

