# PRD: Project Init — Dubai Real Estate Analyzer

## 1. Summary

Set up the foundational data infrastructure for tracking Dubai off-plan real estate prices over time. The product is a structured dataset that grows weekly, queryable through Claude Code, enabling a non-professional investor to make data-backed purchase decisions during a market downturn. This feature establishes the data model, collection capability, and core query patterns — everything needed to start building the dataset immediately.

## 2. Why

**Business context:** Dubai is experiencing a crisis-driven market downturn (Iran conflict). Real estate prices are expected to decline over the next 3-6 months, creating an investment window for off-plan properties under 500k AED. Data collection must start NOW — historical trends can't be backfilled.

**Customer pain:** There is no way to systematically track Dubai off-plan real estate prices over time. Property portals only show today's snapshot — no price history, no trend lines, no distress signals. A cash-ready investor is forced to make a major purchase decision on gut feel.

**What happens if we don't build this:** Risk of overpaying by tens of thousands of AED on a property, picking the wrong neighborhood, or buying something that isn't actually distressed. The cost of inaction is a poorly-informed 300-500k AED decision.

## 3. What

**In scope:**
- Data model for storing projects (buildings/developments), neighborhoods, listings, and price snapshots over time
- Data collection capability — ability to gather listing data from Dubai property portals
- Core dataset that Claude Code can query and analyze
- Tracked projects watchlist — mark specific projects for ongoing monitoring
- Price history tracking — store price changes over time for trend analysis
- Basic analytics: averages, supply counts, price trends, distress indicators

**Goals:**
- Start collecting data within the first session
- Have a queryable dataset of 10+ tracked projects within the first week
- Be able to answer: "What are the cheapest off-plan studios in JVC and how have their prices changed?"

## 4. Out of Scope

- Web dashboard or frontend UI (Claude Code is the interface)
- Automated scheduled data collection (manual/on-demand first, automate later)
- DLD transaction data integration (future enrichment)
- Multi-user support, authentication, sharing
- Agent contact or purchasing flow
- Mortgage/financing calculators
- Rental yield analysis (may add later)

## 5. Where

**Product locations:**
- Local project repository (NEW): Data storage, collection scripts, schema definitions
- Claude Code (EXISTING): Primary query and analysis interface

## 6. How

### User Journey

**First session — Discovery:**
1. User asks Claude Code: "Find all off-plan projects under 500k AED in Dubai"
2. System collects data from property sources
3. Returns organized list: projects grouped by neighborhood, with avg price, unit count, developer
4. User reviews and selects projects to track: "Track Damac Hills 2, JVC Tower X, Dubai South Project Y"
5. System stores baseline data for tracked projects

**Weekly session — Monitor & Enrich:**
1. User asks: "Update my tracked projects" or "What changed this week?"
2. System collects fresh data for watched projects
3. Returns: price changes, new/removed listings, supply shifts
4. User drills in: "Show me all studios in Damac Hills 2 and their price history"

**On-demand — Analyze & Compare:**
1. User asks: "Compare JVC vs Dubai South for studio investment under 400k"
2. System returns: avg price, price trend, supply volume, days on market, payment plans
3. User narrows: "Which has dropped the most?" "Show me the cheapest 3 options"

**Ongoing — Expand:**
1. User discovers new areas/projects and adds them to tracking
2. Dataset grows over weeks/months, trends become clearer
3. When ready to buy, user has months of data supporting the decision

### Key Data Points Per Listing
- Project/building name
- Developer
- Neighborhood/area
- Unit type (studio, 1BR, 2BR)
- Size (sqft)
- Listed price (AED)
- Price per sqft
- Payment plan (if off-plan)
- Listing date / days on market
- Source (which portal)
- Collection date (for time-series)

### Key Data Points Per Project
- Name and aliases
- Developer
- Neighborhood
- Completion status (off-plan, under construction, ready)
- Number of active listings
- Avg price, min price, max price
- Price trend (week over week)

### Edge Cases
| Scenario | Behavior |
|----------|----------|
| Listing disappears from portal | Keep in dataset, mark as "removed" with date. Removal rate is a demand signal. |
| Missing data fields | Store what's available, mark unknowns as null. Don't skip incomplete listings. |
| Price changes on existing listing | Store as new price snapshot with timestamp. Preserve full price history. |
| Same project has different names | Use canonical name, map aliases. |
| No listings found for tracked project | Keep in watchlist, note "0 active listings" — this is data. |
| Price format inconsistencies | Normalize to AED total price. |

### Success Criteria
- [ ] Data model defined and storage initialized
- [ ] Can collect listing data from at least one Dubai property source
- [ ] Can store and retrieve price snapshots over time (time-series)
- [ ] Can query: "Show me all off-plan projects under 500k in [area]"
- [ ] Can query: "How has [project] pricing changed over the last N weeks?"
- [ ] Can track/untrack specific projects as a watchlist
- [ ] Can compare two neighborhoods side by side
- [ ] Dataset survives between sessions (persistent storage)

## 7. Wireframes

```
N/A — Primary interface is Claude Code (conversational).
No traditional UI. All interaction happens through natural language queries.
```

## 8. Key Decisions & Trade-offs

| Decision | Rationale |
|----------|-----------|
| Claude Code only, no web UI | Speed to start. Dashboard adds complexity without adding insight for a single user. |
| Start with one data source | Validate approach before adding dedup complexity of multiple portals. |
| Listing prices first, transaction data later | Listing data is more accessible. DLD data is a future enrichment. |
| Incomplete data is fine | Any data > no data. Missing fields stored as null, not skipped. |
| Storage/collection method TBD | Deferred to engineering spec — product requirement is "data gets collected and persists." |

## 9. Investment Parameters (Reference)

- **Target:** Off-plan properties under 500k AED
- **Location:** Dubai
- **Horizon:** 2-year investment
- **Timeline:** Building dataset over next 3-6 months
- **Focus:** Studios and 1BRs in emerging/mid-range neighborhoods

## 10. Links
- **Problem:** `problem-output.md`
- **Solution:** `solution-output.md`
- **Vision:** `../../vision.md`
- **Context:** `../../CONTEXT.md`
