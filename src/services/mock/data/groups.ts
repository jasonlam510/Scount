import { Group } from '../../types/groups';

// Mock groups based on seed data
export const mockGroups: Group[] = [
  {
    id: '1',
    title: '煮飯仔',
    icon: '🍳',
    currency: 'HK$',
    is_archived: false,
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '2',
    title: 'Iceland',
    icon: '🇮🇸',
    currency: 'HK$',
    is_archived: false,
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  }
];

