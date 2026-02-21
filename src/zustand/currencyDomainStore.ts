import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { CURRENCIES_SNAPSHOT } from "@/constants/currencies";
import {
  Currency,
  getCurrencySymbol,
  sortCurrenciesAlpha,
} from "@/utils/currency";

/** API returns code -> name; snapshot has code -> { name, flag } */
type FrankfurterEntry = string | { name: string; flag: string };
type FrankfurterCurrencies = Record<string, FrankfurterEntry>;

type CountryIso4217 = {
  currency: string;
  code: string;
  numeric: string;
  minorUnits: number;
} | null;

type CountryEntry = {
  codeAlpha2: string;
  flag: string;
  iso4217: CountryIso4217;
};

const COUNTRY_LIST =
  require("../../assets/country_list.json") as CountryEntry[];
const SNAPSHOT_DOMAIN = CURRENCIES_SNAPSHOT as FrankfurterCurrencies;

/** Flags from snapshot (code -> emoji); used when domain is API/cache (code -> name only). */
const FLAGS_FROM_SNAPSHOT = (() => {
  const m = new Map<string, string>();
  for (const [code, entry] of Object.entries(SNAPSHOT_DOMAIN)) {
    if (entry && typeof entry === "object" && "flag" in entry) {
      m.set(code.trim().toUpperCase(), (entry as { flag: string }).flag);
    }
  }
  return m;
})();

const STORAGE_KEY_DOMAIN = "@scount:currency_domain_frankfurter_v1";

interface CurrencyDomainState {
  domain: FrankfurterCurrencies | null;
  allSupported: Currency[];
  isLoading: boolean;
  error: string | null;
}

interface CurrencyDomainActions {
  bootstrap: () => Promise<void>;
  refresh: () => Promise<void>;
}

export type CurrencyDomainStore = CurrencyDomainState & CurrencyDomainActions;

export const useCurrencyDomainStore = create<CurrencyDomainStore>(
  (set, get) => ({
    domain: null,
    allSupported: [],
    isLoading: false,
    error: null,

    bootstrap: async () => {
      set({ isLoading: true, error: null });

      // 1) Load cached domain if present.
      const cached = await loadCachedDomain();
      if (cached) {
        set({
          domain: cached,
          allSupported: buildCurrencyOptions(cached),
        });
      }

      // 2) Try network fetch; if fails and no cache, fall back to snapshot.
      try {
        const fetched = await fetchFrankfurterDomain();
        await AsyncStorage.setItem(STORAGE_KEY_DOMAIN, JSON.stringify(fetched));
        set({
          domain: fetched,
          allSupported: buildCurrencyOptions(fetched),
        });
      } catch (error) {
        if (!get().domain) {
          set({
            domain: SNAPSHOT_DOMAIN,
            allSupported: buildCurrencyOptions(SNAPSHOT_DOMAIN),
          });
        }
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch currencies",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    refresh: async () => {
      set({ isLoading: true, error: null });
      try {
        const fetched = await fetchFrankfurterDomain();
        await AsyncStorage.setItem(STORAGE_KEY_DOMAIN, JSON.stringify(fetched));
        set({
          domain: fetched,
          allSupported: buildCurrencyOptions(fetched),
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to refresh currencies",
        });
      } finally {
        set({ isLoading: false });
      }
    },
  }),
);

async function loadCachedDomain(): Promise<FrankfurterCurrencies | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_DOMAIN);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as FrankfurterCurrencies;
  } catch {
    return null;
  }
}

async function fetchFrankfurterDomain(): Promise<FrankfurterCurrencies> {
  const res = await fetch("https://api.frankfurter.dev/v1/currencies");
  if (!res.ok) {
    throw new Error(`Frankfurter fetch failed: ${res.status}`);
  }
  const json = (await res.json()) as unknown;
  if (!json || typeof json !== "object") {
    throw new Error("Frankfurter returned invalid payload");
  }
  return json as FrankfurterCurrencies;
}

function buildCurrencyOptions(domain: FrankfurterCurrencies): Currency[] {
  const regionCode =
    Localization.getLocales()[0]?.regionCode?.toUpperCase() ?? null;
  const flagsByCurrency = buildFlagsByCurrency();

  const out: Currency[] = Object.entries(domain).map(([codeRaw, entry]) => {
    const code = codeRaw.trim().toUpperCase();
    const name =
      typeof entry === "string" ? entry : (entry as { name: string }).name;
    const emoji = resolveEmoji(code, entry, flagsByCurrency, regionCode);
    const symbol = getCurrencySymbol(code);
    const searchKey = `${name} ${code} ${symbol}`.toLowerCase();

    return { code, name, symbol, emoji, searchKey };
  });

  return sortCurrenciesAlpha(out);
}

function resolveEmoji(
  code: string,
  entry: FrankfurterEntry,
  flagsByCurrency: Map<string, FlagCandidate[]>,
  regionCode: string | null,
): string {
  if (entry && typeof entry === "object" && "flag" in entry) {
    return (entry as { flag: string }).flag;
  }
  const fromSnapshot = FLAGS_FROM_SNAPSHOT.get(code);
  if (fromSnapshot) return fromSnapshot;
  return pickFlag(flagsByCurrency.get(code) ?? [], regionCode);
}

type FlagCandidate = { cc: string; flag: string };

function buildFlagsByCurrency(): Map<string, FlagCandidate[]> {
  const map = new Map<string, FlagCandidate[]>();
  for (const c of COUNTRY_LIST) {
    const code = c.iso4217?.code?.trim().toUpperCase();
    if (!code) continue;

    const existing = map.get(code) ?? [];
    existing.push({ cc: c.codeAlpha2.toUpperCase(), flag: c.flag });
    map.set(code, existing);
  }
  return map;
}

function pickFlag(
  candidates: FlagCandidate[],
  regionCode: string | null,
): string {
  if (candidates.length === 0) return "🌐";
  if (regionCode) {
    const hit = candidates.find((c) => c.cc === regionCode);
    if (hit) return hit.flag;
  }
  return candidates[0].flag;
}
