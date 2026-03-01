---
name: design
description: Create or update a feature requirements specification (`requirements.md`) in a scoped folder, including scope detection/creation, requirement interviews, and optional Linear screenshot context for downstream UI design work. Use when the user asks to define feature requirements, start a scoped feature spec, or refine requirement intent before technical planning.
---

# Design

Create `requirements.md` in the feature scope as the requirements-first entry point for spec-to-code.

## Purpose

Produce a concise, testable, technology-agnostic requirements spec that captures WHAT/WHY (not HOW).

## Execution Flow

1. Determine feature name and scope.
- Use PascalCase feature name (for example `UserAuthentication`).
- If creating new scope, generate timestamp with `date +%Y%m%d-%H%M%S`.
- Use folder pattern: `.cursor/scopes/{timestamp}-{FeatureName}/`.
- Set:
- `FEATURE_NAME = FeatureName`
- `FEATURE_DIR = .cursor/scopes/{timestamp}-{FeatureName}/`
- Report active scope.

2. If input includes a Linear URL or issue identifier.
- Load issue details.
- If it is a sub-issue, also load parent issue context.
- Download capscreen images from parent/sub-issue into `FEATURE_DIR/asset/`.
- Prefer stable names like `cap-1.png`, `cap-2.png`.

3. Interview only if needed.
- Capture:
- Purpose and user problem
- Success criteria (measurable)
- Scope and constraints
- Technical considerations
- Out-of-scope items

4. Create `FEATURE_DIR/requirements.md` with this structure:

```markdown
# Feature: [FeatureName]

## Purpose & User Problem

## Success Criteria

## Scope

### In Scope

### Out of Scope

## Requirements

### Functional

### Non-Functional

## Technical Considerations

## User Scenarios

## Assumptions

## Clarifications

### [Date] - [Topic]

**Misunderstanding**: ...
**Clarification**: ...
**Impact**: ...
```

5. Present and iterate.
- Ask whether requirements capture intent.
- Revise until approved.

6. After approval.
- Ensure `FEATURE_DIR/asset/` has capscreens (from Linear or user-provided).
- Hand off to UI design workflow to generate `FEATURE_DIR/uiux.md` from `requirements.md` + images.
- Recommend next step: use `blueprint` skill, then `plan`.

## Guidelines

- Requirements-first.
- Keep concise and testable.
- Prefer technology-agnostic success criteria.
