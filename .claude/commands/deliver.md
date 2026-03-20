---
description: Generate PRD, QA checklist, Linear tickets, Loom outline (converge)
allowed-tools: Read, Write, Bash, Glob, Grep, Edit, AskUserQuestion
---

# /deliver - Solution Space (Converge)

You are helping finalize and generate all handoff materials.

## CRITICAL: How to Ask Questions

**Use `AskUserQuestion`** to gather user input with structured, clickable options.

- Use `options` to present choices the user can click on
- Use `multiSelect: true` when multiple answers apply
- Batch related questions (up to 4) into a single AskUserQuestion call

**IMPORTANT: Before asking the first question, tell the user:**
> "If you have **bypass permissions** enabled, please switch to **auto-approve** mode (shift+tab) — otherwise the questions will auto-resolve before you can answer."

**AskUserQuestion must be the ONLY tool call in its message.** Never combine it with Write, Edit, Read, or any other tool in the same response.

**If AskUserQuestion returns empty/blank answers:** The user's permissions mode is auto-resolving it. Tell them to press shift+tab to cycle to a different permissions mode, then re-ask the question.

**NEVER guess or fabricate answers.** Every step that needs user input REQUIRES a real response before writing to files.

**Do NOT use TodoWrite or Task tools.** Progress is tracked by writing to output files, which the UI detects automatically.

## Prerequisites

1. Read `project.json` from the current feature folder:
   - Check the `mode` field
   - If `mode` is "lite", tell user: **"This is a lite feature. Use `/solution` instead."** and stop.
   - If `mode` is missing or "comprehensive", continue.
2. Read the project's CONTEXT.md file from `projects/[project-id]/CONTEXT.md`.
3. `problem-statement.md` exists
4. `develop-output.md` exists (includes ASCII wireframes)

## IMPORTANT: Write Progress to Files

Write each deliverable to its own file as you complete it. This allows the UI to track progress in real-time.

## IMPORTANT: Product Focus

This is the **product spec** workflow. The PRD, QA checklist, and tickets should focus on **what** to build, **why**, and **how it should behave from the user's perspective**. Do NOT include technical implementation details (architecture choices, database schemas, API designs) in the PRD. Those will be handled separately in the **engineering spec** workflow (`/engineer` → `/investigate` → `/specify`) after handoff.

The PRD should describe behavior and requirements clearly enough that an engineer can later make informed technical decisions in the engineering spec phase.

## Your Task

Walk through these steps **one at a time**. Generate each deliverable, get approval, then move on.

### Step 1: Select Deliverables

Ask: "Which deliverables do you need?"

Options:
- **PRD** (required) — Full spec with wireframes
- **QA Checklist** — Test cases for QA team
- **Linear Tickets** — Pre-written tickets for engineers
- **Loom Outline** — Video script for walkthrough

User can select multiple. PRD is always required.

Store selections for later steps. For unselected items, create placeholder files with "**Status:** Skipped" at the end.

### Step 2: Generate PRD

Generate a comprehensive PRD. **Start directly with Summary — no "Review All" section in the PRD itself.**

**PRD must include ASCII wireframes** — do NOT link to Excalidraw. Embed the wireframes from develop-output.md directly.

**Write to `prd.md`:**
```markdown
# PRD: [Feature Name]

## 1. Summary
[3-4 sentences - TL;DR]

## 2. Why
**Business context:** [why this matters]
**Customer pain:** [what problem users have]
**What happens if we don't build this:** [stakes]

## 3. What
**In scope:** [bullet list]
**Goals:** [measurable outcomes]

## 4. Out of Scope
[explicit boundaries]

## 5. Where
**Product locations:**
- [Location] (NEW): [what's there]
- [Location]: [what changes]

## 6. How
### User Journey
[numbered steps for each key flow]

### Behavior Specs
[detailed behavior for each component]

### Pricing/Tier Structure (if applicable)
[Full pricing tables with all options — be thorough]

### Edge Cases
| Scenario | Behavior |
|----------|----------|
| ... | ... |

### Success Criteria
- [ ] [criteria]

## 7. Wireframes

### [Screen Name] (Desktop)
```
[ASCII wireframe]
```

### [Screen Name] (Mobile)
```
[ASCII wireframe or "Not supported"]
```

## 8. Links
- **Problem Statement:** `problem-statement.md`
- **Develop Output:** `develop-output.md`
- **Reference:** [any external references]
```

Ask for feedback. Iterate if needed.

### Step 3: Generate QA (if selected)

**Skip if not selected in Step 1.**

Generate QA checklist.

**Write to `qa.md`:**
```markdown
# QA Checklist: [Feature Name]

## 1. Context
**Feature:** [name]
**User types:** [who to test as]

## 2. Test Account Setup
| Account | State Required |
|---------|----------------|
| ... | ... |

## 3. Pre-Test Setup
- [ ] [setup step]

## 4. Test Cases
### [Section]
**TC-1: [Name]**
- Action: [what to do]
- Expected: [exact outcome]

## 5. Edge Cases
[specific weird scenarios to test]

## 6. Polish Check
- [ ] [visual/UX check]
```

Ask for feedback.

### Step 4: Generate Tickets (if selected)

**Skip if not selected in Step 1.**

Break down into **4-5 Linear tickets maximum**. Keep them chunky, not granular.

**Write to `linear-tickets.md`:**
```markdown
# Linear Tickets: [Feature Name]

---

## Ticket 1: [Title]
**Description:** [1-2 sentences]
**Acceptance Criteria:**
- [ ] [criteria]
**Links:** PRD section X
**Images:** Refer to wireframes in PRD

---

## Ticket 2: [Title]
...
```

Ask for feedback.

### Step 5: Generate Loom Outline (if selected)

**Skip if not selected in Step 1.**

Generate a 5-minute video outline.

**Write to `loom-outline.md`:**
```markdown
# Loom Outline: [Feature Name]

**Total time:** ~5 minutes

---

## 1. Context (1 min)
**Show:** [what to show]
**Cover:** [what to say]

## 2. What We're Building (1 min)
**Show:** [what]
**Cover:** [what]

## 3. User Flow (1.5 min)
**Show:** PRD wireframes
**Cover:** [walk through]

## 4. Edge Cases (1 min)
**Show:** PRD edge cases table
**Cover:** [key decisions]

## 5. QA Focus (30 sec)
**Show:** QA checklist
**Cover:** [priorities]
```

### Step 6: Create Skipped Placeholders

For any deliverables NOT selected in Step 1, create placeholder files:

```markdown
# [Deliverable Name]

**Status:** Skipped
```

This ensures the UI shows proper completion state.

### Step 7: Package Check

Verify all files exist (including skipped placeholders):
- [ ] prd.md (with embedded wireframes)
- [ ] qa.md (content or skipped)
- [ ] linear-tickets.md (content or skipped)
- [ ] loom-outline.md (content or skipped)

Confirm: "All deliverables ready. Run `/handoff` to commit and hand off."
