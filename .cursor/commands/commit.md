---
description: Create git commits for all completed commit units in tasks.md. One commit per completed unit.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

After all commit units in `tasks.md` are completed (marked with `Status: [X]`), this command creates git commits based on those completed units. Each completed commit unit becomes exactly one git commit with the commit subject from the unit heading.

## Execution Flow

1. **Detect active scope and feature directory**:
   - Check if user specified feature name in arguments
   - If not, look for most recent `.cursor/scopes/*/tasks.md` or `design.md`
   - Extract feature name from directory:
     - Pattern: `.cursor/scopes/{date-prefix}-{FeatureName}/` (e.g., `20251121-123456-TestCommandFeedbackLoop/`)
     - Extract `FeatureName` by removing date prefix (format: `YYYYMMDD-HHMMSS-`)
     - Example: `20251121-123456-TestCommandFeedbackLoop` → `TestCommandFeedbackLoop`
   - Set `FEATURE_NAME = FeatureName` (PascalCase)
   - Set `FEATURE_DIR = .cursor/scopes/{date-prefix}-{FeatureName}/` (use actual directory name found)
   - **Report active scope**: "Working on feature: [FeatureName]"

2. **Load tasks.md**:
   - Read `FEATURE_DIR/tasks.md`
   - Parse all commit units and their status
   - If missing: ERROR "tasks.md not found. Run `/plan` first."

3. **Verify branch context**:
   - **Check current branch**: Run `git branch --show-current` to get current branch name
   - **Extract Linear issue from branch name**:
     - Pattern: `{linear-issue}-{kebab-name}` (e.g., `EPS-909-test-command-feedback-loop`)
     - Extract `LINEAR_ISSUE` from branch name (e.g., `EPS-909`)
     - If branch doesn't match pattern: Ask user "What is the Linear issue number? (e.g., EPS-909)"
   - **Get GitHub issue number**:
     - Ask user: "What is the GitHub issue number? (e.g., #1462)"
     - Validate format: Should match pattern `#<NUMBER>` or just `<NUMBER>`
     - Store as `GITHUB_ISSUE` (e.g., `1462`)

4. **Check git status**:
   - Run `git status --porcelain` to see uncommitted changes
   - If no changes: ERROR "No uncommitted changes found. All changes may already be committed."
   - Report what files have been modified/added

5. **Find completed commit units**:
   - Parse `tasks.md` for all commit units with `Status: [X]`
   - For each completed unit:
     - Extract **COMMIT_SUBJECT**: from the unit heading (e.g., `### 1) Allow table cells to opt out of row link` → `Allow table cells to opt out of row link`)
     - Store unit number and subject
   - If no completed units found: ERROR "No completed commit units found in tasks.md. Run `/implement` first."
   - **Report**: "Found [N] completed commit unit(s) to commit"

6. **Map changes to commit units**:
   - For each completed unit, identify which files were changed based on the "Changes (Ruby pseudo code)" section
   - Match uncommitted changes to commit units:
     - Check if files in git status match files listed in unit's "Changes" section
     - If multiple units share files, ask user which unit each change belongs to
   - **If changes don't match units**:
     - Report mismatch
     - Ask user: "Some changes don't match completed units. Should I proceed with committing based on tasks.md order, or do you want to review first?"

7. **Create commits (one per completed unit)**:
   - For each completed unit in order:
     - **Stage relevant files** for this unit:
       - Use files listed in unit's "Changes" section
       - Run `git add <files>` for files that match this unit
     - **Create commit**:
       - Commit message format:

         ```
         <COMMIT_SUBJECT>

         refs <LINEAR_ISSUE> refs #<GITHUB_ISSUE>
         ```

       - Example:

         ```
         Allow table cells to opt out of row link

         refs EPS-909 refs #1462
         ```

       - Run: `git commit -m "<COMMIT_SUBJECT>" -m "" -m "refs <LINEAR_ISSUE> refs #<GITHUB_ISSUE>"`

     - **Verify commit**: `git rev-parse HEAD`
     - **Report**: "Committed: [COMMIT_SUBJECT]"

   - **Important**: If files overlap between units:
     - Stage files for first unit, commit
     - For subsequent units, only stage files that haven't been committed yet
     - If a file was changed for multiple units, it should be committed with the first unit that uses it

8. **Verify all commits created**:
   - Count commits created vs completed units
   - Report summary:
     - "Created [N] commit(s) for [N] completed unit(s)"
     - List all commit subjects
   - Show recent commits: `git log --oneline -n <N>`

9. **Handle remaining changes**:
   - Check if there are still uncommitted changes
   - If yes: Report "Remaining uncommitted changes: [list files]"
   - Ask user: "These changes don't match any completed units. Should I leave them uncommitted?"

## Guidelines

- **One commit per completed unit**: Each `Status: [X]` unit becomes exactly one commit
- **Commit subject matches unit heading**: Use the exact subject from the unit heading (without the number prefix)
- **Order matters**: Commit units in the order they appear in `tasks.md`
- **File matching**: Match uncommitted changes to units based on files listed in "Changes" sections
- **Reference format**: Always include Linear issue and GitHub issue references in commit messages

## Error Handling

- If no completed units: Stop and instruct user to run `/implement` first
- If no uncommitted changes: Stop and report that all changes may already be committed
- If changes don't match units: Ask user for guidance before proceeding
- If branch doesn't match pattern: Ask user for Linear issue number
- If commit fails: Report error and ask if should continue with next unit

## Example

Given `tasks.md` with:

- Unit 1: `Status: [X]` - "Allow table cells to opt out of row link"
- Unit 2: `Status: [X]` - "Add remove-user action column and confirmation modal"
- Unit 3: `Status: [ ]` - "Add request specs for user deletion"

This command will:

1. Create commit for Unit 1: "Allow table cells to opt out of row link"
2. Create commit for Unit 2: "Add remove-user action column and confirmation modal"
3. Skip Unit 3 (not completed)
