import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@scount:currency_history_v1";
const MAXLEN = 9;

interface CurrencyHistoryState {
  history: string[];
  isLoaded: boolean;
}

interface CurrencyHistoryActions {
  loadFromStorage: () => Promise<void>;
  record: (code: string) => Promise<void>;
  clear: () => Promise<void>;
}

export type CurrencyHistoryStore = CurrencyHistoryState &
  CurrencyHistoryActions;

function normalize(code: string) {
  return code.trim().toUpperCase();
}

export const useCurrencyHistoryStore = create<CurrencyHistoryStore>(
  (set, get) => ({
    history: [],
    isLoaded: false,

    loadFromStorage: async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          set({ isLoaded: true });
          return;
        }
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) {
          set({ isLoaded: true });
          return;
        }
        const cleaned = parsed
          .filter((x): x is string => typeof x === "string")
          .map(normalize)
          .filter(Boolean);
        set({ history: dedupePreserveOrder(cleaned), isLoaded: true });
      } catch (error) {
        console.error("Failed to load currency history from storage:", error);
        set({ isLoaded: true });
      }
    },

    record: async (codeRaw: string) => {
      const code = normalize(codeRaw);
      if (!code) return;

      const current = get().history;
      const next = [code, ...current.filter((c) => c !== code)].slice(
        0,
        MAXLEN,
      );
      set({ history: next });

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error("Failed to save currency history to storage:", error);
      }
    },

    clear: async () => {
      set({ history: [] });
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear currency history storage:", error);
      }
    },
  }),
);

function dedupePreserveOrder(list: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}
