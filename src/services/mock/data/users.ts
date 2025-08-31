import { Profile } from '../../../types/profiles';

// Mock users based on seed data
export const mockUsers: Profile[] = [
  {
    id: '1',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Jason Lam',
    nickname: 'JJ Lam',
    email: 'jason@example.com',
    avatar: 'https://avatars.githubusercontent.com/jasonlam510',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '2',
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Shirley',
    nickname: 'Shirley',
    email: 'shirley@example.com',
    avatar: 'https://example.com/shirley-avatar.jpg',
    created_at: Date.now() - 86400000 * 25,
    updated_at: Date.now()
  },
  {
    id: '3',
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Kim Kam',
    nickname: 'Kam Kim',
    email: 'kim@example.com',
    avatar: 'https://avatars.githubusercontent.com/Strengthless',
    created_at: Date.now() - 86400000 * 20,
    updated_at: Date.now()
  }
];
