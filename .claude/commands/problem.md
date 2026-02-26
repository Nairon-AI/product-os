---
description: Define the problem (discover + define combined for lite mode)
allowed-tools: Read, Write, Bash, Glob, Grep, Edit, AskUserQuestion
---

# /problem - Problem Definition (Lite Mode)

You are helping define the problem for a lite-mode feature. This combines discover + define into a single focused phase.

## IMPORTANT: Use AskUserQuestion for All User Input

**Always use the `AskUserQuestion` tool** to gather user input instead of asking questions in chat. This gives the user a structured UI with clickable options, which is faster and produces better responses.

- Use `options` to present choices the user can click on
- Use `multiSelect: true` when multiple answers apply
- Batch related questions (up to 4) into a single AskUserQuestion call

## Prerequisites

1. Read `project.json` from the current feature folder to verify this is a lite feature.
   - If `mode` is NOT "lite", tell user: "This is a comprehensive feature. Use `/discover` instead."
   - If `mode` is missing, assume comprehensive and show the same message.
2. Read `inputs-summary.md` for context on what the user wants to build.

## IMPORTANT: Write Progress to File

After completing EACH step, append the output to `problem-output.md` in the feature folder. This allows the UI to track progress in real-time.

## Your Task

Walk through these steps **one at a time**. Keep it focused — this is lite mode, not a deep dive.

### Step 1: Core Desire

Ask probing questions to understand WHY:
- "Why does this need to be built?"
- "What's the underlying business or user need?"

**Write to `problem-output.md`:**
```markdown
# Problem Output

## Core Desire
[answers and insights]
```

### Step 2: Reasoning Chain

Validate the logic:
- "Is the proposed solution the right approach?"
- "What assumptions are we making?"

**Append to `problem-output.md`:**
```markdown
## Reasoning Chain
[findings]
```

### Step 3: Blind Spots

Surface what might be missing:
- "What might we be overlooking?"
- "Who else could be affected?"

**Append to `problem-output.md`:**
```markdown
## Blind Spots
[blind spots identified]
```

### Step 4: Risks

Identify what could go wrong:
- "What could go wrong?"
- "What are the risks of building this? Of NOT building it?"

**Append to `problem-output.md`:**
```markdown
## Risks
[risks identified]
```

### Step 5: Problem Statement

Synthesize everything into one clear sentence. This is the core output.

**Append to `problem-output.md`:**
```markdown
## Problem Statement

**[One sentence problem statement]**

### Supporting Context
- **Core need:** [brief summary]
- **Key risks:** [1-2 main risks]
- **Blind spots to watch:** [1-2 items]
```

Confirm: "Problem defined. Ready to run `/solution`?"

## Output File

When complete, `problem-output.md` should contain:
- Core Desire
- Reasoning Chain
- Blind Spots
- Risks
- Problem Statement with supporting context
