# Engineering Spec: project-init

**Project:** Dubai Real Estate Analyzer
**Sprint:** 2026-W13
**Date:** 2026-03-26
**Engineer:** Luka

---

## 1. Technical Overview

Build a Python-based data pipeline that collects Dubai real estate listing data from Property Finder (via HTTP scraping of `__NEXT_DATA__` JSON) and actual transaction data from the DLD Dubai Pulse API, stores everything in a local SQLite database, and exposes the system to Claude Code via slash commands and a CLAUDE.md project file. The database tracks listings over time (append-only), computes price snapshots for tracked projects, and supports ad-hoc SQL queries for investment analysis. This is a greenfield project — everything is built from scratch.

## 2. Systems Affected

| System/Module | What Changes | Key Files |
|---------------|-------------|-----------|
| Project scaffolding (NEW) | Create entire repo structure | `CLAUDE.md`, `requirements.txt`, `README.md` |
| SQLite database (NEW) | Schema + initialization | `scripts/init_db.py`, `data/dubai_re.db` |
| Property Finder collector (NEW) | HTTP scraper for PF listings | `scripts/collect_pf.py` |
| DLD API collector (NEW) | REST API client for transaction data | `scripts/collect_dld.py` |
| Price snapshot engine (NEW) | Aggregation from raw data | `scripts/compute_snapshots.py` |
| Shared utilities (NEW) | DB connection, normalization helpers | `scripts/utils.py` |
| Claude Code commands (NEW) | Slash commands for collection | `.claude/commands/*.md` |

## 3. Architectural Decisions

### 3.1. Data Collection Method

**Context:** How do we get data from Dubai real estate sources? This was the highest-risk decision — we needed to validate that data is actually accessible for free.

**Options Considered:**
| Option | Pros | Cons |
|--------|------|------|
| Property Finder HTTP scraping | Easy (Next.js SSR, JSON in page), reliable, free | Single portal |
| Bayut scraping | Broad coverage | Aggressive bot detection ("Humbucker"), free scraping blocked |
| Dubizzle scraping | Wide coverage | Imperva enterprise bot protection, specifically tuned against property scraping |
| DLD Open Data API | Official, free, actual sale prices, no auth needed | Limited to current calendar year |

**Decision:** Property Finder HTTP scraping + DLD Dubai Pulse API. Skip Bayut/Dubizzle.

**Rationale:** Property Finder returns structured JSON via `__NEXT_DATA__` in every SSR page — simple HTTP requests work, no browser needed. DLD provides actual transaction prices (what people paid vs. what sellers ask). Together they give both listing and transaction views. Bayut/Dubizzle have enterprise anti-bot systems that block free scraping.

**Tradeoffs Accepted:** Missing Bayut/Dubizzle listings reduces market coverage, but Property Finder is Dubai's largest portal. Can revisit with console scripts or stealth scraping later.

### 3.2. Scraping Tooling

**Context:** What language and libraries for the collection scripts?

**Decision:** Python with `requests` + built-in `json` + `sqlite3`.

**Rationale:** Both sources return JSON (PF via SSR page, DLD via REST API). No HTML parsing needed. Python's `requests` is simple, battle-tested, and has the best scraping ecosystem. All dependencies (json, sqlite3) are built-in except requests.

**Tradeoffs Accepted:** No async (fine for <500 requests/session). Manual retry logic (no framework).

### 3.3. Storage Format

**Context:** How to persist data so Claude Code can query it across sessions?

**Decision:** SQLite — single `.db` file, queried via Python's built-in `sqlite3`.

**Rationale:** SQL supports all needed query patterns (filter, aggregate, join, time-series). Single file = no sprawl. Zero dependencies. Instant performance at our scale (tens of thousands of rows).

