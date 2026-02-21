# Architecture Notes (Scount)

## Navigation

- Expo Router entry: `src/app/_layout.tsx`
- Tabs: `src/app/(tabs)/_layout.tsx`

## Theme

- `useTheme()` in `src/hooks/useTheme.tsx`
- Theme tokens in `src/constants/colors.ts`

## i18n

- `useI18n()` in `src/hooks/useI18n.ts`
- Translation files: `src/i18n/locales/en/translation.json`, `src/i18n/locales/zh/translation.json`

## Offline-first data

- PowerSync schema: `src/powersync/AppSchema.ts`
- Example hook: `src/powersync/hooks/useUserGroups.ts`
