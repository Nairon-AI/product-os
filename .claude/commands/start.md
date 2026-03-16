---
description: Initialize a new feature and capture raw inputs
allowed-tools: Read, Write, Bash, Glob, Grep, Edit
---

# /start - Initialize Feature

You are helping initialize a new feature for the weekly sprint.

## CRITICAL: How to Ask Questions

**Do NOT use AskUserQuestion** — it is broken within slash commands and auto-resolves before the user can answer.

**Ask questions as formatted plain text and STOP.** Present options as a numbered list so the user can reply with a number or short answer. Format like this:

```
**Which project is this feature for?**

1. Project A — description
2. Project B — description
3. Project C — description

(Reply with a number or name)
```

**NEVER guess, infer, or fabricate the user's answer.** Ask and STOP. Wait for their reply. Do not write to any files or proceed to the next step until you have a real response.

**One step at a time.** Ask → wait → process → ask next. Never batch multiple steps.

**Do NOT use TodoWrite, Task, or AskUserQuestion tools.** Progress is tracked by writing to output files, which the UI detects automatically.

## Your Task

Walk through these steps **one at a time**. Do not dump a checklist. Complete each step, get confirmation, then move to the next.

### Step 1: Select Project

First, read `projects/projects.json` to get the list of available projects.

Ask: "Which project is this feature for?"

Present the options dynamically from projects.json.

Store the selected project ID for later steps.

### Step 2: Select Mode

Ask: "Is this a comprehensive or lite feature?"

Options:
1. **Comprehensive** — Full 6-phase Double Diamond process (discover, define, develop, deliver)
2. **Lite** — Quick 4-phase workflow for smaller features (problem, solution, handoff)

Explain briefly:
- Comprehensive: Best for complex, multi-stakeholder features that need thorough exploration
- Lite: Best for small, well-understood features where you already know the problem

Store the mode for `project.json` (`"mode": "comprehensive"` or `"mode": "lite"`).

### Step 3: Create Directory

Ask: "What's the name of this feature? (e.g., credits-billing, epic-dashboard)"

Then create the directory structure. Read the project config from `projects/projects.json` to get the `sprintsPath` for the selected project.

Use the current week number (YYYY-WXX format).

Create a `project.json` file in the feature folder (see Step 4 for full schema).

### Step 4: Create project.json

Create the `project.json` file in the feature folder:
```json
{
  "projectId": "[selected-project-id]",
  "projectName": "[selected-project-name]",
  "featureName": "[feature-name]",
  "sprintWeek": "YYYY-WXX",
  "createdAt": "[ISO date]",
  "mode": "comprehensive" | "lite"
}
```

**Note:** `commitTarget` is defined in `projects/projects.json` at the project level, not per-feature.

### Step 5: Codebase Discovery (Both Modes)

**This step runs for both Comprehensive and Lite modes.** It scans the project codebase to understand the current implementation and gather context for the feature work.

**5a. Ask about product area:**

Ask: "Which product area should I explore? (e.g., billing, dashboard, onboarding, settings)"

Get a specific area of the product to focus the exploration on.

**5b. Ask about focus areas:**

Ask: "Is there anything specific you'd like me to focus on?"

Present options:
1. **UX & User Flows** — Current user interactions, screens, navigation patterns
2. **Data & Schema** — Database models, API responses, data structures
3. **Business Logic** — Core functionality, rules, validations
4. **All of the above** — Comprehensive scan (takes longer)

Allow multiple selections.

**5c. Scan the codebase:**

Based on the project's `path` from `projects/projects.json`, explore:

- **For UX focus:** Look at components, pages, routes, UI patterns, form flows
- **For Data focus:** Look at schema files, types, API routes, database models, state management
- **For Business Logic focus:** Look at services, utilities, validation logic, business rules

Use the Explore agent to thoroughly investigate the product area. Search for:
- Related components and pages
- Type definitions and interfaces
- API endpoints
- Database schemas/models
- State management patterns
- Existing test files (to understand expected behavior)

**5d. Write the discovery report:**

Create `codebase-discovery.md` with this structure:

