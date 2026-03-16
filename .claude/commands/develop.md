---
description: Explore solutions - UI flows, wireframes, edge cases (diverge)
allowed-tools: Read, Write, Bash, Glob, Grep, Edit, AskUserQuestion
---

# /develop - Solution Space (Diverge)

You are helping explore solutions for the defined problem. This is DIVERGE - explore options before finalizing.

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
2. Read the project's CONTEXT.md file from `projects/[project-id]/CONTEXT.md` for project-specific guidelines.
3. Read `problem-statement.md` to understand what we're solving.
4. Read the project's codebase for relevant context (path specified in CONTEXT.md).

## IMPORTANT: Write Progress to File

After completing EACH step, append the output to `develop-output.md` in the feature folder. This allows the UI to track progress in real-time. Do NOT write placeholder sections - only write sections that are actually completed.

## Communication Style

- **Always be clear about what response you need** — end with a specific question
- **Ask questions before proposing** — don't dump options without understanding preferences first
- **One question at a time or small batches** — don't overwhelm with 10 questions at once

## Your Task

Walk through these steps **one at a time**.

### Step 1: Brainstorm Flows

**DO NOT propose UI options yet.** First, brainstorm ALL possible user flows related to this feature.

Ask questions to understand:
- What flows need to exist?
- What already exists in the codebase?
- Where do these flows live in the product?

Present a comprehensive list of flows, then ask:
- "Which of these flows are in scope for this sprint?"
- "What would you add or cut?"

Get confirmation before proceeding.

**Append to `develop-output.md`:**
```markdown
## Flows
[All flows identified, marked as in-scope or out-of-scope]
```

### Step 2: UI Flow Questions

**Still don't propose options.** Ask targeted questions about the in-scope flows:

- Page structure preferences (single page vs tabs, etc.)
- Component preferences (modal vs inline, etc.)
- Interaction patterns
- Any existing patterns to follow

Ask 3-5 questions at a time. Get answers before proceeding.

### Step 3: Design Decisions

Summarize all decisions made from the Q&A. Confirm before moving to wireframes.

**Append to `develop-output.md`:**
```markdown
## UI Flow
[Design decisions documented]
```

### Step 4: Desktop Wireframe

NOW propose ASCII wireframes based on the decisions:

```
┌─────────────────────────────────┐
│ Header                          │
├─────────────────────────────────┤
│                                 │
│   [Main content area]           │
│                                 │
└─────────────────────────────────┘
```

Ask: "Does this layout work? Anything to change?"

**Append to `develop-output.md`:**
```markdown
## Desktop Wireframe
[ASCII wireframe and explanation]
```

### Step 5: Mobile Wireframe

**MOBILE IS NOT OPTIONAL.**

Create an ASCII wireframe for mobile:
- How does the layout adapt?
- What gets hidden/collapsed?
- Is it touch-friendly?

Ask: "Does this work for mobile users?"

**Append to `develop-output.md`:**
```markdown
## Mobile Wireframe
[ASCII wireframe for mobile]
```

### Step 6: Edge Cases

Based on the feature + project codebase, identify edge cases.

For each edge case:
- State the scenario
- Propose a behavior
- Ask: "Is this right?"

Get explicit decisions for each.

**Append to `develop-output.md`:**
```markdown
## Edge Cases
[Edge cases identified with decisions]
```

### Step 7: Codebase Risks

Analyze the project codebase:
- What files/modules would this touch?
- Any dependencies or conflicts?
- Any technical constraints?

Add "Engineering Investigation Notes" for things engineers should check.

**Append to `develop-output.md`:**
```markdown
## Codebase Risks
[Technical considerations + investigation notes for engineers]
```

### Step 8: Trade-offs

List the trade-offs made and confirm they're acceptable.

**Append to `develop-output.md`:**
```markdown
## Trade-offs
[Trade-offs accepted]
```

### Step 9: Exit Check

Review everything:
- "Do you have clear direction?"
- "Has mobile been addressed?"
- "Are edge cases answered?"

**Append to `develop-output.md`:**
```markdown
## Exit Check
[Confirmation that solution space is fully explored]
```

Confirm: "Ready to run `/deliver`?"
