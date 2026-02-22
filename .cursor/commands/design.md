---
description: Create or update requirements.md in feature scope. If a Linear link is provided, load parent issue context and download capscreen(s) into asset/. After approval, hand off to ui agent to generate uiux.md in the same scope.
handoffs:
  - label: Create UI Design
    agent: ui
    prompt: Generate uiux.md (UI spec) from requirements.md and capscreen image(s) in FEATURE_DIR/asset/
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Create a requirements specification (`requirements.md`) in the feature scope folder following the spec-to-code workflow. This replaces asking "Should I create a Spec?" - this command IS the requirements creation.

## Execution Flow

1. **Determine feature name and scope**:
   - Extract from user input or ask if unclear
   - Use PascalCase (e.g., "UserAuthentication", "InvoiceProcessing")
   - **Generate date prefix**: Use format `YYYYMMDD-HHMMSS` (e.g., `20251121-123456`)
     - Get current date/time: `date +%Y%m%d-%H%M%S`
   - Create directory: `.cursor/scopes/{date-prefix}-{FeatureName}/`
     - Example: `.cursor/scopes/20251121-123456-UserAuthentication/`
   - Set `FEATURE_NAME = FeatureName` (PascalCase)
   - Set `FEATURE_DIR = .cursor/scopes/{date-prefix}-{FeatureName}/`
   - **Report active scope**: "Creating feature: [FeatureName] in [FEATURE_DIR]"

2. **If user provided a Linear link / issue**:
   - If `$ARGUMENTS` includes a Linear URL or issue identifier:
     - Load the issue details from Linear.
     - If it is a **sub-issue**, also load the **parent issue** for additional context.
     - The **parent issue** is the canonical place to look for UI design capscreen(s).
   - Download capscreen image(s) (from parent issue + sub-issue):
     - Create directory: `FEATURE_DIR/asset/`
     - Save images into `FEATURE_DIR/asset/` (local files in the feature folder)
     - Prefer stable names:
       - `asset/cap-1.png`, `asset/cap-2.png`, ...
     - If images have meaningful names, keep them but sanitize for filesystem safety.
   - These images are inputs for the `ui` agent (it should base `uiux.md` on them).

3. **Interview user** (if needed):
   - Purpose & user problem
   - Success criteria (measurable, technology-agnostic)
   - Scope & constraints
   - Technical considerations
   - Out of scope items
   - Only ask critical questions

4. **Create requirements.md**:
   - Location: `FEATURE_DIR/requirements.md` (e.g., `.cursor/scopes/20251121-123456-FeatureName/requirements.md`)
   - Structure:

     ```markdown
     # Feature: [FeatureName]

     ## Purpose & User Problem

     [What problem does this solve?]

     ## Success Criteria

     [Measurable, technology-agnostic outcomes]

     ## Scope

     ### In Scope

     - [What's included]

     ### Out of Scope

     - [What's explicitly excluded]

     ## Requirements

     ### Functional

     - [Testable requirements]

     ### Non-Functional

     - [Performance, security, etc.]

     ## Technical Considerations

     - [Constraints, dependencies, integrations]

     ## User Scenarios

     - [Primary user flows]

     ## Assumptions

     - [Documented assumptions]

     ## Clarifications

     [Added during planning/implementation when misunderstandings are resolved]

     ### [Date] - [Topic]

     **Misunderstanding**: [What was misunderstood]
     **Clarification**: [Correct understanding]
     **Impact**: [What changed in requirements/tasks]
     ```

   - Keep it concise and focused on WHAT/WHY, not HOW

5. **Present to user**:
   - Show the requirements.md
   - Ask: "Does this capture your intent? Any changes needed?"
   - Iterate until approved

6. **After approval**:
   - If user responds with approval like "ok" or "please design":
     - Ensure `FEATURE_DIR/asset/` contains capscreen image(s):
       - If Linear link was provided: images should already be downloaded from the parent issue.
       - Otherwise: use capscreen(s) the user provides in chat and save them into `FEATURE_DIR/asset/`.
     - Hand off to the `ui` agent to generate `FEATURE_DIR/uiux.md` using `requirements.md` and images in `FEATURE_DIR/asset/`.
   - After `uiux.md` is ready, suggest: "Next: run `/blueprint` to produce blueprint.md, then `/plan` for tasks."

## Guidelines

- **Requirements first**: Focus on user needs, not implementation
- **Concise**: Avoid over-specification
- **Testable**: All requirements must be verifiable
- **Technology-agnostic**: Success criteria shouldn't mention frameworks/tools
