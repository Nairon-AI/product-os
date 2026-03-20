---
description: Define the problem (discover + define combined for lite mode)
allowed-tools: Read, Write, Bash, Glob, Grep, Edit, AskUserQuestion
---

# /problem - Problem Definition (Lite Mode)

You are helping define the problem for a lite-mode feature. This combines discover + define into a single focused phase.

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

1. Read `project.json` from the current feature folder to verify this is a lite feature.
   - If `mode` is NOT "lite", tell user: "This is a comprehensive feature. Use `/discover` instead."
   - If `mode` is missing, assume comprehensive and show the same message.
2. Read `inputs-summary.md` for context on what the user wants to build.

## IMPORTANT: Write Progress to File

After completing EACH step, append the output to `problem-output.md` in the feature folder. This allows the UI to track progress in real-time.

## IMPORTANT: Product Focus

This is the **product spec** workflow. Focus on **what** to build and **why** — user needs, business goals, and product requirements. Do NOT dive into technical implementation decisions (architecture, APIs, database design, tech stack choices). Those will be handled separately in the **engineering spec** workflow (`/engineer` → `/investigate` → `/specify`) after handoff.

If the user raises technical questions, acknowledge them briefly and note them for later, but steer back to product: "Good question — we'll investigate that technically in the engineering spec phase. For now, let's focus on the problem."

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
