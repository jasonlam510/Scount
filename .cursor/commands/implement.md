---
description: Implement a specified unit using tasks/<N. title>.md pseudo code. After each unit is finished, run make fix-all. After all units are completed, use /commit to create git commits.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Execute implementation for **one unit** at a time.

- `tasks.md` contains the high-level plan (no pseudo code).
- Detailed implementation instructions live in `FEATURE_DIR/tasks/*.md` (Ruby pseudo code per unit).

`/implement` MUST accept an argument specifying which unit to implement (e.g. `1`, `unit 1`, or `1. <title>`). After the unit is completed, run `make fix-all`. After all units are completed, use `/commit` to create git commits.

## Execution Flow

1. **Detect active scope and feature directory**:
   - Check if user specified feature name in arguments
   - If not, look for most recent `.cursor/scopes/*/tasks.md` or `requirements.md`
   - Extract feature name from directory:
     - Pattern: `.cursor/scopes/{date-prefix}-{FeatureName}/` (e.g., `20251121-123456-TestCommandFeedbackLoop/`)
     - Extract `FeatureName` by removing date prefix (format: `YYYYMMDD-HHMMSS-`)
     - Example: `20251121-123456-TestCommandFeedbackLoop` → `TestCommandFeedbackLoop`
   - Set `FEATURE_NAME = FeatureName` (PascalCase)
   - Set `FEATURE_DIR = .cursor/scopes/{date-prefix}-{FeatureName}/` (use actual directory name found)
   - **Report active scope**: "Working on feature: [FeatureName]"

2. **Ensure correct feature branch**:
   - **Check current branch**: Run `git branch --show-current` to get current branch name
   - **Convert feature name to branch format**:
     - Convert PascalCase to kebab-case:
       - Example: `TestCommandFeedbackLoop` → `test-command-feedback-loop`
       - Pattern: Insert hyphens before capital letters, convert to lowercase
     - Check for existing branches matching pattern: `{linear-issue}-[kebab-name]`
       - Check remote: `git ls-remote --heads origin | grep -E 'refs/heads/[A-Z]+-[0-9]+-[kebab-name]$'`
       - Check local: `git branch | grep -E '^[* ]*[A-Z]+-[0-9]+-[kebab-name]$'`
     - If branch exists: Use existing branch
     - If no branch exists: **Ask user for Linear issue number**:
       - Prompt: "What is the Linear issue number for this feature? (e.g., ENG-123)"
       - Wait for user input
       - Validate format: Should match pattern `[A-Z]+-[0-9]+` (e.g., `ENG-123`, `FEAT-456`)
   - **Branch naming pattern**: `{linear-issue}-{kebab-case-name}` (e.g., `ENG-123-test-command-feedback-loop`)
   - **Checkout or create branch**:
     - If on correct branch: Continue with implementation
     - If on different branch:
       - Check if feature branch exists
       - If exists: Ask user "Currently on [current-branch]. Should I checkout [feature-branch]?"
       - If doesn't exist: Ask user "Feature branch [feature-branch] doesn't exist. Should I create it?"
     - If branch doesn't exist and user approves: Create new branch from main:
       ```bash
       git switch main
       git pull origin main
       git switch -c {linear-issue}-{kebab-name}
       ```
     - **CRITICAL**: Always ensure you're on the correct feature branch before implementing
   - **Report branch status**: 
     - "Current branch: [branch-name]"
     - "Feature branch: [feature-branch-name]"
     - "Status: [On correct branch / Need to checkout / Need to create]"

3. **Load tasks.md**:
   - Read `FEATURE_DIR/tasks.md`
   - Parse Phase 0 recon and Phase 1+ commit units (commit order)
   - If missing: ERROR "tasks.md not found. Run `/plan` first."

4. **Load unit files directory**:
   - Ensure `FEATURE_DIR/tasks/` exists
   - If missing: STOP and instruct user to approve `/plan` so unit files are generated

5. **Load requirements.md**:
   - Read `FEATURE_DIR/requirements.md` for context
   - Reference requirements when making decisions

5.5. **Load UI uiux.md (optional)**:
  - If `FEATURE_DIR/uiux.md` exists, read it as UI specification input.

