---
description: Set up a fresh Product OS workspace with all teams, projects, and directories
allowed-tools: Read, Write, Bash, Glob, Edit
---

# /setup - Workspace Setup

You are setting up a fresh Product OS workspace. Run everything automatically — no questions, no confirmations. Just do it.

## Step 1: Install dependencies

Run `npm install` if `node_modules` doesn't exist.

## Step 2: Create projects/projects.json

Check if `projects/projects.json` already exists. If it does, skip this step and tell the user.

If it doesn't exist, create it with this content:

```json
{
  "categories": [
    { "id": "keylead", "name": "Keylead" },
    { "id": "nairon", "name": "Nairon" },
    { "id": "personal", "name": "Personal" }
  ],
  "projects": [
    {
      "id": "keylead",
      "name": "Keylead",
      "category": "keylead",
      "description": "Content scheduling and publishing SaaS for real estate professionals",
      "path": "projects/keylead",
      "sprintsPath": "projects/keylead/sprints",
      "contextFile": "projects/keylead/CONTEXT.md",
      "commitTarget": "project-repo"
    },
    {
      "id": "nairon-crm",
      "name": "Nairon CRM",
      "category": "nairon",
      "description": "LinkedIn, WhatsApp, Calendar, and Gmail integration suite for Notion",
      "path": "projects/nairon-crm",
      "sprintsPath": "projects/nairon-crm/sprints",
      "contextFile": "projects/nairon-crm/CONTEXT.md",
      "commitTarget": "project-repo"
    },
    {
      "id": "nairon-slackapp",
      "name": "Nairon Slack App",
      "category": "nairon",
      "description": "AI task tracking and product intelligence Slack bot",
      "path": "projects/nairon-slackapp",
      "sprintsPath": "projects/nairon-slackapp/sprints",
      "contextFile": "projects/nairon-slackapp/CONTEXT.md",
      "commitTarget": "project-repo"
    },
    {
      "id": "nairon-content",
      "name": "Nairon Content",
      "category": "nairon",
      "description": "Content management project",
      "path": "projects/nairon-content",
      "sprintsPath": "projects/nairon-content/sprints",
      "contextFile": "projects/nairon-content/CONTEXT.md",
      "commitTarget": "project-repo"
    },
    {
      "id": "nairon-hub",
      "name": "Nairon Hub",
      "category": "nairon",
      "description": "Central hub for Nairon ecosystem",
      "path": "projects/nairon-hub",
      "sprintsPath": "projects/nairon-hub/sprints",
      "contextFile": "projects/nairon-hub/CONTEXT.md",
      "commitTarget": "project-repo"
    },
    {
      "id": "nairon-universe",
      "name": "Nairon Universe",
      "category": "nairon",
      "description": "Nairon Universe application platform",
      "path": "projects/nairon-universe",
      "sprintsPath": "projects/nairon-universe/sprints",
      "contextFile": "projects/nairon-universe/CONTEXT.md",
      "commitTarget": "project-repo",
      "repo": "https://github.com/Nairon-AI/nairon-universe.git"
    },
    {
      "id": "nairon-sales",
      "name": "Nairon Sales",
      "category": "nairon",
      "description": "Sales platform for Nairon ecosystem",
      "path": "projects/nairon-sales",
      "sprintsPath": "projects/nairon-sales/sprints",
      "contextFile": "projects/nairon-sales/CONTEXT.md",
      "commitTarget": "project-repo"
    },
    {
      "id": "product-os",
      "name": "Product OS",
      "category": "personal",
      "description": "Sprint-based product development workflow tool using Double Diamond process",
      "path": ".",
      "sprintsPath": "sprints",
      "contextFile": "projects/product-os/CONTEXT.md",
      "commitTarget": "product-os"
    },
    {
      "id": "luka-os",
      "name": "Luka OS",
      "category": "personal",
      "description": "Personal operating system project",
      "path": "projects/luka-os",
      "sprintsPath": "projects/luka-os/sprints",
      "contextFile": "projects/luka-os/CONTEXT.md",
      "commitTarget": "project-repo"
    }
  ]
}
```

## Step 3: Create project directories

For each project in the config, ensure these directories and files exist:

```bash
mkdir -p projects/keylead/sprints
mkdir -p projects/nairon-crm/sprints
mkdir -p projects/nairon-slackapp/sprints
mkdir -p projects/nairon-content/sprints
mkdir -p projects/nairon-hub/sprints
mkdir -p projects/nairon-universe/sprints
mkdir -p projects/nairon-sales/sprints
mkdir -p projects/product-os
mkdir -p projects/luka-os/sprints
mkdir -p sprints
```

## Step 4: Create CONTEXT.md files

Do NOT overwrite existing CONTEXT.md files — they may have been customized.

### Projects with known CONTEXT.md content

If `projects/product-os/CONTEXT.md` does not exist, create it with:

```markdown
# Product OS Context

## Overview
Product OS is a sprint-based product development workflow tool that guides product leads through the Double Diamond process to create comprehensive handoff packages for engineers.

## Tech Stack
- **Frontend:** Vite + React + React Router
- **Styling:** Tailwind CSS
- **Backend:** Vite middleware (filesystem scanning)
- **CLI:** Claude Code slash commands

## Repository Structure
```
product-os/
├── src/
│   ├── components/     # React components (PhasePanel, PhaseNav, etc.)
│   ├── pages/          # Dashboard, FeatureDetail
│   ├── hooks/          # useSprints, useProjects
│   └── types/          # TypeScript types (sprint.ts)
├── projects/           # Project configurations
├── sprints/            # Product OS's own sprints
├── agents.md           # Full process documentation
└── CLAUDE.md           # Claude Code instructions
```

## Key Files
- `src/types/sprint.ts` — Phase and step definitions
- `src/hooks/useSprints.ts` — Completion detection logic
- `src/components/PhasePanel.tsx` — Step rendering
- `vite.config.ts` — Backend API endpoints

## Development
```bash
npm run dev    # Start dev server at localhost:5173
npm run build  # Production build
```

## Git Workflow
- Main branch: `main`
- Commits go directly to product-os repo
- No external repo to push to
```

If `projects/nairon-universe/CONTEXT.md` does not exist, create it with:

```markdown
# Nairon Universe

## Repository
- **Repo:** https://github.com/Nairon-AI/nairon-universe.git

## Overview
Nairon Universe application platform.

## Tech Stack
<!-- TODO: Fill in after codebase exploration -->

## Key Patterns
<!-- TODO: Fill in after codebase exploration -->
```

### All other projects

For any remaining project that does NOT have a CONTEXT.md, create one from the template at `projects/example/CONTEXT.md`, replacing "Example Project" with the project name and updating the sprint location path.

## Step 5: Verify

Run `ls projects/` to confirm all directories exist, then read back `projects/projects.json` to confirm it's valid JSON.

## Step 6: Report

Print a short summary:

```
Workspace ready!

Teams: Keylead, Nairon, Personal
Projects: 9 configured
Directories: all created
CONTEXT.md: [created N / skipped M existing]

Run `npm run dev` to start the dashboard.
```
