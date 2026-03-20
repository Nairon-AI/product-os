---
description: Compile engineering spec and generate implementation handoff
allowed-tools: Read, Write, Bash, Glob, Grep, Edit, AskUserQuestion
---

# /specify - Compile Engineering Spec & Handoff

You are helping an engineer compile their technical decisions into a final engineering spec and generate a handoff message for implementation.

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

## CRITICAL: Beginner-Friendly Communication

The person running this is a **beginner-to-intermediate engineer**. You must:

- **Explain technical concepts when you introduce them** — don't assume they know what "idempotency" or "event-driven architecture" means. Give a one-line plain English explanation.
- **Use analogies** when helpful.
- **Avoid jargon without context** — if you must use a technical term, define it inline.
- **Be encouraging, not condescending** — treat them as smart people learning, not as people who can't handle complexity.

## Prerequisites

1. Read `eng-context.md` from the feature folder.
   - If it doesn't exist, tell user: **"Run `/engineer` first."** and stop.
2. Read `eng-decisions.md` from the feature folder.
   - If it doesn't exist, tell user: **"Run `/investigate` first."** and stop.
3. Read `project.json` from the feature folder for project info.
4. Read the project's CONTEXT.md file from `projects/[project-id]/CONTEXT.md`.
5. Read `prd.md` from the feature folder for reference.

## Your Task

Walk through these steps **one at a time**. Generate each section, get approval, then move on.

### Step 1: Generate Engineering Spec

Compile everything from `eng-context.md` and `eng-decisions.md` into a single, comprehensive engineering spec.

**Write to `engineering-spec.md`:**
```markdown
# Engineering Spec: [Feature Name]

**Project:** [Project Name]
**Sprint:** [Sprint Week]
**Date:** [Date]
**Engineer:** [from engineer context if captured]

---

## 1. Technical Overview

[What this feature does in engineering terms — translated from the PRD. This should be understandable by any engineer on the team without reading the PRD first. 3-5 sentences.]

## 2. Systems Affected

| System/Module | What Changes | Key Files |
|---------------|-------------|-----------|
| [module] | [what's being added/modified] | [file paths] |

## 3. Architectural Decisions

[For each decision from eng-decisions.md:]

### 3.X. [Decision Name]

**Context:** [What needed deciding and why — one paragraph]

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| [A] | [pros] | [cons] |
| [B] | [pros] | [cons] |

**Decision:** [Option chosen]

**Rationale:** [Why — grounded in investigation, not abstract theory]

**Tradeoffs Accepted:** [What we're giving up and why that's OK]

## 4. Technical Requirements

[What must be true for this feature to work correctly. Not implementation steps — constraints and behaviors.]

- [ ] [Requirement — e.g., "Must handle concurrent edits without data loss"]
- [ ] [Requirement — e.g., "Auth must propagate through the entire request chain"]
- [ ] [Requirement — e.g., "Response time must stay under 200ms for the list endpoint"]
- [ ] [Requirement — e.g., "Must work when third-party API is temporarily unavailable"]

## 5. Cross-Cutting Concerns

### Security
[Security considerations from the investigation]

### Error Handling
[How failures cascade, what to handle]

### Observability
[What to log, monitor, alert on]

## 6. Build Sequence

[Logical order to build things, from eng-decisions.md]

1. **[Thing]** — [why first]
2. **[Thing]** — [depends on #1 because...]
3. **[Thing]** — [can happen in parallel with #2]

## 7. Risks & Open Questions

| Risk/Question | Severity | Mitigation / Who Can Answer |
|---------------|----------|---------------------------|
| [risk] | [high/med/low] | [what to do] |

### Knowledge Gaps
- [thing to learn] — [suggested resource]

### External Dependencies
- [dependency] — [status]

## 8. References

- **PRD:** `prd.md`
- **QA Checklist:** `qa.md`
- **Linear Tickets:** `linear-tickets.md`
- **Codebase Discovery:** `codebase-discovery.md`
- **Engineering Context:** `eng-context.md`
- **Decision Log:** `eng-decisions.md`
```

Show the full spec to the engineer. Ask: "How does this look? Anything to add, change, or remove?"

Iterate if needed.

### Step 2: Review Technical Requirements

Walk through each technical requirement from Section 4.

Ask: "Are these requirements complete? Anything missing? Anything too strict or too loose?"

