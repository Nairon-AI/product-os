---
description: Validate, commit, push, and notify engineers
allowed-tools: Read, Write, Bash, Glob, Grep, Edit
---

# /handoff - Final Handoff

You are helping finalize and hand off the feature to engineers.

## Prerequisites

1. Read `project.json` from the current feature folder to identify:
   - `mode` — comprehensive or lite (defaults to comprehensive if missing)
   - `projectId` — which project this is for
2. Read `projects/projects.json` to get the project config, including:
   - `commitTarget` — where to commit files (project-repo, product-os, or none)
   - `path` — the project path
3. Read the project's CONTEXT.md file from `projects/[project-id]/CONTEXT.md` for project-specific context.

## IMPORTANT: Engineering Spec Flow

After this handoff, the receiving engineer should run the **engineering spec** workflow in a new session to make technical decisions before implementation:

`/engineer` → `/investigate` → `/specify`

This flow ingests the product handoff package, identifies architectural decisions, investigates each one through guided questions, and produces an `engineering-spec.md` with locked decisions, technical requirements, and a build sequence.

The handoff message generated in Step 4 should mention this next step.

## Your Task

### Step 1: Validate Deliverables

Check the `mode` from project.json, then validate the required files.

**If lite mode:**
- prd.md (required)
- problem-output.md (should exist)
- solution-output.md (should exist)

If prd.md is missing, tell user to run `/solution` first.

**If comprehensive mode:**
- prd.md (required)
- qa.md (optional)
- linear-tickets.md (optional)
- loom-outline.md (optional)

**PRD is required.** If missing, tell user to run `/deliver` first.

For optional files (comprehensive only), if missing ask: "I see [file] is missing. Was this skipped intentionally?"
- If yes: Create a placeholder file with "**Status:** Skipped" and continue
- If no: Tell user to run `/deliver` to generate it

### Step 2: Confirm Loom

**Skip this step for lite mode** — lite features don't require Loom videos.

**For comprehensive mode:**
Ask: "Have you recorded the Loom video? (or 'skip')"

If skip: Note as skipped, continue.

### Step 3: Commit and Push

Read `commitTarget` from `projects/projects.json` (under the matching project) to determine where to commit.

**If commitTarget is "project-repo":**

The project has its own git repo. Navigate into it and commit:
```bash
cd [full-path-to-project]
git pull origin main
git add sprints/YYYY-WXX/[feature-name]/
git commit -m "Add [feature-name] sprint YYYY-WXX handoff

- PRD with wireframes
- [other deliverables]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
git push origin main
```

**If commitTarget is "product-os":**

Commit to the product-os repo. May need to handle gitignore:
```bash
git add -f [path-to-feature-folder]/
git commit -m "Add [feature-name] sprint YYYY-WXX handoff"
git push origin main
```

**If commitTarget is "none":**

Skip git operations. Tell user: "Files are ready locally. You can commit manually when ready."

Report the commit hash (if applicable). If there are conflicts, help resolve them first.

### Step 4: Handoff Target

**If lite mode, default to Claude Code:**

For lite features, we assume implementation will be done with Claude Code. Generate the prompt directly:

```
Pull latest from main and read the sprint handoff docs in `sprints/YYYY-WXX/[feature-name]/`.

Read all the files there (prd.md, solution-output.md, problem-output.md) to understand what we're building.

Then investigate the current codebase to understand what exists today.

Based on the PRD requirements and codebase analysis, create a detailed implementation plan. Break it into phases and identify what to remove, what to modify, and what to create.
```

Ask: "Would you like to hand off to someone else instead?" If yes, continue with the options below. If no, skip to Step 5.

**If comprehensive mode:**

Ask: "Who is implementing this?"

Options:
1. **Claude Code** — Generate a prompt for Claude to implement
2. **Engineer** — Draft a Slack message for handoff
3. **Myself** — No notification needed

**If Claude Code:**

Generate a concise prompt:
```
Pull latest from main and read the sprint handoff docs in `sprints/YYYY-WXX/[feature-name]/`.

Read all the files there (prd.md, develop-output.md, problem-statement.md) to understand what we're building.

Then investigate the current codebase to understand what exists today.

Based on the PRD requirements and codebase analysis, create a detailed implementation plan. Break it into phases and identify what to remove, what to modify, and what to create.
```

**If Engineer:**

Ask: "Is this for a shared channel or a private chat?"

Draft appropriate Slack message (casual tone):
```
hey! [feature-name] spec is ready

tldr: [one line description]

files: [repo]/sprints/YYYY-WXX/[feature-name]/
- prd.md — full spec + wireframes

lmk if anything's unclear
```

**If Myself:**

Skip notification, proceed to handoff record.

### Step 5: Create Handoff Record

**Write to `handoff-complete.md` in the feature folder:**
```markdown
# Handoff Complete

**Project:** [Project Name]
**Feature:** [Feature Name]
**Sprint:** YYYY-WXX
**Date:** [Today's date]
**Commit Target:** [project-repo/product-os/none]

## Deliverables Validated
All required deliverables have been validated:
- [x] prd.md
- [x] problem-output.md (lite) / problem-statement.md (comprehensive)
- [x] solution-output.md (lite) / develop-output.md (comprehensive)
- [x/skipped] qa.md (comprehensive only)
- [x/skipped] linear-tickets.md (comprehensive only)
- [x/skipped] loom-outline.md (comprehensive only)

## Committed and Pushed
- **Commit:** [hash or "not committed"]
- **Repo:** [repo name]
- **Branch:** main

## Implementation Prompt
- **Target:** [Claude Code / Engineer / Self]

[If Claude Code, include the prompt here]
[If Engineer, include the Slack message here]

## Remaining Manual Steps
- [ ] [any remaining steps]
```

### Final Output

```
Handoff complete!

Commit: [hash or "local only"]
Repo: [repo name]
Path: sprints/YYYY-WXX/[feature-name]/

[If Claude Code prompt was generated, show it]
[If Slack message was drafted, show it]
```

## Troubleshooting

**Nested repo issues:**
If you get "paths are ignored by .gitignore" errors when committing to product-os for a project that has its own repo, the project folder is gitignored. Options:
1. Use `git add -f` to force add
2. Change commitTarget to "project-repo" and commit there instead
3. Update .gitignore to allow the sprints subfolder

**No .git in project folder:**
If commitTarget is "project-repo" but there's no .git folder, ask user to either:
1. Initialize git in the project folder
2. Change commitTarget to "product-os" or "none"
