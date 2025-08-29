import { Subcategory } from '../../types/subcategories';

// Mock subcategories based on seed data
export const mockSubcategories: Subcategory[] = [
  // F&B subcategories
  {
    id: '1',
    category_id: '1', // F&B
    name: 'Breakfast',
    type: 'expense',
    icon: '🍳',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '2',
    category_id: '1', // F&B
    name: 'Lunch',
    type: 'expense',
    icon: '🍽️',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '3',
    category_id: '1', // F&B
    name: 'Dinner',
    type: 'expense',
    icon: '🍴',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '4',
    category_id: '1', // F&B
    name: 'Coffee',
    type: 'expense',
    icon: '☕',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  
  // Transport subcategories
  {
    id: '5',
    category_id: '2', // Transport
    name: 'Taxi',
    type: 'expense',
    icon: '🚕',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  {
    id: '6',
    category_id: '2', // Transport
    name: 'Uber',
    type: 'expense',
    icon: '🚗',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  },
  
  // Accommodation subcategories
  {
    id: '7',
    category_id: '3', // Accommodation
    name: 'Airbnb',
    type: 'expense',
    icon: '🏠',
    created_at: Date.now() - 86400000 * 30,
    updated_at: Date.now()
  }
];

