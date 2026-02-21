# Scount Project Memory (Index)

This folder is **repo-shared, human-maintained memory** (similar to Claude Code’s `MEMORY.md` index + topic files pattern).

## How to use this memory

- Read this file first.
- If you need more detail, open the referenced topic file.
- Keep this index **short**; move details into topic files.

## What to store here (evergreen)

- Non-obvious repo conventions, architecture “shape”, and workflows
- Known platform gotchas (iOS/Android/web differences)
- Repeatedly-used commands (dev/lint/build)
- “Don’t do X, do Y” rules that agents repeatedly miss

## What NOT to store here

- Feature-specific decisions (put those in `.cursor/scopes/<feature>/log.md` / `memory.md`)
- Long tutorials or duplicated docs (link to them instead)
- Secrets or environment values

## Entry points / reading order

- **Project conventions**: `.cursor/memory/project-conventions.md`
- **Dev commands**: `.cursor/memory/dev-commands.md`
- **Architecture notes**: `.cursor/memory/architecture.md`
- **Cross-feature dev log**: `.cursor/memory/dev-log.md`

## Current repo facts (high-signal)

- **Stack**: Expo + React Native + TypeScript, Expo Router
- **State**: Zustand; persistence uses AsyncStorage
- **Data**: PowerSync (Kysely) + Supabase auth; schema in `src/powersync/AppSchema.ts`
- **i18n**: `react-i18next`, translations in `src/i18n/locales/{en,zh}/translation.json`
- **Theme**: `useTheme()` tokens from `src/constants/colors.ts` (`colorThemes.light|dark`)
