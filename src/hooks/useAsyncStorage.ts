import AsyncStorage from '@react-native-async-storage/async-storage';

// Generic storage interface
export interface StorageInterface {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
}

// Generic AsyncStorage hook
export const useAsyncStorage = (): StorageInterface => {
  const get = async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get storage key "${key}":`, error);
      return null;
    }
  };

  const set = async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set storage key "${key}":`, error);
      throw new Error(`Failed to save ${key}`);
    }
  };

  const remove = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove storage key "${key}":`, error);
      throw new Error(`Failed to remove ${key}`);
    }
  };

  const clear = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw new Error('Failed to clear storage');
    }
  };

  const getAllKeys = async (): Promise<string[]> => {
    try {
      return Array.from(await AsyncStorage.getAllKeys());
    } catch (error) {
      console.warn('Failed to get all storage keys:', error);
      return [];
    }
  };

  return {
    get,
    set,
    remove,
    clear,
    getAllKeys,
  };
}; 