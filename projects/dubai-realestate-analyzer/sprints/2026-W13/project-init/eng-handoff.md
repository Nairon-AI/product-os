# Engineering Handoff: project-init

**Project:** Dubai Real Estate Analyzer
**Feature:** project-init
**Sprint:** 2026-W13
**Date:** 2026-03-26

## Deliverables

### Product Spec (from product workflow)
- [x] prd.md
- [x] problem-output.md
- [x] solution-output.md
- [x] inputs-summary.md

### Engineering Spec (from engineering workflow)
- [x] eng-context.md
- [x] eng-decisions.md
- [x] engineering-spec.md

## Implementation Target
- **Who:** Claude Code

## Blocking Items
None — all blockers resolved during investigation:
- DLD API is completely open (no registration needed)
- Property Finder __NEXT_DATA__ structure mapped
- Pagination confirmed for both sources

## Non-Blocking Items
- DLD historical data (before 2026) may require Data Dubai access — investigate during implementation if needed
- Bayut/Dubizzle integration deferred to future sprint

## Implementation Prompt

```
Read the sprint handoff docs in `projects/dubai-realestate-analyzer/sprints/2026-W13/project-init/`.

Read these files in order:
1. `prd.md` — What we're building (product requirements, user flows, edge cases, success criteria)
2. `engineering-spec.md` — How we're building it (architectural decisions, verified API details, schema, build sequence)
3. `eng-decisions.md` — Detailed decision rationale with investigation notes

Then follow the build sequence in the engineering spec:

**Phase 1: Project Scaffolding**
- Create the repo at `projects/dubai-realestate-analyzer/` with the structure defined in section 3.6
- Write `scripts/init_db.py` with the full SQLite schema from section 3.4
- Write `requirements.txt` (just `requests`)
- Write `CLAUDE.md` describing the project, available commands, and how to use the system
- Run init_db.py to create empty database

**Phase 2: Property Finder Collector**
- Build `scripts/collect_pf.py` that:
  - GETs PF search pages at `propertyfinder.ae/en/search?c=1&cs=UC&l=1&pf=0&pt=500000&page={N}`
  - Parses `__NEXT_DATA__` JSON from the HTML
  - Handles both `listing_type: "property"` AND `listing_type: "project"` entries
  - Extracts all fields defined in the pf_listings schema
  - For project listings: extracts payment_plans, delivery_date, construction_progress
  - Paginates through all pages (check meta.page_count), with 1-2s delay between requests
  - Inserts into SQLite (append-only with collected_at timestamp)
  - Logs to collection_log table
  - Rate limiting: 1-2s delay, exponential backoff on errors

**Phase 3: DLD API Collector**
- Build `scripts/collect_dld.py` that:
  - POSTs to `gateway.dubailand.gov.ae/open-data/transactions` (no auth needed)
  - Filters for sales (P_GROUP_ID=1), residential (P_USAGE_ID=1)
  - Can filter for off-plan only (P_IS_OFFPLAN=1)
  - Paginates using P_TAKE/P_SKIP (check TOTAL field)
  - Inserts into dld_transactions table
  - Also fetches area and project lookups for reference

**Phase 4: Price Snapshot Computation**
- Build `scripts/compute_snapshots.py` that:
  - For each tracked project, queries latest pf_listings
  - Computes avg/min/max price, listing count, avg price per sqft
  - Inserts into price_snapshots table with date

**Phase 5: Slash Commands**
- Create `.claude/commands/collect-pf.md` — instructions for Claude Code to run PF collection
- Create `.claude/commands/collect-dld.md` — instructions for DLD collection
- Create `.claude/commands/update.md` — run all collectors + compute snapshots
- Create `.claude/commands/analyze.md` — open analysis session with latest data

**Phase 6: Watchlist Management**
- Add functions in utils.py to: add project to watchlist, remove from watchlist, add alias, list tracked projects

Key decisions to follow:
- Storage: SQLite single file at data/dubai_re.db
- Schema: Source-aligned raw tables + project linking layer (see engineering-spec.md section 3.4)
- All prices as integers in AED, all timestamps as UTC ISO 8601
- Append-only raw data — never update or delete rows
- Property Finder has TWO listing types (property + project) — handle both
- DLD API is open, no auth — just POST with JSON body
```
