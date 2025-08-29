import { Tag } from '../../types/tags';

// Mock tags based on seed data
export const mockTags: Tag[] = [
  {
    id: '1',
    name: 'gf',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  }
];

