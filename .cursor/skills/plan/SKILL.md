---
name: plan
description: Create scoped implementation task plans (`tasks.md`) from `requirements.md` with recon-first analysis, commit-sized units, acceptance signals, and optional per-unit task files (`tasks/*.md`) containing pseudo code after approval. Use when requirements (and optionally blueprint/ui specs) are ready and the user needs an executable delivery plan.
---

# Plan

Create ordered, commit-sized delivery planning artifacts in the active feature scope.

## Purpose

Generate `tasks.md` from `requirements.md` as a delivery plan (no pseudo code). After approval, generate one detailed pseudo-code file per commit unit under `tasks/`.

## Design Principles (must be enforced)

- Separation of concerns
- Encapsulation and abstraction
- Loose coupling and high cohesion
- Scalability and performance
- Resilience and fault tolerance
- Security and privacy

Record alignment/gaps in notes and adjust units if violations appear.

## Execution Flow

1. Detect active scope.
- Use explicit feature if provided.
- Otherwise select latest `.cursor/scopes/*/requirements.md`.
- Resolve ambiguity with user.
- Set `FEATURE_NAME` and `FEATURE_DIR`.

2. Load inputs.
- Required: `FEATURE_DIR/requirements.md` (stop if missing).
- Optional: `FEATURE_DIR/uiux.md`, `FEATURE_DIR/blueprint.md`.
- If conflicts exist, requirements are canonical; record conflicts.

3. Recon before planning (verification only).
- Compare requirements to actual codebase.
- Trace relevant flows/components/services/models/tests.
- Identify what exists, gaps, risks, constraints, dependencies, and design-principle fit.
- Do not implement during recon.

4. Generate `FEATURE_DIR/tasks.md`.
- Delivery plan only; no pseudo code.
- Include `## Notes & Clarifications` with recon findings.
- Build ordered commit units where each unit equals exactly one commit.
- Each unit must include:
- Commit subject draft
- Goal
- Acceptance signals
- High-level changes with file paths/intents
- Pointer to `tasks/N. <Unit Title>.md`

5. Validate plan quality.
- Requirements map to at least one acceptance signal.
- Recon findings are explicit and codebase-based.
- Commit order is dependency-safe.
- Units respect design principles and document trade-offs.

6. Present and iterate.
- Revise based on feedback.
- If misunderstandings are found, update `requirements.md` clarifications and re-sync `tasks.md`.

7. After approval.
- Create `FEATURE_DIR/tasks/`.
- Create one file per unit: `N. <Unit Title>.md` (sanitized title).
- Each unit file includes pseudo code under `## Changes (pseudo code)`.
- End by instructing next step: run `implement <N>`.

## Unit File Template

```markdown
# Unit N: <Unit Title>

- Status: [ ] (or [~], [X], [!])
- Git commit subject draft: <single line>
- Goal: <one sentence>
- Acceptance Signals:
  - ...

## Changes (pseudo code)

- [new] `path/to/new_file.ext`
```text
# pseudo code
```

- [change] `path/to/existing_file.ext`
```text
# pseudo code
```

## Notes / Gotchas

- ...
```

## Guidelines

- Keep units small and independently reviewable.
- Group localization with the implementation unit that uses it.
- Keep commit subjects imperative and clear.
