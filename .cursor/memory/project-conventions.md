# Project Conventions (Scount)

This file is the **durable “how this repo works”** reference for agents.
Primary normative rules still live in `.cursor/rules/global.mdc`—keep these aligned.

## Source-of-truth pointers

- **Global rules**: `.cursor/rules/global.mdc`
- **Feature work**: `.cursor/scopes/<feature>/` (requirements/blueprint/tasks/log/memory)

## App structure (expected)

- `src/app/`: Expo Router routes (`(tabs)`, `(auth)`)
- `src/components/`: reusable UI + feature components
- `src/hooks/`: app hooks (`useTheme`, `useI18n`, etc.)
- `src/zustand/`: stores (AsyncStorage persistence where needed)
- `src/powersync/`: schema + hooks + provider
- `src/i18n/`: i18n config + locales
- `src/constants/`: theme tokens and other constants

## Styling / UI

- Always use `useTheme()` colors (no hard-coded colors).
- Prefer platform-specific files where behavior diverges: `.web.tsx` vs `.tsx`.

## i18n

- Use `useI18n().t("...")` keys; English + Traditional Chinese.
- Add new user-facing strings to both locale files.

## Data layer

- Follow `src/powersync/AppSchema.ts` for local schema mapping.
- Prefer existing hooks in `src/powersync/hooks/` when they fit; otherwise use `db` directly for simple queries.
