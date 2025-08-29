import { Participant } from '../../types/participants';

// Mock participants (group memberships)
export const mockParticipants: Participant[] = [
  {
    id: '1',
    group_id: '1', // 煮飯仔
    user_id: '1', // Jason
    is_active: true,
    display_name: 'JJ Lam',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '2',
    group_id: '1', // 煮飯仔
    user_id: '2', // Shirley
    is_active: true,
    display_name: 'Shirley',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '3',
    group_id: '2', // Iceland
    user_id: '1', // Jason
    is_active: true,
    display_name: 'JJ Lam',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '4',
    group_id: '2', // Iceland
    user_id: '2', // Shirley
    is_active: true,
    display_name: 'Shirley',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  }
];

