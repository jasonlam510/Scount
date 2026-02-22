import * as Localization from "expo-localization";
import { CURRENCIES_SNAPSHOT } from "@/constants/currencies";

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  emoji: string;
  searchKey: string;
};

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

export function normalizeCurrencyCode(code: string): string {
  return code.trim().toUpperCase();
}

export function sortCurrenciesAlpha(list: Currency[]): Currency[] {
  return [...list].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

export function filterCurrencies(list: Currency[], query: string): Currency[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) => c.searchKey.includes(q));
}

export async function getLocalCurrencyCode(): Promise<string> {
  const primary = Localization.getLocales()[0];

  const currencyCode = primary?.currencyCode;
  if (currencyCode) return normalizeCurrencyCode(currencyCode);

  // No currency from device: use region + country list → mapped currency, then ensure it's supported.
  const region =
    primary?.regionCode ?? getRegionFromLocaleTag(primary?.languageTag) ?? null;
  const regionAlpha2 = (region || "HK").toUpperCase();
  const codeFromRegion = getCurrencyCodeForRegion(regionAlpha2);
  if (codeFromRegion && codeFromRegion in CURRENCIES_SNAPSHOT)
    return codeFromRegion;

  return "HKD";
}

/** Parses a BCP 47 locale tag (e.g. "en-US", "zh-Hant-TW") to an alpha-2 region for currency lookup. */
function getRegionFromLocaleTag(localeTag?: string | null): string | null {
  if (!localeTag) return null;
  const parts = localeTag.split("-");
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const p = parts[i];
    if (/^[A-Za-z]{2}$/.test(p)) return p.toUpperCase();
  }
  return null;
}

function getCurrencyCodeForRegion(regionAlpha2: string): string | null {
  const hit = COUNTRY_LIST.find((c) => c.codeAlpha2 === regionAlpha2);
  const code = hit?.iso4217?.code;
  return code ? normalizeCurrencyCode(code) : null;
}

export function buildSuggestedCurrencyCodes(
  local: string,
  history: string[],
  defaults: string[],
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  const push = (codeRaw: string | null | undefined) => {
    if (!codeRaw) return;
    const code = normalizeCurrencyCode(codeRaw);
    if (seen.has(code)) return;
    seen.add(code);
    out.push(code);
  };

  push(local);
  for (const h of history) push(h);
  for (const d of defaults) push(d);

  return out;
}

export function buildSuggestions(
  allSupported: Currency[],
  suggestedCodes: string[],
): Currency[] {
  const byCode = new Map<string, Currency>();
  for (const c of allSupported) byCode.set(normalizeCurrencyCode(c.code), c);

  const suggestions: Currency[] = [];
  for (const codeRaw of suggestedCodes) {
    const code = normalizeCurrencyCode(codeRaw);
    const hit = byCode.get(code);
    if (hit) suggestions.push(hit);
  }
  return suggestions;
}

export function getCurrencySymbol(codeRaw: string): string {
  const code = normalizeCurrencyCode(codeRaw);
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);

    const currencyPart = parts.find((p) => p.type === "currency")?.value;
    return currencyPart || code;
  } catch {
    return code;
  }
}
