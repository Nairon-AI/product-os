# Product OS

A sprint-based product development workflow for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Product OS guides you through a structured Double Diamond process to produce comprehensive handoff packages for engineers — PRDs, QA checklists, Linear tickets, and Loom outlines.

## How It Works

Product OS uses Claude Code slash commands to walk you through six phases per feature:

```
PROBLEM SPACE                    SOLUTION SPACE
┌────────────────────┐          ┌────────────────────┐
│ DISCOVER   DEFINE  │          │ DEVELOP   DELIVER  │
│ (diverge) (converge)│          │ (diverge) (converge)│
│     ◇        ▽     │          │     ◇        ▽     │
└────────────────────┘          └────────────────────┘
```

| Phase | Command | Output |
|-------|---------|--------|
| Start | `/start` | `inputs-summary.md` — capture feature brief, goals, and type |
| Discover | `/discover` | `discover-output.md` — explore the problem space broadly |
| Define | `/define` | `problem-statement.md` — converge on one clear problem |
| Develop | `/develop` | `develop-output.md` — explore solutions, wireframes, edge cases |
| Deliver | `/deliver` | `prd.md`, `qa.md`, `linear-tickets.md`, `loom-outline.md` |
| Handoff | `/handoff` | Commit, push, and notify engineering |

There's also a **lite mode** (`/problem` + `/solution`) that combines phases for faster iteration.

Use `/status` at any time to check progress across all projects.

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and configured
- Node.js 18+

## Setup

```bash
git clone https://github.com/Lukaeric14/product-os.git
cd product-os
npm install
```

### Configure your projects

1. Copy the example config:
```bash
cp projects/projects.example.json projects/projects.json
```

2. Edit `projects/projects.json` to add your own projects:
```json
{
  "categories": [
    { "id": "my-team", "name": "My Team" }
  ],
  "projects": [
    {
      "id": "my-app",
      "name": "My App",
      "category": "my-team",
      "description": "Description of your project",
      "path": "projects/my-app",
      "sprintsPath": "projects/my-app/sprints",
      "contextFile": "projects/my-app/CONTEXT.md",
      "commitTarget": "project-repo"
    }
  ]
}
```

3. Create a context file for your project:
```bash
mkdir -p projects/my-app/sprints
cp projects/example/CONTEXT.md projects/my-app/CONTEXT.md
# Edit CONTEXT.md with your project's tech stack, structure, and guidelines
```

### Optional: Add projects as git submodules

If your projects live in separate repos, you can add them as submodules:

```bash
git submodule add https://github.com/your-org/your-app.git projects/your-app
```

This keeps your project code linked without copying it into the Product OS repo. Your `.gitmodules` and `projects/projects.json` are gitignored, so they stay local to your setup.

### Claude Code permissions

Copy and customize the example settings:
```bash
cp .claude/settings.example.json .claude/settings.local.json
```

This pre-approves common git and npm commands so Claude Code doesn't prompt you every time.

## Running the Dashboard

```bash
npm run dev
```

Opens a dashboard at `localhost:5173` showing:
- All projects and their sprint features
- Phase progress with real-time step tracking
- File deliverables status

The UI auto-refreshes as files are created and edited during your workflow.

## Sprint Structure

Features are organized by sprint week inside each project:

```
projects/my-app/sprints/
└── 2026-W09/
    └── user-onboarding/
        ├── project.json          # Links feature to project
        ├── inputs-summary.md     # /start output
        ├── discover-output.md    # /discover output
        ├── problem-statement.md  # /define output
        ├── develop-output.md     # /develop output
        ├── prd.md                # /deliver outputs
        ├── qa.md
        ├── linear-tickets.md
        ├── loom-outline.md
        └── handoff-complete.md   # /handoff output
```

## Project Structure

```
product-os/
├── .claude/
│   ├── commands/          # Slash command definitions
│   └── settings.example.json
├── projects/
│   ├── projects.example.json  # Template project config
│   ├── example/               # Example project with CONTEXT.md template
│   └── product-os/            # Product OS's own context
├── src/                       # Dashboard UI (React + Vite)
├── workflow/                  # Detailed phase documentation
├── docs/                      # Additional documentation
├── agents.md                  # Full agent directives
└── product-os-system.md       # System design document
```

## Key Deliverables

Each feature produces a complete handoff package:

- **PRD** (`prd.md`) — Summary, Why, What, Out of Scope, Where, How, ASCII wireframes, edge cases, success criteria
- **QA Checklist** (`qa.md`) — Specific test cases with expected outcomes, edge case scenarios, polish checks
- **Linear Tickets** (`linear-tickets.md`) — 4-5 tickets with acceptance criteria linked to PRD sections
- **Loom Outline** (`loom-outline.md`) — 5-minute video structure covering what to show and say

## Documentation

- `agents.md` — Full process documentation and agent directives
- `product-os-system.md` — System design and architecture
- `workflow/` — Detailed guides for each phase with examples

## License

MIT License — see [LICENSE](LICENSE) for details.