6. **Verify prerequisites (CRITICAL)**:
   - Ensure recon findings exist in `tasks.md` under `## Notes & Clarifications`.
     - If missing: STOP and instruct user to run `/plan` first (recon-first planning comes before commit selection).
   - Ensure per-unit task files exist in `FEATURE_DIR/tasks/` and include "Changes (Ruby pseudo code)".
   - If missing/invalid: STOP and instruct user to re-run `/plan` and then approve it so files are created.

7. **Determine which unit to implement**:
   - Parse `$ARGUMENTS` to identify the requested unit:
     - Accept: `1`, `unit 1`, `1.`, `1. <title>`
   - Resolve the unit file path:
     - Prefer exact match: `FEATURE_DIR/tasks/1. <title>.md`
     - Otherwise match by prefix: `FEATURE_DIR/tasks/1.*.md`
   - If unit not found: ERROR "Unit [N] file not found in FEATURE_DIR/tasks/. Re-run /plan and approve to generate unit files."
   - If unit already completed in `tasks.md`: STOP and report "Unit [N] is already completed."
   - Report: "Implementing unit [N]: [unit title]"

8. **Implement the unit**:
   - **Mark unit as in progress**: Update `Status: [ ]` → `Status: [~]` in `tasks.md` (and in the unit file if it contains a status line).
   - Read the unit file in `FEATURE_DIR/tasks/` and implement directly from its **Ruby pseudo code**.
   - **CRITICAL**: Do not invent architecture mid-implementation.
    - If the pseudo code is missing, unclear, or conflicts with requirements.md: STOP and ask user to adjust `/plan` output.
   - Keep changes scoped to this unit. If additional work is needed beyond this unit:
     - STOP
    - Update `requirements.md` clarifications (if requirements changed)
     - Update `tasks.md` and/or unit files by adding/splitting units
     - Re-run `/plan`

9. **After finishing the unit**:
   - Run: `make fix-all`
   - Run tests relevant to the changes
   - Mark unit `Status: [X]` in `tasks.md` (and in the unit file if present).
   - **DO NOT commit** - user will run `/commit` after all units are completed.
   - Report: "Completed unit [N]"

10. **Next steps**:
   - If units remain: "Run `/implement <next unit number>` to continue."
   - If all units completed: "All units completed. Run `/commit` to create git commits."

9. **Handle feedback and misunderstandings**:
   - If user provides feedback or points out misunderstandings:
     - **Stop current task** if needed
     - **Acknowledge**: "I see, let me clarify: [restate understanding]"
    - **Update requirements.md**: Add clarification to "Clarifications" section
     - **Update tasks.md**: Adjust affected tasks, mark with `[!]` if blocked
     - **Confirm**: Restate corrected understanding, ask if correct
     - **Resume**: Continue with corrected understanding

10. **Progress reporting**:
   - Report progress within the current unit
   - If blocked, mark the unit `[!]` and explain what is needed

11. **Completion**:
   - Verify all commit units marked `[X]`
   - Check that implementation matches requirements.md (and uiux.md if applicable)
   - Ensure tests pass
   - Report completion with summary

## Guidelines

- **Unit selection**: Implement exactly the unit specified in `$ARGUMENTS`.
- **No commits in this command**: Use `/commit` after all units are completed
- **Pseudo-code-driven**: Follow the unit file Ruby pseudo code
- **Ask before changing scope**: If design needs changes, ask user first
- **After each unit**: Run `make fix-all`

## Error Handling

- If task fails: Report error, suggest fix, ask if should continue
- If requirements unclear: Reference requirements.md, ask user for clarification
- **If misunderstanding discovered**: Stop, clarify with user, update requirements.md and tasks.md, then resume

## Handling Misunderstandings During Implementation

When user provides feedback during implementation:

1. **Acknowledge immediately**:
   - "I understand. Let me clarify: [restate correct understanding]"

2. **Update requirements.md**:
   - Add to "Clarifications" section:
     ```markdown
     ### [Date] - [Topic]
     **Misunderstanding**: [What was misunderstood]
     **Clarification**: [Correct understanding]
     **Impact**: [What changed in implementation]
     ```

3. **Update tasks.md**:
   - Mark affected tasks with `[!]` if blocked
   - Add notes explaining the change
   - Adjust task descriptions if needed
   - Update status of tasks that need rework

4. **Update code** (if already implemented):
   - Revert or adjust code based on clarification
   - Update tests if needed
   - Document the change

5. **Confirm and resume**:
   - "Does this now match your intent? Should I continue with [next task]?"
