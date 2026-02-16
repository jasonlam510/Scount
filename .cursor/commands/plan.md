---
description: Create tasks.md from requirements.md (no pseudo code). After user approval, create per-unit task markdown files under tasks/ with detailed Ruby pseudo code.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Generate `tasks.md` from `requirements.md` in the active feature scope. `tasks.md` is an **ordered delivery plan** (no pseudo code).

`tasks.md` MUST separate:
- **Recon findings** (recorded in `## Notes & Clarifications`)
- **Commit Units** where **each unit equals exactly one git commit**.

**CRITICAL**: `/plan` MUST perform recon first. The commit list (Phase 1+) must be based on verified findings from the existing codebase, not assumptions.

After the user approves the plan (e.g. "ok", "please create task(s)"), `/plan` MUST create a `tasks/` directory in the feature scope and generate **one markdown file per unit**. Those per-unit files contain the detailed **Ruby pseudo code** for implementation.

## System design principles

When doing technical design (interpreting requirements.md, recon, and generating commit units), the agent **MUST** ensure the design and task breakdown align with these principles:

- **Separation of Concerns**: Distinct responsibilities (e.g. model vs controller vs view/service) are not mixed; each layer has a clear boundary.
- **Encapsulation and Abstraction**: Internal details are hidden behind clear interfaces; callers depend on contracts, not implementation.
- **Loose Coupling and High Cohesion**: Components depend minimally on each other; each module has a single, well-defined purpose.
- **Scalability and Performance**: Design allows growth (data, traffic, features) without rework; bottlenecks and N+1/blocking paths are avoided where relevant.
- **Resilience and Fault Tolerance**: Failures are contained; retries, fallbacks, or clear error handling are considered where the design touches external or critical paths.
- **Security and Privacy**: Data access, auth, and sensitive flows follow least-privilege and safe-by-default; no design choice weakens security.

**During planning**: Check requirements.md (and uiux.md / blueprint.md if present) and the proposed commit units against these principles. Record alignment or gaps in `## Notes & Clarifications` (e.g. “Design principles: …”) and adjust the task breakdown if the design would violate them.

## Execution Flow

1. **Detect active scope and feature directory**:
   - Check if user specified feature name in arguments
   - If not, look for most recent `.cursor/scopes/*/requirements.md`
   - If multiple exist, ask user which feature
   - Extract feature name from directory:
     - Pattern: `.cursor/scopes/{date-prefix}-{FeatureName}/` (e.g., `20251121-123456-TestCommandFeedbackLoop/`)
     - Extract `FeatureName` by removing date prefix (format: `YYYYMMDD-HHMMSS-`)
     - Example: `20251121-123456-TestCommandFeedbackLoop` → `TestCommandFeedbackLoop`
   - Set `FEATURE_NAME = FeatureName` (PascalCase)
   - Set `FEATURE_DIR = .cursor/scopes/{date-prefix}-{FeatureName}/` (use actual directory name found)
   - **Report active scope**: "Working on feature: [FeatureName]"

2. **Load requirements.md**:
   - Read `FEATURE_DIR/requirements.md`
   - Extract: requirements, success criteria, user scenarios, technical considerations
   - If missing: ERROR "requirements.md not found. Run `/design` first."
   - **Design principles check**: Verify the described design aligns with the six system design principles (see above). Note any misalignment or risk in recon; these will be captured in `## Notes & Clarifications`.

2.5. **Load UI uiux.md (optional)**:
   - If `FEATURE_DIR/uiux.md` exists, read it as UI specification input.
   - If it conflicts with `requirements.md`, defer to `requirements.md` requirements and record the conflict in recon notes.

2.75. **Load blueprint.md (optional)**:
   - If `FEATURE_DIR/blueprint.md` exists, read it.
   - Treat it as an additional input that can refine technical approach and file plan.
   - If it conflicts with `requirements.md`, defer to `requirements.md` requirements and record the conflict in recon notes.

3. **Recon (do this BEFORE deciding commits)**:
   - Think like a senior engineer: **compare the requirements vs the current codebase** and identify the true gaps.
   - Goal: understand the existing code, patterns, constraints, and reuse opportunities so the commit plan is real.
   - Recon is **verification only**:
     - Read relevant controllers/models/components/services/specs
     - Trace current flows
     - Identify extension points, constraints, and gotchas
   - **Do NOT** implement or change application behavior during recon.
   - Capture outputs of recon in `tasks.md` under `## Notes & Clarifications` as short bullets (recon is NOT a phase in tasks.md):
     - “What exists already (relevant entry points / components / patterns)”
     - “Design gaps (what’s missing vs requirements.md)”
     - “Risks / unknowns / dependencies”
     - “Constraints / boundaries” (still not HOW; just guardrails)
     - “Design principles”: Where the design or existing code aligns or conflicts with separation of concerns, encapsulation, loose coupling, scalability, resilience, security (flag violations or gaps).

