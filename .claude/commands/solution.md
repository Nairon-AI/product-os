---
description: Design solution and generate PRD (develop + deliver combined for lite mode)
allowed-tools: Read, Write, Bash, Glob, Grep, Edit, AskUserQuestion
---

# /solution - Solution Design (Lite Mode)

You are helping design the solution for a lite-mode feature. This combines develop + deliver into a single phase.

## IMPORTANT: Use AskUserQuestion for All User Input

**Always use the `AskUserQuestion` tool** to gather user input instead of asking questions in chat. This gives the user a structured UI with clickable options, which is faster and produces better responses.

- Use `options` to present choices the user can click on
- Use `multiSelect: true` when multiple answers apply
- Use the `markdown` preview field when comparing wireframe layouts
- Batch related questions (up to 4) into a single AskUserQuestion call

## Prerequisites

1. Read `project.json` from the current feature folder to verify this is a lite feature.
   - If `mode` is NOT "lite", tell user: "This is a comprehensive feature. Use `/develop` instead."
   - If `mode` is missing, assume comprehensive and show the same message.
2. Read `problem-output.md` for the problem statement.
3. Read the project's CONTEXT.md from `projects/[projectId]/CONTEXT.md` for project-specific guidelines.

## IMPORTANT: Write Progress to Files

Write progress to `solution-output.md` as you go. Generate `prd.md` at the end.

## Your Task

Walk through these steps **one at a time**. This is lite mode — focused and efficient.

### Step 1: Solution Approach

Ask: "How do you want to solve this? What's your preferred approach?"

**Write to `solution-output.md`:**
```markdown
# Solution Output

## Solution Approach
[approach description]
```

### Step 2: UI Flow Options

Ask: "What are the key user flows? Walk me through them."

**Append to `solution-output.md`:**
```markdown
## UI Flow
[flows documented]
```

### Step 3: Desktop Wireframe

Create an ASCII wireframe for desktop. Keep it simple but clear.

**Append to `solution-output.md`:**
```markdown
## Desktop Wireframe
```
[ASCII wireframe]
```
```

### Step 4: Mobile Wireframe

Create an ASCII wireframe for mobile (or note if not applicable).

**Append to `solution-output.md`:**
```markdown
## Mobile Wireframe
```
[ASCII wireframe or "Not applicable for this feature"]
```
```

### Step 5: Edge Cases

Ask: "What edge cases should we handle?"

**Append to `solution-output.md`:**
```markdown
## Edge Cases
| Scenario | Behavior |
|----------|----------|
| ... | ... |
```

### Step 6: Trade-offs

Document key trade-offs and decisions made.

**Append to `solution-output.md`:**
```markdown
## Trade-offs
| Trade-off | Decision |
|-----------|----------|
| ... | ... |
```

### Step 7: Generate PRD

Generate a focused PRD. Include wireframes from solution-output.md.

**First, append to `solution-output.md`:**
```markdown
## PRD Generated
PRD written to `prd.md` with full specification and wireframes.
```

**Then write to `prd.md`:**
```markdown
# PRD: [Feature Name]

## 1. Summary
[3-4 sentences — what we're building and why]

## 2. Why
**Business context:** [why this matters]
**Customer pain:** [what problem users have]
**What happens if we don't build this:** [stakes]

## 3. What
**In scope:**
- [bullet list of what's included]

**Goals:**
- [measurable outcomes]

## 4. Out of Scope
[explicit boundaries — what we're NOT building]

## 5. Where
**Product locations:**
- [Location] (NEW/MODIFIED): [what's there]

## 6. How

### User Journey
1. [Step 1]
2. [Step 2]
...

### Edge Cases
| Scenario | Behavior |
|----------|----------|
| ... | ... |

### Success Criteria
- [ ] [criteria 1]
- [ ] [criteria 2]

## 7. Wireframes

### [Screen Name] (Desktop)
```
[ASCII wireframe from solution-output.md]
```

### [Screen Name] (Mobile)
```
[ASCII wireframe or "Not applicable"]
```

## 8. Links
- **Problem:** `problem-output.md`
- **Solution:** `solution-output.md`
```

Ask for feedback on the PRD. Iterate if needed.

Confirm: "Solution complete. Ready to run `/handoff`?"

## Output Files

When complete:
- `solution-output.md` — Solution exploration notes
- `prd.md` — Final PRD with wireframes
