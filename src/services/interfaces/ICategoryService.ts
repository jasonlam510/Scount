import { 
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../types/categories';
import { 
  Subcategory,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest
} from '../types/subcategories';
import { 
  Tag,
  CreateTagRequest,
  UpdateTagRequest
} from '../types/tags';
import { 
  Transaction,
  TransactionFilters
} from '../types/transactions';

export interface ICategoryService {
  // Category management
  getCategories(type?: 'expense' | 'income' | 'transfer'): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(category: CreateCategoryRequest): Promise<Category>;
  updateCategory(id: string, updates: UpdateCategoryRequest): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Subcategory management
  getSubcategories(categoryId?: string, type?: 'expense' | 'income' | 'transfer'): Promise<Subcategory[]>;
  getSubcategoryById(id: string): Promise<Subcategory | null>;
  createSubcategory(subcategory: CreateSubcategoryRequest): Promise<Subcategory>;
  updateSubcategory(id: string, updates: UpdateSubcategoryRequest): Promise<Subcategory>;
  deleteSubcategory(id: string): Promise<void>;
  
  // Tag management
  getTags(): Promise<Tag[]>;
  getTagById(id: string): Promise<Tag | null>;
  createTag(tag: CreateTagRequest): Promise<Tag>;
  updateTag(id: string, updates: UpdateTagRequest): Promise<Tag>;
  deleteTag(id: string): Promise<void>;
  
  // Category queries
  getCategoriesWithSubcategories(type?: 'expense' | 'income' | 'transfer'): Promise<(Category & { subcategories: Subcategory[] })[]>;
  searchCategories(query: string): Promise<Category[]>;
  searchSubcategories(query: string): Promise<Subcategory[]>;
  searchTags(query: string): Promise<Tag[]>;
  
  // Category analysis
  getTransactionsByCategory(categoryId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  getTransactionsBySubcategory(subcategoryId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  getTotalByCategory(filters?: TransactionFilters): Promise<{ [categoryId: string]: number }>;
  getTotalBySubcategory(filters?: TransactionFilters): Promise<{ [subcategoryId: string]: number }>;
  
  // Real-time subscriptions (for future sync)
  subscribeToCategoryChanges(callback: (categories: Category[]) => void): () => void;
  subscribeToSubcategoryChanges(callback: (subcategories: Subcategory[]) => void): () => void;
  subscribeToTagChanges(callback: (tags: Tag[]) => void): () => void;
}