Common things to probe:
- Performance requirements (are there response time expectations?)
- Data requirements (consistency, durability, retention)
- Compatibility requirements (browsers, devices, API versions)
- Security requirements (auth, encryption, data handling)

Update `engineering-spec.md` with any additions.

### Step 3: Review Risks & Open Questions

Walk through Section 7.

For each open question, ask: "Who should you talk to about this? Do you need an answer before you start building, or can you start and figure it out along the way?"

Tag each with:
- **Blocking** — must resolve before starting
- **Non-blocking** — can start building and resolve during implementation

Update `engineering-spec.md` with the blocking/non-blocking tags.

### Step 4: Final Package Check

Verify all engineering spec files exist:
- [ ] `eng-context.md`
- [ ] `eng-decisions.md`
- [ ] `engineering-spec.md`

Also verify the product spec files are present:
- [ ] `prd.md`
- [ ] `qa.md` (or skipped)
- [ ] `linear-tickets.md` (or skipped)

Report status.

### Step 5: Implementation Handoff

This is the final step. Generate a handoff message that gives the implementer (whether it's Claude Code, another engineer, or the user themselves) everything they need to start building.

Ask: "Who will be implementing this?"

Options:
1. **Claude Code** — Generate a prompt for Claude to implement
2. **Another engineer** — Draft a Slack message for handoff
3. **Myself** — Just generate the implementation prompt for my own reference

**If Claude Code or Myself:**

Generate an implementation prompt that references BOTH the product spec and engineering spec:

```
Pull latest from main and read the sprint handoff docs in `sprints/YYYY-WXX/[feature-name]/`.

Read these files in order:
1. `prd.md` — What we're building (product requirements, user flows, wireframes, edge cases)
2. `engineering-spec.md` — How we're building it (architectural decisions, technical requirements, build sequence, risks)
3. `eng-decisions.md` — Detailed decision rationale with investigation notes

Then investigate the current codebase to understand what exists today.

Based on the PRD requirements, engineering spec decisions, and codebase analysis, create a detailed implementation plan. Follow the build sequence in the engineering spec. For each phase:
- Identify what to remove, modify, and create
- Follow the architectural decisions — they were investigated and locked for good reasons
- Check each technical requirement is satisfied
- Handle the edge cases documented in the PRD

Key decisions to follow:
[List the 3-5 most important decisions from engineering-spec.md with one-line summaries]

Risks to watch for:
[List blocking risks from engineering-spec.md]
```

**If Another Engineer:**

Ask: "Is this for a shared channel or a private chat?"

Draft a Slack message (casual tone):

```
hey! [feature-name] is ready for implementation

tldr: [one-line description]

files: [repo]/sprints/YYYY-WXX/[feature-name]/
- prd.md — product spec + wireframes
- engineering-spec.md — technical decisions + requirements + build sequence
- eng-decisions.md — detailed rationale for each decision

key decisions:
- [decision 1 summary]
- [decision 2 summary]
- [decision 3 summary]

[if there are blocking risks:]
heads up — need to resolve before starting:
- [blocking risk/question]

lmk if anything's unclear
```

**Write to `eng-handoff.md`:**
```markdown
# Engineering Handoff: [Feature Name]

**Project:** [Project Name]
**Feature:** [Feature Name]
**Sprint:** [Sprint Week]
**Date:** [Date]

## Deliverables

### Product Spec (from product workflow)
- [x] prd.md
- [x/skipped] qa.md
- [x/skipped] linear-tickets.md
- [x/skipped] loom-outline.md

### Engineering Spec (from engineering workflow)
- [x] eng-context.md
- [x] eng-decisions.md
- [x] engineering-spec.md

## Implementation Target
- **Who:** [Claude Code / Engineer name / Self]

## Implementation Prompt / Handoff Message
[The generated prompt or Slack message]

## Blocking Items
[List any blocking risks/questions that must be resolved before starting]

## Non-Blocking Items
[List non-blocking items to resolve during implementation]
```

### Final Output

```
Engineering spec complete!

Files: sprints/YYYY-WXX/[feature-name]/
- engineering-spec.md — full technical spec
- eng-decisions.md — decision rationale
- eng-context.md — technical context
- eng-handoff.md — handoff record

[If prompt was generated, show it]
[If Slack message was drafted, show it]

Ready to build.
```
