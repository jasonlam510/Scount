/**
 * Seed data for subcategories
 * Note: categoryId will be set dynamically based on created categories
 */
export const seedSubcategories = [
  // F&B subcategories
  {
    name: 'Breakfast',
    type: 'expense' as const,
    icon: '🍳',
    categoryName: 'F&B', // Will be used to find the category ID
  },
  {
    name: 'Lunch',
    type: 'expense' as const,
    icon: '🍽️',
    categoryName: 'F&B',
  },
  {
    name: 'Dinner',
    type: 'expense' as const,
    icon: '🍴',
    categoryName: 'F&B',
  },
  {
    name: 'Coffee',
    type: 'expense' as const,
    icon: '☕',
    categoryName: 'F&B',
  },
  
  // Transport subcategories
  {
    name: 'Taxi',
    type: 'expense' as const,
    icon: '🚕',
    categoryName: 'Transport',
  },
  {
    name: 'Uber',
    type: 'expense' as const,
    icon: '🚗',
    categoryName: 'Transport',
  },
  
  // Accommodation subcategories
  {
    name: 'Airbnb',
    type: 'expense' as const,
    icon: '🏠',
    categoryName: 'Accommodation',
  },
] 