---
name: blueprint
description: Generate `blueprint.md` from scoped requirements by running recon against the current codebase, summarizing requirement-vs-code gaps, proposing a technical design with concrete file paths, and producing Mermaid UML/sequence/ER diagrams. Use when requirements are ready and the user needs a technical design before task planning.
---

# Blueprint

Create technical blueprint artifacts between requirements and task planning.

## Purpose

Generate `FEATURE_DIR/blueprint.md` with:
- Requirement-vs-codebase gap summary from recon
- Proposed technical approach with explicit file create/update paths
- Mermaid class, sequence, and (if applicable) ER diagrams

## Execution Flow

1. Detect active scope.
- Use user-specified feature when provided.
- Otherwise locate latest `.cursor/scopes/*/requirements.md`.
- If ambiguous, ask which feature.
- Extract `FEATURE_NAME` from folder name after timestamp prefix.
- Set and report `FEATURE_DIR`.

2. Load `FEATURE_DIR/requirements.md`.
- If missing, stop and instruct to run design first.

3. Optionally load `FEATURE_DIR/uiux.md`.
- Use as UI input.
- If conflicting with requirements, prefer requirements and record conflicts in gap notes.

4. Perform recon (no implementation).
- Compare requirements to current code.
- Inspect relevant modules/components/services/models/tests and entry points.
- Identify existing capabilities, missing pieces, constraints, risks, and extension points.

5. Create `FEATURE_DIR/blueprint.md`:

```markdown
# Blueprint: [FeatureName]

## Requirement vs Codebase Gap (from requirements.md + recon)

- What exists already:
- Gaps (missing vs requirements):
- Constraints / boundaries:
- Risks / unknowns:

## Proposed Technical Design

- Approach:
- Key components / responsibilities:
- Data flow:
- Security / privacy considerations:
- Performance / scalability considerations:
- Errors / edge cases:

### File Plan (create/update)

- [new] `path/to/new_file.ext`: ...
- [change] `path/to/existing_file.ext`: ...

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
```
```

6. Present and iterate.
- Confirm blueprint captures gaps and approach.
- Update until approved.

7. After approval.
- Recommend next step: use `plan` skill.

## Guidelines

- Lead with verified gaps.
- Keep file plan concrete.
- Keep diagrams aligned with proposed design.
- Do not implement code in this skill.
