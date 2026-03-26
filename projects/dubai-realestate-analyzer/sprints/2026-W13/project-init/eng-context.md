# Engineering Context: project-init

**Feature Folder:** projects/dubai-realestate-analyzer/sprints/2026-W13/project-init/
**Date:** 2026-03-26

## Ingested From
projects/dubai-realestate-analyzer/sprints/2026-W13/project-init/

## Product Artifacts Ingested
- **prd.md** — Full spec: data model requirements, user journey (discover → focus → enrich → analyze), edge cases, success criteria
- **problem-output.md** — Problem analysis: time-sensitive data collection, data availability as key risk
- **solution-output.md** — Solution approach: data-first tool, Claude Code as primary interface, 4 core flows
- **inputs-summary.md** — Feature summary, investment parameters (off-plan, <500k AED, 3-6 month horizon)
- **CONTEXT.md** — Project-level context (greenfield, no tech stack yet)

## Codebase Analysis

### Greenfield — No Existing Code
This is a brand new project. There is no existing codebase, database, or infrastructure. Everything will be created from scratch.

### Implications
- No legacy patterns to follow or work around
- Free to choose the best-fit technology for the job
- No migration concerns
- Must establish project structure, tooling, and conventions from zero

## Technical Digest

### What This Means Technically

| PRD Requirement | Technical Translation |
|---|---|
| Store projects, neighborhoods, listings, price snapshots | Database with 4+ related tables/collections. Relationships: neighborhood → projects → listings → price_snapshots |
| Track prices over time | Time-series data — each listing gets a new price record every collection run, timestamped |
| Queryable by Claude Code | Storage format must be something Claude Code can open and query directly — SQLite file, JSON, or CSV |
| Collect from property portals | Web scraping or API calls to Property Finder / Bayut. Must handle rate limits, page structure changes, anti-bot measures |
| Watchlist (track/untrack) | A simple tracked/untracked flag on project records |
| Normalize prices to AED | Data cleaning: parse "450,000 AED", "450K", "AED 450,000" → consistent integer (450000) |
| Mark removed listings | Soft delete with "removed_at" timestamp. Requires diffing current scrape against previous scrape |
| Dataset survives sessions | Persistent on-disk storage (not in-memory). Must be in the project directory so Claude Code can access it |
| Payment plan capture | Structured field: plan type (e.g., "60/40", "post-handover"), installment breakdown if available |

### Data Flows

```
[Property Portal] --scrape/API--> [Raw Data] --clean/normalize--> [Structured Storage]
                                                                        |
                                                                   [Claude Code]
                                                                   reads & queries
```

1. **Collection:** Fetch listings from portal(s) → raw HTML or JSON
2. **Parsing:** Extract structured fields (price, size, project, area, etc.)
3. **Normalization:** Clean prices, standardize names, handle missing fields
4. **Storage:** Write to persistent storage with collection timestamp
5. **Diffing:** Compare with previous collection to detect: new listings, removed listings, price changes
6. **Querying:** Claude Code reads the storage directly to answer questions

### Integration Boundaries

- **Property Finder / Bayut** — External. Read-only. No API key guaranteed. May need browser-based scraping.
- **Claude Code** — The "frontend." Reads files from disk. No server needed.
- **File system** — The "database." Everything lives in the project directory.

## Decision Points

1. **Storage format** — How do we store the data? (SQLite, JSON files, CSV, etc.)
2. **Data collection method** — How do we get listing data from portals? (scraping, API, manual, hybrid)
3. **Schema design** — How do projects, neighborhoods, listings, and price snapshots relate? How to handle aliases and dedup?
4. **Collection workflow** — How is data collection triggered? (script, slash command, paste-and-parse, browser session)
5. **Project structure** — How is the repo organized? Where do scripts, data, and config live?
6. **Browser/scraping tooling** — Which tool for web scraping? (Playwright, Puppeteer, Claude Code agent-browser, curl + parsing, etc.)

## Engineer Context

**Codebase Familiarity:** Very familiar with databases, web scraping, and data pipelines
**Constraints:** No language preference — pick the best tool for the job
**Timeline:** Normal — a few days to get it right, not rushing
