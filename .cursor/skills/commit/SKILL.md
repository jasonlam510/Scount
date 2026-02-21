---
name: commit
description: Plan logical commit units from staged changes only, suggest commit titles, return the plan only, and create commits only after user approval (e.g. "ok", "please commit"). Use when the user asks to commit changes, plan/split commits, create logical commits, or use a refs footer (e.g. refs: EPS-811, #1327).
---

# Commit Planning and Splitting

When the user wants to commit **staged** changes (optionally with a footer like `refs: EPS-811, #1327`), plan logical units from the **staged set only**, suggest titles, and—**only after approval**—create commits in dependency order. Unstaged and untracked files are ignored.

## Plan only until approved

- **On the commit/plan command**: Return **only the plan** (units, titles, files, footer). Do **not** run `git add` or `git commit`. Stop after showing the plan.
- **Commits require approval**: Run `git add` / `git commit` **only** when the user has sent an **approval signal** in a later message.
- **Approval signals**: Treat as approval and then create the commits when the user says things like: "ok", "please commit", "go ahead", "approved", "yes", "do it", "execute", or equivalent.
- **Flow**: First reply = plan + “Reply with ‘ok’ or ‘please commit’ to create these commits.” After the user replies with an approval signal, create the commits and report.

## When to Apply

- User asks to "commit", "plan commits", "split into logical commits", or "change the staged changes and plan the order of commits"
- User provides a message footer (e.g. `refs: EPS-811, #1327`) to append to every commit
- User has **staged** changes and wants to commit only those (or split them into multiple commits)

## Workflow

### Phase A — Plan (run on commit/plan command; then stop)

### 1. Inspect staged changes only

- **Only consider staged files.** The user is expected to want to commit only what they've already staged. Ignore unstaged and untracked changes.
- Run `git status` and `git diff --cached --stat` (or `git diff --cached --name-only`) to see **staged** files only.
- List only the modified, added, or deleted files that appear in the staged set. If nothing is staged, report that and stop.

### 2. Unstage if re-grouping

- If the user asked to "change the current staged changes" or "plan the order" (re-group the same staged set into multiple commits), run `git reset HEAD` so you can later stage per unit. The plan still uses **only the files that were staged** before the reset.

### 3. Plan units and order

Group **only the staged files** into **commit units** in **dependency order** (things that other units depend on come first). Do not include unstaged or untracked files in the plan.

| Priority | Unit type | Typical files |
|----------|-----------|---------------|
| 1 | Shared / foundations | Concerns, base modules (no views yet) |
| 2 | Routes / config | `config/routes.rb` |
| 3 | Feature A | Controllers, layout, **partials/locals that layout uses**, **i18n used by those views/partials**, spec |
| 4 | Feature B | Controllers, layout, spec (reuse shared partials and i18n from earlier unit) |
| 5 | Docs / tooling | Storybook stories, README, etc. |

- One logical unit = one commit
- Order so that no commit depends on a later commit (e.g. concern before controllers that include it)
- **Local files with the UI that uses them**: Partials, shared views, **and i18n** must be committed in the **same unit** as the view/layout/partial that renders or uses them. Do not put partials in an earlier commit and the layout that `render`s them in a later one; do not put a form in one commit and the locale entries it uses (`t("...")`) in another — group each UI surface with all locals it uses, including **locale entries** (e.g. `config/locales/en.yml`, `zh-TC.yml` for the keys that view/partial references)

### 4. Suggest commit title per unit

- **Title**: Short, imperative, no period (e.g. "Add ChangePasswordHelpers concern", "Add admin change password")
- **Body** (optional): Bullet points for non-trivial units
- **Footer**: If the user gave one (e.g. `refs: EPS-811, #1327`), use the same footer on every commit

### 5. Show the plan, then stop

Output:

- Numbered list of units with **suggested title** and **files**
- Footer line if provided
- **Stop.** Do not run Phase B. Add: “Reply with ‘ok’ or ‘please commit’ to create these commits.”

Example:

```
| # | Suggested title                              | Files |
|---|----------------------------------------------|-------|
| 1 | Add ChangePasswordHelpers concern            | app/controllers/concerns/change_password_helpers.rb |
| 2 | Add change_password routes for users and admins | config/routes.rb |
| 3 | Add admin change password                     | admins controller, base, layout, shared partials (used by layout), i18n (used by form), spec |
...
Footer: refs: EPS-811, #1327

Reply with 'ok' or 'please commit' to create these commits.
```

**Do not run `git add` or `git commit` in Phase A.**

---

### Phase B — Execute (run only after user sends an approval signal)

When the user replies with an approval signal (“ok”, “please commit”, “go ahead”, “approved”, “yes”, “do it”, “execute”, or equivalent), then:

### 6. Create commits in order

For each unit, in order (each unit contains only files from the originally staged set):

1. `git add <files>` for that unit only (only files that were staged and assigned to this unit)
2. Build message:
   - First line: suggested title
   - Blank line
   - Optional body (bullets)
   - Blank line (if body present)
   - Footer line if user provided it (e.g. `refs: EPS-811, #1327`)
3. `git commit -m "<title>" [-m "<body>" -m "<footer>"]`  
   Use multiple `-m` for body and footer so they become separate paragraphs.

### 7. Report

- Print `git log --oneline -<N>` for the new commits
- Confirm working tree is clean or list what’s left uncommitted (e.g. untracked `.codex/`)

## Commit message format

```
<Suggested title>

[Optional body lines]

refs: EPS-811, #1327
```

- **Title**: One line, imperative, ~50 chars or less
- **Body**: Optional; use for "why" or short bullet list
- **Footer**: Exact string the user gave; one line, same on every commit

## Guidelines

- **Staged only**: Plan and commit **only** from the set of files that are currently staged. Ignore unstaged and untracked changes. The user is expected to want to commit only what they've staged. If nothing is staged, report that and stop.
- **Plan first, commit after approval**: On the commit/plan command, output only the plan and ask for approval. Run `git add` / `git commit` only when the user sends an approval signal (“ok”, “please commit”, “go ahead”, “approved”, “yes”, “do it”, “execute”).
- **One commit per unit**: Each unit is one logical change
- **Dependency order**: Foundations and shared code before features that use them
- **Local files with the UI that uses them**: Always commit partials, shared views, **and i18n** in the **same unit** as the view/layout/partial that renders or uses them. Do not split “shared partials” into an earlier commit and “layout that renders them” into a later one; do not split “form” and “locale entries that form uses” into separate commits — group each UI surface with all locals it uses (partials, locale keys). Shared partials or i18n used by more than one UI go in the unit for the **first** UI that uses them.
- **Same footer everywhere**: If the user specifies a footer, add it to every new commit in this run
- **Skip unrelated paths**: Do not commit untracked tooling (e.g. `.codex/`) unless the user asks
- **Repo root**: Run `git` from the repository root (e.g. parent of `edealer/` if that’s where the `.git` is)

## Example plan

For change-password work, a typical order (locals with the UI that uses them, including i18n):

1. **Add ChangePasswordHelpers concern** — `app/controllers/concerns/change_password_helpers.rb`
2. **Add change_password routes for users and admins** — `config/routes.rb`
3. **Add admin change password** — admins controller, base controller, layout, **shared _change_password_form and _change_password_modal** (layout uses them), **i18n** (`config/locales/en.yml`, `zh-TC.yml` for `shared.change_password_form.*` — form uses them), admin spec
4. **Add user change password** — users base controller, registrations controller, layout, spec (partials and i18n already in repo from step 3)
5. **Add change password form Storybook story** — `storybook/stories/change_password_form_stories.rb`

Footer: `refs: EPS-811, #1327`
