---
description: Create blueprint.md from requirements.md (and optional UI uiux.md) by summarizing requirement gaps vs current codebase and proposing a technical design with UML/sequence/ER diagrams.
handoffs:
  - label: Create Plan
    agent: plan
    prompt: Create tasks.md (high-level) and tasks/ unit files (after approval) from requirements.md and blueprint.md
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Generate a technical blueprint (`blueprint.md`) in the active feature scope. This command sits **between** `/design` (requirements) and `/plan` (delivery plan + unit files).

`blueprint.md` MUST include:
1. **Summary of gaps** between `requirements.md` requirements and the current codebase (based on recon).
2. **Summary of the technical design** (what approach/tech is proposed) including **file paths** to create/update.
3. **UML class diagram with signatures**, a **sequence diagram**, and an **ER diagram** (if applicable).

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
   - If missing: ERROR "requirements.md not found. Run `/design` first."

2.5. **Load UI uiux.md (optional)**:
   - If `FEATURE_DIR/uiux.md` exists, read it as UI specification input.
   - If it conflicts with `requirements.md`, defer to `requirements.md` and record the conflict in gap notes.

3. **Recon (required)**:
   - Compare the requirements in `requirements.md` (and any relevant constraints from UI `uiux.md`) to the actual current codebase.
   - Goal: identify what exists, what’s missing, and the best extension points.
   - Recon is **verification only**:
     - Read relevant modules (controllers/components/services/models/tests) that relate to the feature
     - Trace current flows / entry points
     - Identify constraints, dependencies, and reuse opportunities
   - Do NOT implement changes in this command.

4. **Create blueprint.md**:
   - Location: `FEATURE_DIR/blueprint.md`
   - Keep it concise, but concrete and implementable.
   - MUST include explicit file paths for proposed changes.
   - Use Mermaid for diagrams.
   - Structure:
     ```markdown
     # Blueprint: [FeatureName]
     
     ## Requirement vs Codebase Gap (from requirements.md + recon)
     - What exists already:
       - ...
     - Gaps (missing vs requirements):
       - ...
     - Constraints / boundaries:
       - ...
     - Risks / unknowns:
       - ...
     
     ## Proposed Technical Design
     - Approach:
       - [High-level approach and why]
     - Key components / responsibilities:
       - ...
     - Data flow:
       - ...
     - Security / privacy considerations (if applicable):
       - ...
     - Performance / scalability considerations (if applicable):
       - ...
     - Errors / edge cases:
       - ...
     
     ### File Plan (create/update)
     - [new] `path/to/new_file.ext`: <what it contains>
     - [change] `path/to/existing_file.ext`: <what changes>
     
     ## UML Diagrams
     
     ### Class Diagram (with signatures)
     ```mermaid
     classDiagram
       class ExampleService {
         +call(input: InputType) OutputType
       }
     ```
     
     ### Sequence Diagram
     ```mermaid
     sequenceDiagram
       participant U as User
       participant UI as UI
       participant API as API
       participant DB as Database
       U->>UI: action()
       UI->>API: request()
       API->>DB: query/write
       DB-->>API: result
       API-->>UI: response
       UI-->>U: render
     ```
     
     ### ER Diagram (if applicable)
     ```mermaid
     erDiagram
       ENTITY_A ||--o{ ENTITY_B : relates_to
       ENTITY_A {
         uuid id PK
       }
       ENTITY_B {
         uuid id PK
         uuid entity_a_id FK
       }
     ```
     ```

5. **Present to user**:
   - Show `blueprint.md`
   - Ask for corrections: "Does this blueprint capture the intended gaps and technical approach? Any changes?"
   - Iterate until approved.

6. **After approval**:
   - Suggest: "Ready to generate the delivery plan and unit files? Run `/plan`."

## Guidelines

- **Gap-first**: Start from requirement-vs-codebase gaps; don’t jump straight to architecture.
- **Concrete file paths**: Every proposed component must map to a file create/update.
- **Diagrams must match design**: Diagrams should reflect the proposed responsibilities and flows.
- **No implementation here**: This command produces a blueprint, not code.
