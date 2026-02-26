---
description: Explore the problem space broadly (diverge)
allowed-tools: Read, Write, Bash, Glob, Grep, Edit, AskUserQuestion
---

# /discover - Problem Space (Diverge)

You are helping explore the problem space for a feature. This is the DIVERGE phase - explore broadly before narrowing down.

## IMPORTANT: Use AskUserQuestion for All User Input

**Always use the `AskUserQuestion` tool** to gather user input instead of asking questions in chat. This gives the user a structured UI with clickable options, which is faster and produces better responses.

- Use `options` to present choices the user can click on
- Use `multiSelect: true` when multiple answers apply
- Use the `markdown` preview field when comparing wireframes or code snippets
- Batch related questions (up to 4) into a single AskUserQuestion call
- Always include meaningful option descriptions to help the user decide

## Prerequisites

1. Read `project.json` from the current feature folder:
   - Check the `mode` field
   - If `mode` is "lite", tell user: **"This is a lite feature. Use `/problem` instead."** and stop.
   - If `mode` is missing or "comprehensive", continue.
2. Read the project's CONTEXT.md file from `projects/[project-id]/CONTEXT.md`.
3. Read `inputs-summary.md` from the current feature folder to understand context.

## IMPORTANT: Write Progress to File

After completing EACH step, append the output to `discover-output.md` in the feature folder. This allows the UI to track progress in real-time.

## Your Task

Walk through these steps **one at a time**. Each step is a conversation. Don't rush. Let the user think.

### Step 1: Core Desire

Ask probing questions to understand WHY this feature is being requested:
- "Why does the stakeholder want this?"
- "What's the underlying business need?"
- "What happens if we don't build this?"

**After documenting, write to `discover-output.md`:**
```markdown
## Core Desire
[answers and insights]
```

### Step 2: Reasoning Chain

Validate the logic from problem to proposed solution:
- "The ask is X. Is X actually the right solution?"
- "What assumptions are we making?"
- "Does the reasoning hold?"

**Append to `discover-output.md`:**
```markdown
## Reasoning Chain
[findings]
```

### Step 3: User Perspective

Explore how users will react:
- "How would users react to this?"
- "What's their current workaround?"
- "What would delight them vs. just satisfy them?"

**Append to `discover-output.md`:**
```markdown
## User Perspective
[insights]
```

### Step 4: Blind Spots

Surface what might be missing:
- "What are we not thinking about?"
- "Who else is affected by this?"
- "What related problems exist?"

**Append to `discover-output.md`:**
```markdown
## Blind Spots
[blind spots identified]
```

### Step 5: Risks

Identify what could go wrong:
- "What could go wrong with this direction?"
- "What are the risks of building this?"
- "What are the risks of NOT building this?"

**Append to `discover-output.md`:**
```markdown
## Risks
[risks identified]
```

### Step 6: Exit Check

Review everything explored:
- "Are we seeing diminishing returns?"
- "Do you feel you understand the problem space?"
- "Any more angles to explore?"

**Append to `discover-output.md`:**
```markdown
## Exit Check
[confirmation that problem space is fully explored]
```

Confirm: "Problem space explored. Ready to run `/define`?"
