# Engineering Decisions: project-init

**Investigation Order:**
1. Data collection method (highest risk — can we even get data?)
2. Browser/scraping tooling (follows directly from #1)
3. Storage format (depends on what data looks like)
4. Schema design (depends on storage choice)
5. Collection workflow (depends on tooling + storage)
6. Project structure (falls out from all other decisions)

---

## 1. Data Collection Method

**Context:** How do we get listing and transaction data from Dubai real estate sources into our system? This is the highest-risk decision — if we can't collect data, nothing else matters.

**Research Conducted:** Tested scraping feasibility for Property Finder, Bayut, Dubizzle, and DLD Dubai Pulse API.

**Options Considered:**
| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| Property Finder HTTP scraping | Parse `__NEXT_DATA__` JSON from SSR pages | Easy, reliable, structured JSON, no browser needed | Single portal, listing prices only |
| Bayut scraping | Direct scraping or paid API | Broad listing coverage | Aggressive "Humbucker" bot detection blocks free scraping; paid API only |
| Dubizzle scraping | Automated or console-script based | Wide listing coverage | Imperva enterprise bot protection, specifically tuned against property scraping |
| DLD Dubai Pulse API | Free government API for transaction data | Official, free, actual sale prices, ~267k transactions/year | Requires registration, token-based auth |
| Console script (manual-assist) | Paste JS in browser dev console to extract data | Bypasses all bot detection, works on any portal | Requires manual browser session, not automated |

**Key Questions Investigated:**
- Q: Are portals scrapable? → A: Property Finder is easy (Next.js SSR with JSON payload). Bayut and Dubizzle have enterprise-grade anti-bot protection (Humbucker, Imperva) — not feasible to scrape for free.
- Q: What free data sources exist? → A: DLD Dubai Pulse API provides actual transaction data for free. Property Finder is scrapable for free.
- Q: User's past experience? → A: Previously used console scripts (JS pasted in browser dev tools) to extract Dubizzle data. Works because you're a real user session.

**Decision:** Property Finder HTTP scraping + DLD Dubai Pulse API. Skip Bayut and Dubizzle for now.

**Rationale:** Property Finder provides active listing data (what's for sale, at what price) via easy HTTP scraping. DLD provides actual transaction prices (what people paid). Together they cover both sides — ask vs. sold. Bayut/Dubizzle add breadth but are blocked behind aggressive anti-bot systems. Can revisit with console scripts or stealth scraping later if needed.

**Tradeoffs Accepted:** Missing listings from Bayut and Dubizzle means incomplete market coverage. Property Finder is the largest portal in Dubai, so coverage is still substantial. DLD transaction data fills the gap on actual prices.

---

## 2. Browser/Scraping Tooling

**Context:** What language and libraries do we use for the data collection scripts?

**Options Considered:**
| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| Python (requests) | Classic HTTP library + JSON parsing | Simple, well-documented, huge community | Sync-only (fine for our volume) |
| Python (httpx) | Modern async HTTP client | Async support, HTTP/2 | Overkill for our needs |
| Node.js (fetch) | Built-in HTTP + native JSON | One language if we add frontend later | Less scraping ecosystem |
| Python (scrapy) | Full scraping framework | Built-in pipelines, retries, rate limiting | Heavy for simple JSON parsing |

**Key Questions Investigated:**
- Q: What are we actually doing? → A: Making HTTP requests to Property Finder (parse `__NEXT_DATA__` JSON) and calling DLD REST API (JSON responses). No HTML parsing needed.
- Q: Need browser automation? → A: No — both sources work with simple HTTP. Playwright deferred to later if Bayut/Dubizzle added.
- Q: Language preference? → A: Python preferred.

**Decision:** Python with `requests` for HTTP and built-in `json` for parsing. Keep it simple.

**Rationale:** We're just making HTTP requests and parsing JSON — no need for a heavy framework. `requests` is battle-tested, simple, and has the best ecosystem for this kind of work. No Playwright needed since both sources work with HTTP.

**Tradeoffs Accepted:** No async support (fine for our volume of <500 requests per session). No built-in retry/rate-limiting framework (we'll add simple retry logic manually).

---

## 3. Storage Format

**Context:** How do we store collected data on disk so it persists between sessions and Claude Code can query it?

**Options Considered:**
| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| SQLite | Relational DB in a single file | SQL queries, joins, indexes, scales well, zero-config | Not human-readable, schema needed upfront |
| JSON files | One file per collection/entity | Human-readable, easy to inspect | Gets messy over time, no joins, slow for large datasets |
| CSV files | Flat files, one per entity | Excel-compatible, easy to append | No relationships, no indexing, dedup is manual |
| Parquet | Columnar analytics format | Fast for analytics queries | Not human-readable, overkill for our scale |

**Key Questions Investigated:**
- Q: What query patterns are needed? → A: All types — filtering, aggregation, time-series comparisons, cross-entity joins.
- Q: Need manual inspectability? → A: No — Claude Code handles all querying.
- Q: Data scale? → A: Tens of thousands of listings over months. Trivial for SQLite.

**Decision:** SQLite — single `.db` file, queried via Python's built-in `sqlite3` module.

**Rationale:** SQL naturally supports all needed query patterns (filter, aggregate, join, time-series). Single file is clean — no file sprawl. Python's sqlite3 is built-in, zero dependencies. Performance is instant at our data scale.

**Tradeoffs Accepted:** Schema must be defined upfront (but we're doing that in the next decision anyway). Not human-readable (but user doesn't need to inspect raw data).

---

## 4. Schema Design

**Context:** How do we structure the SQLite tables to store listing data, transaction data, and tracked projects?

**Options Considered:**
| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| Source-aligned + linking layer | Raw tables mirror source data, lightweight project/watchlist layer on top | Flexible, easy to collect, Claude Code handles interpretation | Less normalized, some redundancy |
| Fully normalized relational | Proper entities with foreign keys everywhere | Clean relationships, no redundancy | Over-engineered for a personal tool, harder to ingest raw data |
| Just raw data tables | Dump everything, no structure | Fastest to build | Hard to track projects or compute trends |

**Key Questions Investigated:**
- Q: Should schema match source data or be normalized? → A: Match source data. Claude Code is smart enough to work with raw data structures.
- Q: Link DLD transactions to projects? → A: Yes, where possible via name/area matching.
- Q: One project per neighborhood? → A: Don't enforce — let source data define the relationship.

**Decision:** Source-aligned tables with a project linking layer.

**Schema:**
```sql
-- Raw Property Finder data (append-only, one row per listing per collection)
pf_listings: id, pf_id, title, price, price_per_sqft, bedrooms, bathrooms,
             size_sqft, property_type, project_name, neighborhood, developer,
             listing_url, payment_plan, completion_status, listed_date,
             source_url, collected_at

-- Collection run metadata
pf_collection_runs: id, search_url, total_results, collected_count, collected_at

-- Raw DLD transaction data
dld_transactions: id, transaction_id, transaction_type, property_type,
                  area_name, project_name, unit_number, price_aed,
                  transaction_date, buyer_type, seller_type, collected_at

-- User-curated project watchlist
projects: id, name, neighborhood, developer, status, tracked, notes, created_at

-- Name aliases for matching across sources
project_aliases: id, project_id, alias_name, source

-- Aggregated price tracking (computed after each collection)
price_snapshots: id, project_id, date, avg_price, min_price, max_price,
                 listing_count, avg_price_per_sqft, collected_at
```

**Rationale:** Raw tables store data exactly as received — no lossy transformation. The project layer is user-curated and links to raw data via name matching. Price snapshots provide pre-computed trends. Claude Code can query raw tables for ad-hoc analysis and snapshots for trend views.

**Tradeoffs Accepted:** Some redundancy in raw data (same listing stored each collection). Name matching between sources is fuzzy (not foreign key enforced). Acceptable for a personal tool where Claude Code mediates all queries.

---

## 5. Collection Workflow

**Context:** How does data collection get triggered and executed?

**Options Considered:**
| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| Python CLI scripts only | Run scripts from terminal manually | Simple, transparent | Must remember command syntax |
| Claude Code natural language | Tell Claude Code what to collect | Most natural | No repeatable commands |
| Slash commands + Python scripts | Claude Code commands (`.claude/commands/`) trigger Python scripts | Repeatable, discoverable, conversational | Slightly more setup |
| Makefile | `make collect-pf` etc. | Documented, CI-friendly | Not conversational |

**Key Questions Investigated:**
- Q: How should collection be triggered? → A: Claude Code runs everything — user doesn't want to remember CLI syntax.
- Q: Need repeatability? → A: Yes — want slash commands, not just natural language.

**Decision:** Claude Code slash commands (`.claude/commands/`) that trigger Python collection scripts.

**Commands planned:**
- `/collect-pf` — Collect Property Finder listings for tracked projects or a search query
- `/collect-dld` — Pull latest DLD transaction data
- `/update` — Run all collectors and recompute price snapshots
- `/analyze` — Open an analysis session with the latest data

**Rationale:** Slash commands give repeatability and discoverability. Python scripts underneath are standalone and testable. Claude Code orchestrates — user just types `/update` weekly.

**Tradeoffs Accepted:** More files to create upfront (command definitions + scripts). Worth it for the weekly workflow to be one command.

---

## 6. Project Structure

**Context:** How is the repository organized? Where do scripts, data, commands, and config live?

**Decision:** Standard separation — commands, scripts, data, config.

```
dubai-realestate-analyzer/
├── .claude/
│   └── commands/          ← Slash commands for Claude Code
│       ├── collect-pf.md
│       ├── collect-dld.md
│       ├── update.md
│       └── analyze.md
├── scripts/
│   ├── collect_pf.py      ← Property Finder scraper
│   ├── collect_dld.py     ← DLD API collector
│   ├── compute_snapshots.py ← Recompute price snapshots
│   └── utils.py           ← Shared helpers (DB connection, normalization)
├── data/
│   ├── dubai_re.db        ← SQLite database (gitignored)
│   └── .gitignore         ← Ignore .db files
├── CLAUDE.md              ← Project instructions for Claude Code
├── requirements.txt       ← Python dependencies (requests, etc.)
└── README.md              ← Setup and usage docs
```

**Rationale:** Each concern has a clear home. Scripts are standalone and testable. Data is isolated and gitignored. Claude Code commands are in the standard location for discoverability. CLAUDE.md gives Claude Code full context on the system.

**Tradeoffs Accepted:** No tests directory yet (add when needed). No config file for API keys/settings (use environment variables or CLAUDE.md instructions for now).

---

## Cross-Cutting Concerns

### Security
- DLD API key stored as environment variable (`DLD_API_KEY`), never committed to git
- SQLite database gitignored — contains pricing intelligence
- No authentication needed for Property Finder scraping (public pages)

### Error Propagation
- Property Finder page structure changes → parser breaks → collection fails → script fails loudly with clear error message
- DLD API token expires → script checks validity before starting, prompts for re-auth
- Collection failure → price snapshots stale → snapshots include "based on data from" timestamp so staleness is visible

### Observability
- Each collection run logs: listings found, new listings, price changes, removed listings
- `collection_log` table in SQLite tracks all runs with timestamps and counts
- Price snapshots log biggest price changes per run

### Rate Limiting
- Property Finder: 1-2 second delay between page requests. Max ~25 results per page, paginate with delays. Target: complete a full search in under 5 minutes.
- DLD API: Follow their rate limit headers. Start with 1 request/second. The API returns paginated results — respect page size limits.
- If either source returns 429 (Too Many Requests) or blocks: back off exponentially (wait 5s, then 10s, then 30s) before retrying. Max 3 retries before failing the run.
- Never run parallel requests to the same source — sequential only.

### Other
- All timestamps stored as UTC ISO 8601 format for consistency across sources
- Prices always stored as integers in AED (no decimals, no currency symbols)

---

## Build Sequence

1. **Project scaffolding** — Create repo structure, CLAUDE.md, requirements.txt, SQLite schema (init_db.py). Foundation for everything.
2. **Property Finder collector** — Build PF scraper. Validates the entire pipeline: HTTP request → parse __NEXT_DATA__ → normalize → store in SQLite.
3. **DLD API collector** — Add transaction data collection. Requires free DLD registration (manual step by user).
4. **Price snapshot computation** — Aggregation layer that computes trends per project from raw data.
5. **Slash commands** — Wire up /collect-pf, /collect-dld, /update, /analyze in .claude/commands/.
6. **Watchlist management** — Track/untrack projects, name alias mapping, watchlist-scoped queries.

---

## Risks & Unknowns

| Risk | Severity | Mitigation |
|------|----------|------------|
| Property Finder changes `__NEXT_DATA__` structure | Medium | Script should validate expected fields exist before parsing. Log raw response on failure for debugging. |
| Property Finder adds bot detection | Medium | Currently no serious anti-bot. If added, fall back to console script approach (paste JS in browser). |
| DLD API registration is slow or blocked | Low | Register early. It's a free government service — should be straightforward. |
| DLD transaction data doesn't include project names in a matchable format | Medium | Accept fuzzy matching. Store raw DLD data regardless — it's valuable even without project linking. |
| SQLite file corruption (data loss) | Low | Periodic backup of the .db file (manual copy or script). SQLite is very resilient to corruption. |
| Property Finder rate-limits or IP-bans | Low | Conservative rate limiting (1-2s delays). Residential IP helps. If banned, wait 24h or use different network. |

### Knowledge Gaps
- DLD Dubai Pulse API exact response format — need to register and test
- Property Finder `__NEXT_DATA__` exact field names for off-plan listings — need to inspect a real page
- How Property Finder paginates search results — need to test

### External Dependencies
- DLD Dubai Pulse API registration (free, user must do this manually)
- Property Finder website availability (public, no account needed)
