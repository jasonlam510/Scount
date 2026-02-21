/**
 * Mirrors the Frankfurter API supported currencies (https://api.frankfurter.dev/v1/currencies).
 * Used as fallback when the API is unavailable and for currency display (name + flag).
 */
export type CurrencySnapshotEntry = { name: string; flag: string };
export type CurrencySnapshot = Record<string, CurrencySnapshotEntry>;

export const CURRENCIES_SNAPSHOT: CurrencySnapshot = {
  AUD: { name: "Australian Dollar", flag: "🇦🇺" },
  BRL: { name: "Brazilian Real", flag: "🇧🇷" },
  CAD: { name: "Canadian Dollar", flag: "🇨🇦" },
  CHF: { name: "Swiss Franc", flag: "🇨🇭" },
  CNY: { name: "Chinese Renminbi Yuan", flag: "🇨🇳" },
  CZK: { name: "Czech Koruna", flag: "🇨🇿" },
  DKK: { name: "Danish Krone", flag: "🇩🇰" },
  EUR: { name: "Euro", flag: "🇪🇺" },
  GBP: { name: "British Pound", flag: "🇬🇧" },
  HKD: { name: "Hong Kong Dollar", flag: "🇭🇰" },
  HUF: { name: "Hungarian Forint", flag: "🇭🇺" },
  IDR: { name: "Indonesian Rupiah", flag: "🇮🇩" },
  ILS: { name: "Israeli New Shekel", flag: "🇮🇱" },
  INR: { name: "Indian Rupee", flag: "🇮🇳" },
  ISK: { name: "Icelandic Króna", flag: "🇮🇸" },
  JPY: { name: "Japanese Yen", flag: "🇯🇵" },
  KRW: { name: "South Korean Won", flag: "🇰🇷" },
  MXN: { name: "Mexican Peso", flag: "🇲🇽" },
  MYR: { name: "Malaysian Ringgit", flag: "🇲🇾" },
  NOK: { name: "Norwegian Krone", flag: "🇳🇴" },
  NZD: { name: "New Zealand Dollar", flag: "🇳🇿" },
  PHP: { name: "Philippine Peso", flag: "🇵🇭" },
  PLN: { name: "Polish Złoty", flag: "🇵🇱" },
  RON: { name: "Romanian Leu", flag: "🇷🇴" },
  SEK: { name: "Swedish Krona", flag: "🇸🇪" },
  SGD: { name: "Singapore Dollar", flag: "🇸🇬" },
  THB: { name: "Thai Baht", flag: "🇹🇭" },
  TRY: { name: "Turkish Lira", flag: "🇹🇷" },
  USD: { name: "United States Dollar", flag: "🇺🇸" },
  ZAR: { name: "South African Rand", flag: "🇿🇦" },
};