```markdown
# Codebase Discovery Report

**Product Area:** [area name]
**Focus:** [selected focus areas]
**Project:** [project name]
**Date:** [date]

## Current Implementation Overview

[High-level summary of how this area works today]

## UX & User Flows
*(if UX was selected)*

### Key Screens/Components
- [Component name] — [what it does] — `path/to/file.tsx`

### User Journey
1. [Step 1]
2. [Step 2]
...

### Current Pain Points or Gaps
- [observations about UX limitations]

## Data & Schema
*(if Data was selected)*

### Key Types/Interfaces
```typescript
// Relevant type definitions
```

### Database Models
- [Model name] — [description]

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/... | GET | ... |

### Data Flow
[How data moves through the system]

## Business Logic
*(if Business Logic was selected)*

### Core Rules
- [Rule 1]
- [Rule 2]

### Validations
- [Validation 1]

### Key Functions
- `functionName()` in `path/to/file.ts` — [what it does]

## Implications for New Feature

[Based on discovery, what should we keep in mind?]
- Patterns to follow
- Constraints to respect
- Integration points
- Potential conflicts or dependencies

## Questions to Explore

[Questions that emerged during discovery that might inform the feature]
```

Save to `codebase-discovery.md` in the feature folder.

**5e. Confirm:**

Share a brief summary of key findings and ask: "I've documented the current implementation. Ready to continue with gathering inputs?"

---

## If Lite Mode

For lite features, skip the detailed input gathering. Instead:

### Step 6 (Lite): Quick Summary

Ask: "Briefly describe the feature — what's the problem and what do you want to build?"

Save the summary directly to `inputs-summary.md`:
```markdown
# Inputs Summary

**Project:** [Project Name]
**Feature:** [Feature Name]
**Mode:** Lite
**Sprint:** YYYY-WXX

## Project Selected
Project: [Project Name] ([project-id])

## Mode Selected
Mode: Lite

## Directory Created
Feature directory created at: [sprintsPath]/YYYY-WXX/[feature-name]/

## Codebase Discovery Highlights
[Key findings from the codebase discovery - summarize the most relevant points]
- Current implementation: [brief summary]
- Key patterns to follow: [list]
- Integration points: [list]

See `codebase-discovery.md` for full details.

## Feature Summary
[User's description]

## Notes
- Commit Target: [target]
```

Confirm: "Inputs captured. Ready to run `/problem`?"

**Skip to end — do not continue with comprehensive steps.**

---

## If Comprehensive Mode

Continue with detailed input gathering:

### Step 6: Feature Type

Ask: "Is this a new feature or improvement to existing?"

Document the answer.

### Step 7: Import Transcript

Ask: "Do you have a transcript from the stakeholder call? Paste it here. (or 'skip')"

Save to `raw-input-transcript.md` if provided.

### Step 8: Import Slack Threads

Ask: "Any Slack threads related to this feature? Paste them here. (or 'skip')"

If user pastes a screenshot, read it and transcribe the content.

Save to `raw-input-slack.md` if provided.

### Step 9: Import Customer Feedback

Ask: "Any customer feedback driving this? Paste it here. (or 'skip')"

Save to `raw-input-feedback.md` if provided.

### Step 10: Capture Design Links

Ask: "Any existing Figma links or design references? (or 'skip')"

Note these for later.

### Step 11: Summarize Inputs

Summarize everything captured:
- Project and feature name
- Commit target
- Feature type
- Key points from codebase discovery
- Key points from transcript
- Key points from Slack
- Key points from feedback
- Design references

Save to `inputs-summary.md`

Confirm: "Inputs captured. Ready to run `/discover`?"

## File Structure Created

```
[sprintsPath]/YYYY-WXX/[feature-name]/
├── project.json
├── codebase-discovery.md
├── raw-input-transcript.md (if provided)
├── raw-input-slack.md (if provided)
├── raw-input-feedback.md (if provided)
└── inputs-summary.md
```

## Important

The `project.json` file is critical - other commands will read it to know:
- Which project context to use
- Where to commit handoff files
