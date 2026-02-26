# Product OS Agent Directives

Product OS is a **sprint-based product development workflow** that helps product leads prepare comprehensive handoff packages for engineers using a Double Diamond process.

## Understanding Product OS

Product OS supports multiple projects. Each project has:
- **CONTEXT.md** — Project-specific context (tech stack, codebase structure, guidelines)
- **sprints/** — Sprint folders with feature handoff files

### How Projects Work

1. Run `/start` to initialize a new feature
2. The first step asks which project this is for
3. A `project.json` is created in the feature folder
4. Subsequent commands (`/discover`, `/define`, `/develop`, `/deliver`, `/handoff`) read project.json to load the right context

### Project Context Files

Located at `projects/[project-id]/CONTEXT.md` for each project.

When working on a feature, always read the appropriate CONTEXT.md for:
- Tech stack and codebase structure
- Development guidelines
- Team roles and communication channels
- Git workflow for that project

---

## The Double Diamond Workflow

Product OS follows a structured Double Diamond process:

```
PROBLEM SPACE                    SOLUTION SPACE
┌────────────────────┐          ┌────────────────────┐
│ DISCOVER   DEFINE  │          │ DEVELOP   DELIVER  │
│ (diverge) (converge)│          │ (diverge) (converge)│
│     ◇        ▽     │          │     ◇        ▽     │
└────────────────────┘          └────────────────────┘
```

### Phases

| Phase | Purpose | Output |
|-------|---------|--------|
| `/start` | Initialize feature, capture raw inputs | `inputs-summary.md` |
| `/discover` | Explore problem broadly | `discover-output.md` |
| `/define` | Narrow to one problem | `problem-statement.md` |
| `/develop` | Explore solutions, wireframes, edge cases | `develop-output.md` |
| `/deliver` | Generate PRD, QA, tickets, Loom outline | `prd.md`, `qa.md`, `linear-tickets.md`, `loom-outline.md` |
| `/handoff` | Commit, push, notify team | `handoff-complete.md` |

---

## File Structure

```
product-os/
├── projects/
│   ├── projects.json           # List of configured projects (user-specific, gitignored)
│   ├── projects.example.json   # Template project config
│   ├── example/                # Example project template
│   │   └── CONTEXT.md
│   └── [your-project]/
│       ├── CONTEXT.md          # Project context
│       └── sprints/
│           └── YYYY-WXX/
│               └── [feature]/
│                   ├── project.json
│                   ├── inputs-summary.md
│                   ├── discover-output.md
│                   ├── problem-statement.md
│                   ├── develop-output.md
│                   ├── prd.md
│                   ├── qa.md
│                   ├── linear-tickets.md
│                   ├── loom-outline.md
│                   └── handoff-complete.md
│
├── src/                        # Product OS UI
├── workflow/                   # Workflow documentation
└── product-os-system.md        # System design doc
```

---

## Slash Command Guidelines

### All Commands Should:

1. **Read project context first**
   - Find `project.json` in the feature folder
   - Load `projects/[projectId]/CONTEXT.md` for project-specific guidelines

2. **Walk through steps one at a time**
   - Don't dump checklists
   - Complete each step, get confirmation, then proceed

3. **Write progress to files**
   - Each phase has an output file
   - Write incrementally so UI can track progress

4. **Use project codebase for context**
   - `/develop` should read the project's codebase to understand existing patterns
   - Reference specific files when discussing implementation

---

## Key Deliverables

### PRD (`prd.md`)
- Summary, Why, What, Out of Scope, Where, How
- ASCII wireframes for desktop AND mobile embedded inline
- Edge cases table
- Success criteria

### QA Checklist (`qa.md`)
- Hyper-specific test cases with exact expected outcomes
- Test account setup
- Edge case scenarios
- Polish checks

### Linear Tickets (`linear-tickets.md`)
- 4-5 tickets maximum
- Clear acceptance criteria
- Links to PRD sections

### Loom Outline (`loom-outline.md`)
- 5-minute video structure
- What to show on screen
- What to cover verbally

---

## Communication Style

- **Be conversational** — One question at a time, let user think
- **Ask before proposing** — Understand preferences before showing options
- **End with specific questions** — Make it clear what response you need
- **Use project terminology** — Refer to project-specific concepts from CONTEXT.md

---

## Adding New Projects

To add a new project:

1. Add entry to `projects/projects.json`:
```json
{
  "id": "new-project",
  "name": "New Project Name",
  "description": "Brief description",
  "path": "projects/new-project",
  "sprintsPath": "projects/new-project/sprints",
  "contextFile": "projects/new-project/CONTEXT.md"
}
```

2. Create `projects/new-project/CONTEXT.md` with:
   - Project overview
   - Tech stack
   - Repository structure
   - Sprint location
   - Team info
   - Development guidelines

3. Create `projects/new-project/sprints/` directory

The project will then appear in `/start` project selection.