**Tradeoffs Accepted:** Not human-readable (user doesn't need to inspect raw data). Schema defined upfront.

### 3.4. Schema Design

**Context:** How to structure tables for listing data, transactions, and tracked projects?

**Decision:** Source-aligned raw tables + lightweight project linking layer.

**Schema:**
```sql
-- Raw Property Finder data (append-only)
CREATE TABLE pf_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pf_id TEXT,                    -- Property Finder's listing ID
    title TEXT,
    price INTEGER,                 -- AED, always integer
    price_per_sqft INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    size_sqft REAL,
    property_type TEXT,            -- Apartment, Villa, etc.
    project_name TEXT,
    neighborhood TEXT,
    developer TEXT,
    listing_url TEXT,
    payment_plan TEXT,             -- "60/40", "post-handover", etc.
    completion_status TEXT,        -- off-plan, under construction, ready
    listed_date TEXT,              -- ISO 8601
    source_url TEXT,               -- Search page URL this came from
    collected_at TEXT NOT NULL     -- ISO 8601 UTC
);

-- Collection run metadata
CREATE TABLE pf_collection_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    search_url TEXT,
    total_results INTEGER,
    collected_count INTEGER,
    collected_at TEXT NOT NULL
);

-- Raw DLD transaction data (from gateway.dubailand.gov.ae/open-data/transactions)
CREATE TABLE dld_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_number TEXT,       -- "102-28962-2026"
    instance_date TEXT,            -- Transaction datetime ISO 8601
    group_en TEXT,                 -- "Sales", "Mortgage", "Gifts"
    procedure_en TEXT,             -- "Sell - Pre registration", etc.
    is_offplan TEXT,               -- "Off-Plan" or "Ready"
    is_freehold TEXT,              -- "Free Hold" or "Non Free Hold"
    usage_en TEXT,                 -- "Residential", "Commercial", "Other"
    area_en TEXT,                  -- Neighborhood name
    project_en TEXT,               -- Project name
    master_project_en TEXT,        -- Master community name
    prop_type_en TEXT,             -- "Unit", "Building", "Land"
    prop_sb_type_en TEXT,          -- "Flat", "Villa", "Office", etc.
    rooms_en TEXT,                 -- "2 B/R", "Studio", etc.
    parking TEXT,
    trans_value INTEGER,           -- Transaction amount in AED
    procedure_area REAL,           -- Area in sqm
    actual_area REAL,              -- Actual property area in sqm
    nearest_metro_en TEXT,
    nearest_mall_en TEXT,
    nearest_landmark_en TEXT,
    collected_at TEXT NOT NULL
);

-- User-curated project watchlist
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    neighborhood TEXT,
    developer TEXT,
    status TEXT,                   -- off-plan, under construction, ready
    tracked INTEGER DEFAULT 1,    -- 1 = tracked, 0 = untracked
    notes TEXT,
    created_at TEXT NOT NULL
);

-- Name aliases for cross-source matching
CREATE TABLE project_aliases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id),
    alias_name TEXT NOT NULL,
    source TEXT                    -- 'pf', 'dld', 'manual'
);

-- Aggregated price snapshots (computed after each collection)
CREATE TABLE price_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id),
    date TEXT NOT NULL,            -- ISO 8601 date
    avg_price INTEGER,
    min_price INTEGER,
    max_price INTEGER,
    listing_count INTEGER,
    avg_price_per_sqft INTEGER,
    collected_at TEXT NOT NULL
);

-- Collection run log for observability
CREATE TABLE collection_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,          -- 'pf', 'dld'
    status TEXT NOT NULL,          -- 'success', 'failed', 'partial'
    listings_found INTEGER,
    new_listings INTEGER,
    price_changes INTEGER,
    removed_listings INTEGER,
    error_message TEXT,
    started_at TEXT NOT NULL,
    completed_at TEXT
);
```

**Rationale:** Raw tables store data as-received from each source — no lossy transformation. Project layer is user-curated, links via name matching. Price snapshots are pre-computed for trend queries. Collection log provides observability.

### 3.5. Collection Workflow

**Decision:** Claude Code slash commands (`.claude/commands/`) triggering Python scripts.

**Commands:**
| Command | Script | Purpose |
|---------|--------|---------|
| `/collect-pf` | `scripts/collect_pf.py` | Collect Property Finder listings |
| `/collect-dld` | `scripts/collect_dld.py` | Pull DLD transaction data |
| `/update` | Runs all collectors + `scripts/compute_snapshots.py` | Full refresh |
| `/analyze` | Opens analysis session | Ad-hoc querying |

### 3.6. Project Structure

```
dubai-realestate-analyzer/
├── .claude/
│   └── commands/
│       ├── collect-pf.md
│       ├── collect-dld.md
│       ├── update.md
│       └── analyze.md
├── scripts/
│   ├── init_db.py
│   ├── collect_pf.py
│   ├── collect_dld.py
│   ├── compute_snapshots.py
│   └── utils.py
├── data/
│   ├── dubai_re.db          (gitignored)
│   └── .gitignore
├── CLAUDE.md
├── requirements.txt
└── README.md
```

## 4. Technical Requirements

- [ ] SQLite database initializes with all tables on first run (`init_db.py` is idempotent — safe to run multiple times)
- [ ] Property Finder collector parses `__NEXT_DATA__` JSON and extracts all listing fields defined in schema
- [ ] Property Finder collector paginates through all results (25/page) with 1-2s delays between requests
- [ ] DLD collector POSTs to `gateway.dubailand.gov.ae/open-data/transactions` and paginates through all results (no auth needed)
- [ ] All prices normalized to integer AED (no decimals, no currency symbols, no formatting)
- [ ] All timestamps stored as UTC ISO 8601 strings
- [ ] Collection runs are logged to `collection_log` table with counts and status
- [ ] Listings are append-only — never update or delete, only add new rows with `collected_at` timestamp
- [ ] Removed listings detected by diffing current collection against previous (same `pf_id` not found → mark removed)
- [ ] Price snapshots computed per tracked project after each collection run
- [ ] Rate limiting: 1-2s delay between PF requests, 1 req/s for DLD, exponential backoff on 429/block (5s → 10s → 30s, max 3 retries)
- [ ] Scripts fail loudly with clear error messages on unexpected responses (no silent failures)
- [ ] Database file persists in `data/` directory and survives between Claude Code sessions

## 5. Cross-Cutting Concerns

### Security
- No API keys needed — both Property Finder and DLD Open Data are unauthenticated
- SQLite database gitignored — contains market intelligence data
- `data/.gitignore` excludes `.db` files

### Error Handling
- PF page structure changes → parser validates expected fields exist → fails with clear message + logs raw response
- DLD API returns error or empty → log error, continue with available data
- Collection failure → price snapshots not recomputed → snapshots include "based on data from" timestamp
- Network errors → retry with exponential backoff (5s, 10s, 30s) → fail after 3 attempts

### Observability
- `collection_log` table tracks every run: source, status, counts, timing, errors
- Each collection prints summary: listings found, new, price changes, removed
- Price snapshot computation logs biggest price changes per project

### Rate Limiting
- Property Finder: 1-2s between page requests, sequential only, ~25 results/page
- DLD API: 1 req/s, follow rate limit headers, respect pagination
- On 429 or block: exponential backoff (5s → 10s → 30s), max 3 retries, then fail

## 6. Build Sequence

1. **Project scaffolding** — Repo structure, `CLAUDE.md`, `requirements.txt`, `init_db.py` with full schema. Run `init_db.py` to create empty database. This is the foundation everything else builds on.
2. **Property Finder collector** — `collect_pf.py`: HTTP GET → parse `__NEXT_DATA__` → normalize → insert into `pf_listings`. Validates the full pipeline end-to-end with real data.
3. **DLD API collector** — `collect_dld.py`: POST to open API → paginate → insert into `dld_transactions`. No registration needed — API is completely open.
4. **Price snapshot computation** — `compute_snapshots.py`: query raw listings per tracked project → compute avg/min/max/count → insert into `price_snapshots`. Depends on having data from step 2.
5. **Slash commands** — Create `.claude/commands/` files that instruct Claude Code how to run each script and present results.
6. **Watchlist management** — Add/remove projects, manage aliases, link to PF listings and DLD transactions by name matching.

## 7. Risks & Open Questions

| Risk/Question | Severity | Mitigation |
|---------------|----------|------------|
| Property Finder changes `__NEXT_DATA__` structure | Medium | Validate expected fields before parsing. Log raw response on failure. |
| Property Finder adds bot detection | Medium | Fall back to console script approach (paste JS in browser). |
| DLD API limited to current calendar year | Low | Collect early and often. Historical data may be on Data Dubai (requires investigation). |
| DLD data project names don't match PF names exactly | Medium | Store raw data regardless. Fuzzy match where possible using project_aliases table. |
| SQLite file corruption / data loss | Low | Periodic manual backup. SQLite is resilient. |
| Property Finder rate-limits or IP-bans | Low | Conservative delays. Residential IP. Wait 24h if banned. |

### Knowledge Gaps
- ~~DLD API response format~~ — **RESOLVED**: Open API at `gateway.dubailand.gov.ae/open-data/transactions`, no auth, POST with JSON body. Returns transaction_number, instance_date, trans_value, area_en, project_en, rooms_en, is_offplan, and 15+ other fields. ~45k sales/quarter.
- ~~Property Finder `__NEXT_DATA__` field names~~ — **RESOLVED**: Listings at `props.pageProps.searchResult.listings[]`. Two types: `listing_type: "property"` (individual units) and `listing_type: "project"` (development projects with payment plans). Pagination via `searchResult.meta.page_count`.
- ~~Property Finder pagination~~ — **RESOLVED**: 25 results/page, paginate via `?page=N`, check `meta.page_count` for total pages.

### External Dependencies
- Property Finder website (public, no auth) — non-blocking
- DLD Open Data API (public, no auth) — non-blocking
- **No blocking dependencies remain.**

### Verified API Details

**Property Finder Search URL:**
```
GET https://www.propertyfinder.ae/en/search?c=1&cs=UC&l=1&pf=0&pt=500000&ob=mr&page={N}
```
- `c=1` Buy, `cs=UC` Under Construction, `l=1` Dubai, `pt=500000` max price
- Parse `__NEXT_DATA__` script tag → JSON → `props.pageProps.searchResult.listings[]`
- Two listing types: `property` (individual units) and `project` (developments with payment plans)

**DLD Open Data API:**
```
POST https://gateway.dubailand.gov.ae/open-data/transactions
Content-Type: application/json

{
  "P_FROM_DATE": "01/01/2026",
  "P_TO_DATE": "03/25/2026",
  "P_GROUP_ID": "1",
  "P_IS_OFFPLAN": "1",
  "P_IS_FREE_HOLD": "",
  "P_AREA_ID": "",
  "P_USAGE_ID": "1",
  "P_PROP_TYPE_ID": "",
  "P_TAKE": "100",
  "P_SKIP": "0",
  "P_SORT": "INSTANCE_DATE_DESC"
}
```
- No authentication required
- Returns paginated results with `TOTAL` field for pagination
- Date format: MM/DD/YYYY
- Limited to current calendar year

**DLD Lookup Endpoints (same base URL):**
- `/carea-lookup` — Area name/ID mapping
- `/projects-lookup` — Project name/ID mapping

## 8. References

- **PRD:** `prd.md`
- **Engineering Context:** `eng-context.md`
- **Decision Log:** `eng-decisions.md`
- **Problem Analysis:** `problem-output.md`
- **Solution Output:** `solution-output.md`
- **Project Vision:** `../../vision.md`
- **Project Context:** `../../CONTEXT.md`
