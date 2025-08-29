import { ICategoryService } from '../../interfaces/ICategoryService';
import { 
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../../types/categories';
import { 
  Subcategory,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest
} from '../../types/subcategories';
import { 
  Tag,
  CreateTagRequest,
  UpdateTagRequest
} from '../../types/tags';
import { 
  Transaction,
  TransactionFilters
} from '../../types/transactions';
import { mockCategories } from '../data/categories';
import { mockSubcategories } from '../data/subcategories';
import { mockTags } from '../data/tags';
import { mockTransactions } from '../data/transactions';

export class MockCategoryService implements ICategoryService {
  private categories: Category[] = [...mockCategories];
  private subcategories: Subcategory[] = [...mockSubcategories];
  private tags: Tag[] = [...mockTags];
  
  private categoryListeners: ((categories: Category[]) => void)[] = [];
  private subcategoryListeners: ((subcategories: Subcategory[]) => void)[] = [];
  private tagListeners: ((tags: Tag[]) => void)[] = [];

  constructor() {
    console.log(`MockCategoryService initialized with ${this.categories.length} categories, ${this.subcategories.length} subcategories, ${this.tags.length} tags`);
  }

  // Category management
  async getCategories(type?: 'expense' | 'income' | 'transfer'): Promise<Category[]> {
    await this.simulateDelay();
    if (type) {
      return this.categories.filter(c => c.type === type);
    }
    return [...this.categories];
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await this.simulateDelay();
    return this.categories.find(c => c.id === id) || null;
  }

  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    await this.simulateDelay();
    const newCategory: Category = {
      id: this.generateId(),
      ...category,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.categories.push(newCategory);
    this.notifyCategoryListeners();
    return newCategory;
  }

  async updateCategory(id: string, updates: UpdateCategoryRequest): Promise<Category> {
    await this.simulateDelay();
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    this.categories[index] = { 
      ...this.categories[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifyCategoryListeners();
    return this.categories[index];
  }

  async deleteCategory(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    this.categories.splice(index, 1);
    // Also remove subcategories
    this.subcategories = this.subcategories.filter(s => s.category_id !== id);
    
    this.notifyCategoryListeners();
    this.notifySubcategoryListeners();
  }

  // Subcategory management
  async getSubcategories(categoryId?: string, type?: 'expense' | 'income' | 'transfer'): Promise<Subcategory[]> {
    await this.simulateDelay();
    let filtered = this.subcategories;
    
    if (categoryId) {
      filtered = filtered.filter(s => s.category_id === categoryId);
    }
    
    if (type) {
      filtered = filtered.filter(s => s.type === type);
    }
    
    return filtered;
  }

  async getSubcategoryById(id: string): Promise<Subcategory | null> {
    await this.simulateDelay();
    return this.subcategories.find(s => s.id === id) || null;
  }

  async createSubcategory(subcategory: CreateSubcategoryRequest): Promise<Subcategory> {
    await this.simulateDelay();
    const newSubcategory: Subcategory = {
      id: this.generateId(),
      ...subcategory,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.subcategories.push(newSubcategory);
    this.notifySubcategoryListeners();
    return newSubcategory;
  }

  async updateSubcategory(id: string, updates: UpdateSubcategoryRequest): Promise<Subcategory> {
    await this.simulateDelay();
    const index = this.subcategories.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Subcategory not found');
    
    this.subcategories[index] = { 
      ...this.subcategories[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifySubcategoryListeners();
    return this.subcategories[index];
  }

  async deleteSubcategory(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.subcategories.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Subcategory not found');
    
    this.subcategories.splice(index, 1);
    this.notifySubcategoryListeners();
  }

  // Tag management
  async getTags(): Promise<Tag[]> {
    await this.simulateDelay();
    return [...this.tags];
  }

  async getTagById(id: string): Promise<Tag | null> {
    await this.simulateDelay();
    return this.tags.find(t => t.id === id) || null;
  }

  async createTag(tag: CreateTagRequest): Promise<Tag> {
    await this.simulateDelay();
    const newTag: Tag = {
      id: this.generateId(),
      ...tag,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    this.tags.push(newTag);
    this.notifyTagListeners();
    return newTag;
  }

  async updateTag(id: string, updates: UpdateTagRequest): Promise<Tag> {
    await this.simulateDelay();
    const index = this.tags.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tag not found');
    
    this.tags[index] = { 
      ...this.tags[index], 
      ...updates,
      updated_at: Date.now()
    };
    
    this.notifyTagListeners();
    return this.tags[index];
  }

  async deleteTag(id: string): Promise<void> {
    await this.simulateDelay();
    const index = this.tags.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tag not found');
    
    this.tags.splice(index, 1);
    this.notifyTagListeners();
  }

  // Category queries
  async getCategoriesWithSubcategories(type?: 'expense' | 'income' | 'transfer'): Promise<(Category & { subcategories: Subcategory[] })[]> {
    await this.simulateDelay();
    const categories = await this.getCategories(type);
    
    return categories.map(category => ({
      ...category,
      subcategories: this.subcategories.filter(s => s.category_id === category.id)
    }));
  }

  async searchCategories(query: string): Promise<Category[]> {
    await this.simulateDelay();
    const lowercaseQuery = query.toLowerCase();
    return this.categories.filter(c => 
      c.name.toLowerCase().includes(lowercaseQuery) ||
      c.type.toLowerCase().includes(lowercaseQuery)
    );
  }

  async searchSubcategories(query: string): Promise<Subcategory[]> {
    await this.simulateDelay();
    const lowercaseQuery = query.toLowerCase();
    return this.subcategories.filter(s => 
      s.name.toLowerCase().includes(lowercaseQuery) ||
      s.type.toLowerCase().includes(lowercaseQuery)
    );
  }

  async searchTags(query: string): Promise<Tag[]> {
    await this.simulateDelay();
    const lowercaseQuery = query.toLowerCase();
    return this.tags.filter(t => 
      t.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Category analysis
  async getTransactionsByCategory(categoryId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    const subcategoryIds = this.subcategories
      .filter(s => s.category_id === categoryId)
      .map(s => s.id);
    
    let filtered = mockTransactions.filter(t => 
      subcategoryIds.includes(t.subcategory_id || '')
    );
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.is_personal !== undefined) {
        filtered = filtered.filter(t => t.is_personal === filters.is_personal);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
    }
    
    return filtered;
  }

  async getTransactionsBySubcategory(subcategoryId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    await this.simulateDelay();
    let filtered = mockTransactions.filter(t => t.subcategory_id === subcategoryId);
    
    if (filters) {
      if (filters.group_id !== undefined) {
        filtered = filtered.filter(t => t.group_id === filters.group_id);
      }
      if (filters.is_personal !== undefined) {
        filtered = filtered.filter(t => t.is_personal === filters.is_personal);
      }
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
    }
    
    return filtered;
  }

  async getTotalByCategory(filters?: TransactionFilters): Promise<{ [categoryId: string]: number }> {
    await this.simulateDelay();
    const totals: { [categoryId: string]: number } = {};
    
    this.categories.forEach(category => {
      const subcategoryIds = this.subcategories
        .filter(s => s.category_id === category.id)
        .map(s => s.id);
      
      let filtered = mockTransactions.filter(t => 
        subcategoryIds.includes(t.subcategory_id || '')
      );
      
      if (filters) {
        if (filters.group_id !== undefined) {
          filtered = filtered.filter(t => t.group_id === filters.group_id);
        }
        if (filters.is_personal !== undefined) {
          filtered = filtered.filter(t => t.is_personal === filters.is_personal);
        }
        if (filters.type) {
          filtered = filtered.filter(t => t.type === filters.type);
        }
      }
      
      totals[category.id] = filtered.reduce((sum, t) => sum + t.amount, 0);
    });
    
    return totals;
  }

  async getTotalBySubcategory(filters?: TransactionFilters): Promise<{ [subcategoryId: string]: number }> {
    await this.simulateDelay();
    const totals: { [subcategoryId: string]: number } = {};
    
    this.subcategories.forEach(subcategory => {
      let filtered = mockTransactions.filter(t => t.subcategory_id === subcategory.id);
      
      if (filters) {
        if (filters.group_id !== undefined) {
          filtered = filtered.filter(t => t.group_id === filters.group_id);
        }
        if (filters.is_personal !== undefined) {
          filtered = filtered.filter(t => t.is_personal === filters.is_personal);
        }
        if (filters.type) {
          filtered = filtered.filter(t => t.type === filters.type);
        }
      }
      
      totals[subcategory.id] = filtered.reduce((sum, t) => sum + t.amount, 0);
    });
    
    return totals;
  }

  // Real-time subscriptions (for future sync)
  subscribeToCategoryChanges(callback: (categories: Category[]) => void): () => void {
    this.categoryListeners.push(callback);
    
    // Initial call
    callback([...this.categories]);
    
    return () => {
      const index = this.categoryListeners.indexOf(callback);
      if (index > -1) {
        this.categoryListeners.splice(index, 1);
      }
    };
  }

  subscribeToSubcategoryChanges(callback: (subcategories: Subcategory[]) => void): () => void {
    this.subcategoryListeners.push(callback);
    
    // Initial call
    callback([...this.subcategories]);
    
    return () => {
      const index = this.subcategoryListeners.indexOf(callback);
      if (index > -1) {
        this.subcategoryListeners.splice(index, 1);
      }
    };
  }

  subscribeToTagChanges(callback: (tags: Tag[]) => void): () => void {
    this.tagListeners.push(callback);
    
    // Initial call
    callback([...this.tags]);
    
    return () => {
      const index = this.tagListeners.indexOf(callback);
      if (index > -1) {
        this.tagListeners.splice(index, 1);
      }
    };
  }

  private notifyCategoryListeners(): void {
    this.categoryListeners.forEach(callback => callback([...this.categories]));
  }

  private notifySubcategoryListeners(): void {
    this.subcategoryListeners.forEach(callback => callback([...this.subcategories]));
  }

  private notifyTagListeners(): void {
    this.tagListeners.forEach(callback => callback([...this.tags]));
  }

  private generateId(): string {
    return `mock_category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateDelay(ms: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}

