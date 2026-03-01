---
name: implement
description: Implement exactly one scoped task unit from `tasks/*.md` pseudo code, update task status, run `make fix-all`, and verify tests before moving to the next unit. Use when `tasks.md` and unit files are approved and the user asks to execute a specific unit (for example `implement 1`).
---

# Implement

Execute one approved unit at a time from scoped task files.

## Purpose

Implement a specific unit selected by the user, following pseudo code in `FEATURE_DIR/tasks/*.md`, without broadening scope.

## Execution Flow

1. Detect active scope.
- Use explicit feature if provided.
- Otherwise locate latest `.cursor/scopes/*/tasks.md` or `requirements.md`.
- Extract and report `FEATURE_NAME` and `FEATURE_DIR`.

2. Ensure correct feature branch.
- Get current branch via `git branch --show-current`.
- Convert `FEATURE_NAME` PascalCase to kebab-case.
- Match branch pattern `{linear-issue}-{kebab-name}`.
- Reuse matching local/remote branch if present.
- If missing, ask user for Linear issue key (`[A-Z]+-[0-9]+`) and confirm checkout/create actions.
- Ensure branch is correct before implementation.

3. Load planning artifacts.
- Read `FEATURE_DIR/tasks.md` (required).
- Ensure `FEATURE_DIR/tasks/` exists (required).
- Read `FEATURE_DIR/requirements.md` (required context).
- Optionally read `FEATURE_DIR/uiux.md`.

4. Verify prerequisites.
- `tasks.md` includes recon notes and commit units.
- Unit files exist and include pseudo code.
- If missing/invalid, stop and request re-running `plan` and approval.

5. Resolve target unit from user input.
- Accept forms: `1`, `unit 1`, `1.`, `1. <title>`.
- Match exact or prefix file: `FEATURE_DIR/tasks/1.*.md`.
- If unit missing or already complete, stop with clear status.

6. Implement selected unit.
- Mark unit in progress (`[~]`) in `tasks.md` and unit file (if present).
- Implement directly from unit pseudo code.
- Keep scope to the unit only.
- If pseudo code conflicts with requirements or is unclear, stop and request plan correction.

7. Finish unit.
- Run `make fix-all`.
- Run relevant tests.
- Mark unit complete (`[X]`) in tracking files.
- Do not commit in this skill.

8. Report next step.
- If units remain, instruct next `implement <N>`.
- If all done, instruct to run `commit` workflow.

## Feedback Handling

When misunderstandings are identified:
- Pause current work.
- Restate corrected understanding.
- Update `requirements.md` clarifications.
- Update `tasks.md` and affected unit files (`[!]` if blocked).
- Resume only after alignment.

## Guidelines

- Implement exactly one requested unit.
- Follow pseudo code; do not redesign mid-unit.
- Ask before changing scope.
- Always run `make fix-all` after each completed unit.
