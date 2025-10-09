import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User state interface
interface UserState {
  // User identification
  currentUserUuid: string | null;
  
  // Authentication
  accessToken: string | null;
  refreshToken: string | null;
  
  // User email (from Supabase verification)
  userEmail: string | null;
}

// User actions interface
interface UserActions {
  // Authentication actions
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setCurrentUserUuid: (uuid: string | null) => void;
  
  // User email actions
  setUserEmail: (email: string | null) => void;
  
  // Session management
  login: (userData: { uuid: string; accessToken: string; refreshToken?: string; email?: string }) => void;
  logout: () => void;
  
  // Utility actions
  clearUserData: () => void;
  
  // Persistence actions
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// Combined store type
export type UserStore = UserState & UserActions;

// Default values
const DEFAULT_USER_STATE: UserState = {
  currentUserUuid: null,
  accessToken: null,
  refreshToken: null,
  userEmail: null,
};

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER_UUID: '@scount:current_user_uuid',
  ACCESS_TOKEN: '@scount:access_token',
  REFRESH_TOKEN: '@scount:refresh_token',
  USER_EMAIL: '@scount:user_email',
};

// Create the store without persist middleware
export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  ...DEFAULT_USER_STATE,
  
  // Actions
  setAccessToken: (token: string | null) => {
    set({ accessToken: token });
    get().saveToStorage();
  },
  
  setRefreshToken: (token: string | null) => {
    set({ refreshToken: token });
    get().saveToStorage();
  },
  
  setCurrentUserUuid: (uuid: string | null) => {
    set({ currentUserUuid: uuid });
    get().saveToStorage();
  },
  
  setUserEmail: (email: string | null) => {
    set({ userEmail: email });
    get().saveToStorage();
  },
  
  login: (userData: { uuid: string; accessToken: string; refreshToken?: string; email?: string }) => {
    set({
      currentUserUuid: userData.uuid,
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken || null,
      userEmail: userData.email || null,
    });
    get().saveToStorage();
  },
  
  logout: () => {
    set(DEFAULT_USER_STATE);
    get().saveToStorage();
  },
  
  clearUserData: () => {
    set(DEFAULT_USER_STATE);
    get().saveToStorage();
  },
  
  // Persistence actions
  loadFromStorage: async () => {
    try {
      const [uuid, accessToken, refreshToken, email] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_UUID),
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL),
      ]);
      
      const updates: Partial<UserState> = {};
      
      if (uuid) updates.currentUserUuid = uuid;
      if (accessToken) updates.accessToken = accessToken;
      if (refreshToken) updates.refreshToken = refreshToken;
      if (email) updates.userEmail = email;
      
      if (Object.keys(updates).length > 0) {
        set(updates);
      }
    } catch (error) {
      console.error('Failed to load user data from storage:', error);
    }
  },
  
  saveToStorage: async () => {
    try {
      const state = get();
      await Promise.all([
        state.currentUserUuid ? AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_UUID, state.currentUserUuid) : AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_UUID),
        state.accessToken ? AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, state.accessToken) : AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        state.refreshToken ? AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken) : AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        state.userEmail ? AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, state.userEmail) : AsyncStorage.removeItem(STORAGE_KEYS.USER_EMAIL),
      ]);
    } catch (error) {
      console.error('Failed to save user data to storage:', error);
    }
  },
}));
