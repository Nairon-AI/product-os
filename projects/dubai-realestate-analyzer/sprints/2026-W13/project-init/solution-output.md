# Solution Output

## Solution Approach

**Data-first investment intelligence tool.** The product is a structured, growing dataset of Dubai off-plan real estate that can be queried for trends, comparisons, and distress signals. The user interacts primarily through Claude Code — asking questions, requesting analysis, and triggering data collection.

**Technical approach (storage, collection method, automation):** Deferred to engineering spec phase.

**Product approach:**
- Organize data around projects (buildings/developments), neighborhoods, and individual listings
- Track prices over time to reveal trends
- Surface distress signals (price drops, high supply, long time on market)
- Support future projections based on trend data
- Capture payment plan structures alongside headline prices

## UI Flow

**Primary interface:** Claude Code (conversational). No traditional UI flows — instead, these are the key interaction patterns:

### Flow 1: Discovery — "Map the market"
1. User asks: "Find all off-plan projects under 500k AED in Dubai"
2. System collects/retrieves data from property sources
3. Returns organized list: projects grouped by neighborhood, with avg price, unit count, developer
4. User can visualize on a map to see geographic distribution
5. **Outcome:** User has a mental map of what exists in their budget

### Flow 2: Focus — "Start tracking"
1. User reviews discovered projects and picks ones to watch
2. Says: "Track Damac Hills 2, JVC Tower X, Dubai South Project Y"
3. System marks these as tracked projects and captures baseline data
4. **Outcome:** Watchlist established with initial price/supply snapshot

### Flow 3: Enrich — "Go deeper on tracked projects"
1. Weekly: User asks "Update my tracked projects" or "What changed this week?"
2. System collects fresh data for watched projects
3. Returns: price changes, new listings, removed listings, supply shifts
4. User can drill in: "Show me all studios in Damac Hills 2 and their price history"
5. **Outcome:** Growing time-series dataset, trends become visible

### Flow 4: Analyze — "Compare and decide"
1. User asks: "Compare JVC vs Dubai South for studio investment under 400k"
2. System returns: avg price, price trend (up/down/flat), supply volume, days on market, payment plans
3. User asks follow-ups: "Which has dropped the most in the last month?" "Show me the cheapest 3 options"
4. **Outcome:** Data-backed shortlist for actual site visits / agent calls

### Usage cadence
- **Weekly:** Update tracked projects, review trends
- **On-demand:** Discovery of new areas, deep-dive comparisons, pre-purchase analysis

## Desktop Wireframe
```
N/A — Primary interface is Claude Code (conversational).
If a lightweight web dashboard is added later, it would show:
- Tracked projects list with sparkline price trends
- Map view of projects by neighborhood
- Comparison table for selected projects
```

## Mobile Wireframe
```
Not applicable — Claude Code is desktop-only interface.
```

## Edge Cases
| Scenario | Behavior |
|----------|----------|
| Listing disappears from portal | Keep in dataset, mark as "removed" with date. Could mean sold, withdrawn, or relisted. Valuable signal — removal rate indicates demand. |
| Missing data fields (size, floor, etc.) | Store what's available, mark unknown fields as null. Don't skip listings for incomplete data. |
| Price changes on existing listing | Store as new price snapshot with timestamp. Preserve full price history — drops are the key signal. |
| Same project has different names across sources | Use a canonical project name, map aliases. Engineering spec should define dedup strategy. |
| No listings found for a tracked project | Keep project in watchlist, note "0 active listings" — this IS data (project may be sold out or not yet launched). |
| Currency / price format inconsistencies | Normalize all prices to AED total price. Convert price/sqft if total is missing. |

## Trade-offs
| Trade-off | Decision |
|-----------|----------|
| Comprehensive data vs. speed to start | Start with whatever data is accessible. Incomplete data > no data. Enrich over time. |
| Automated vs. manual collection | Defer to engineering spec. Product requirement is just "data gets collected regularly." |
| Listing prices vs. transaction prices | Track listing prices first (accessible). Add DLD transaction data as a separate enrichment layer if available. |
| Single source vs. multiple portals | Start with one source. Add more if needed. Deduplication complexity isn't worth it until we validate the core approach. |
| Web dashboard vs. Claude Code only | Claude Code only for V1. Dashboard is a future nice-to-have, not a blocker. |

## PRD Generated
PRD written to `prd.md` with full specification.