4. **Generate tasks.md**:
   - Location: `FEATURE_DIR/tasks.md`
   - **Hard rules**:
     - `tasks.md` is a **delivery plan** only (commit order, goals, acceptance signals, and a high-level change list).
     - `tasks.md` MUST NOT include pseudo code.
     - Recon is performed by `/plan` and recorded in Notes; it is not a phase in tasks.md.
     - Tasks are commit units only, and **each unit equals exactly one git commit**.
     - Each unit MUST include:
       - **Commit subject draft** (single-line git subject)
       - **Goal**
       - **Acceptance Signals** (how we know this commit is correct)
       - **Changes (high-level)** as bullet sub-points (no pseudo code), ideally mentioning file paths and intent
       - A pointer to the unit detail file that will be created after approval (in `tasks/`)

   - Structure template:
     ```markdown
     # Tasks: [FeatureName]
     
     ## Status Legend
     - [ ] Not Started
     - [~] In Progress
     - [X] Completed
     - [!] Blocked/Needs Clarification
     
     ## Notes & Clarifications
     - [Recon findings + clarifications. Keep as bullets.]
     - What exists already:
       - ...
    - Design gaps (missing vs requirements.md):
       - ...
     - Risks / unknowns:
       - ...
     - Design principles: [Alignment or gaps vs separation of concerns, encapsulation, loose coupling, scalability, resilience, security.]
     
     ## Commit Units (each unit == exactly 1 git commit)
     
     ### 1) <Git commit subject draft>
     - Status: [ ]
     - Goal: <one sentence>
     - Acceptance Signals:
       - <signal tied to design requirements>
     - Changes (high-level):
       - [new] `path/to/new_file.ext`: <what it contains>
         - <sub-point describing behavior>
       - [change] `path/to/existing_file.ext`: <what changes>
         - <sub-point describing behavior>
     - Unit details: `tasks/1. <Unit Title>.md`
     
     ### 2) <Git commit subject draft>
     - Status: [ ]
     - Goal: ...
     - Acceptance Signals:
       - ...
     - Changes (high-level):
       - ...
     - Unit details: `tasks/2. <Unit Title>.md`
     
     ...
     ```

   - Planning guidance:
     - Prefer smallest safe commit units that can be reviewed independently.
     - Keep commit subjects readable and imperative (no semantic prefixes).
     - Ensure commit units and pseudo code respect system design principles: boundaries (SoC), clear interfaces (encapsulation), minimal cross-module coupling, scalability/resilience/security where the feature touches them.
     - If a unit would require multiple commits, split it here (do not rely on “commit frequently” later).

5. **Validate completeness**:
   - Each requirements.md requirement maps to at least one commit unit acceptance signal (or recon finding that gates it)
   - Recon findings are recorded in `## Notes & Clarifications` and reflect actual codebase review
   - Commit units are in a sensible commit order
   - Each unit has: commit subject, goal, acceptance signals, and high-level change bullets
   - **Design principles**: The design and commit units align with the six system design principles; any known violations or trade-offs are documented in Notes & Clarifications.

6. **Present to user**:
   - Show tasks.md structure
   - Ask: "Does this task breakdown look complete? Any changes needed?"
   - **Handle feedback**: If user points out misunderstandings:
     - Update requirements.md with clarifications (add to "Clarifications" section)
     - Update tasks.md accordingly
     - Document the misunderstanding and resolution
   - Iterate until approved

7. **After approval**:
   - Create directory: `FEATURE_DIR/tasks/`
   - Create **one markdown file per unit**:
     - File name format: `N. {unit title}.md` (example: `1. Add selectors to summary view.md`)
     - Sanitize title for filesystem safety (avoid `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`)
   - Each per-unit file MUST include the detailed **Ruby pseudo code** (implementation detail lives here, not in `tasks.md`).
   - End with: "Unit files created. Next: run `/implement <unit>` (e.g. `/implement 1`)."

## Per-Unit Task File Template (in tasks/)

Each unit file (e.g. `FEATURE_DIR/tasks/1. <Unit Title>.md`) MUST follow this template:

```markdown
# Unit 1: <Unit Title>

- Status: [ ]  (use [~] in progress, [X] completed, [!] blocked)
- Git commit subject draft: <single line>
- Goal: <one sentence>
- Acceptance Signals:
  - ...

## Changes (Ruby pseudo code)
- [new] `path/to/new_file.rb`
  ```ruby
  # pseudo code explaining approach, logic flow, and data structures
  ```
- [change] `path/to/existing_file.rb`
  ```ruby
  # pseudo code
  ```

## Notes / Gotchas
- ...
```

## Handling Misunderstandings & Feedback

When user provides feedback during planning:

1. **Acknowledge the misunderstanding**:
   - "I see, let me clarify: [restate understanding]"

2. **Update requirements.md**:
   - Add a "Clarifications" section if it doesn't exist:
     ```markdown
     ## Clarifications
     
     ### [Date] - [Topic]
     **Misunderstanding**: [What was misunderstood]
     **Clarification**: [Correct understanding]
     **Impact**: [What changed in tasks/requirements]
     ```

3. **Update tasks.md**:
   - Adjust affected tasks
   - Add notes explaining the change
   - Mark any tasks that need re-evaluation

4. **Confirm understanding**:
   - Restate the corrected understanding
   - Ask: "Does this now match your intent?"

## Guidelines

- **Dependency-aware**: Order tasks correctly
- **Commit-shaped**: Each commit unit is exactly one commit with a clear goal
- **Pseudo only**: Limit implementation detail to the Ruby pseudo code blocks
- **Traceable**: Acceptance signals must tie back to requirements.md requirements
- **Principles-aligned**: Technical design and task breakdown must align with the six system design principles; flag and document any trade-offs or violations