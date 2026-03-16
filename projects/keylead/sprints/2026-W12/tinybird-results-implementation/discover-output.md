# Discover Output — Tinybird & Results Implementation

## Core Desire

**Why this feature exists:**

1. **Ads prerequisite** — Tinybird is the analytics foundation needed before Discovery Ads can launch (targeted April 2026). Without real-time event tracking, there's no way to measure ad impressions, clicks, or serve ranking data.

2. **Demonstrate results to users** — Real estate agents paying for promotions currently have no visibility into whether their Keylead investment is working. They need to see tangible ROI from their promotions (views, engagement, leads generated).

**What happens if we don't build it:**
- Agents can't see ROI from their promotions → churn risk, difficulty upselling to higher tiers
- The value flywheel breaks: agents can't prove Keylead works → they stop investing → less content → less traffic → no ad revenue

**Underlying business need:**
- **Short-term:** Prove value to existing paying agents by showing promotion results
- **Medium-term:** Unblock the Discovery Ads revenue stream (April launch)
- **Long-term:** Power the entire Keylead economy (ranking, leaderboards, gamification)

## Reasoning Chain

**The ask:** Set up Tinybird to track on-platform views, attribute them to agents, and serve results alongside Late API off-platform analytics.

**Why Tinybird (not Postgres):**
- Tinybird is confirmed as the right tool — this is real-time event tracking at potentially high volume (every marketplace impression, every listing page view)
- Postgres would need complex time-series aggregations that ClickHouse handles natively
- Tinybird's Events API is purpose-built for high-volume pageview/impression ingestion
- Auto-generated REST endpoints eliminate the need to build custom analytics APIs

**Two-source analytics architecture (validated):**
| Source | Tracks | Purpose |
|--------|--------|---------|
| **Late API** | Off-platform views (Instagram) | Promotion results from social distribution |
| **Tinybird** | On-platform views (marketplace) | Listing/agent visibility within Keylead |

**View attribution model:**
- Homepage listing impression → attribute view to listing agent
- Listing detail page visit → attribute view to listing agent
- Agent profile page visit → attribute view to agent
- Search result appearance → attribute impression to listing agent

**Assumptions being made:**
1. Tinybird free tier (10 QPS, 10GB) is sufficient for initial launch
2. View attribution is 1:1 (one view = one agent, no multi-agent listings)
3. Anonymous/guest views count (not just authenticated users)
4. Late API data and Tinybird data can be merged in a single dashboard view

**Does the reasoning hold?** Yes — this is a clean separation of concerns. Late API owns off-platform metrics, Tinybird owns on-platform metrics. Both feed into a unified "Results" view for the agent.

## User Perspective

**Current experience:** Agents have zero self-service visibility into results. The Keylead team manually tells them their numbers. This is unscalable and creates a dependency on the team for every "how am I doing?" question.

**What agents actually care about:** The final number. One big total. "Your listings got X views." They don't want dashboards, charts, breakdowns, or leaderboards — they want a simple, impressive number that validates their investment.

**What would delight them:** A single, prominent total views number that combines on-platform (Tinybird) + off-platform (Late API) views. Simple. Clear. Big.

**What would just satisfy them:** Moving from "ask the Keylead team" to "see it yourself in the app."

**Key insight:** Don't over-engineer the results UI. Agents are not data analysts — they're salespeople. One number > ten charts. The sophisticated analytics (ranking, leaderboards, per-listing breakdowns) are for Keylead's internal use and future features, not the agent-facing MVP.

## Blind Spots

### The big one: How Tinybird actually powers Keylead Ads

The stakeholder isn't fully clear on how Tinybird works and needs a concrete picture of how it enables the ads product. Here's the audit:

### Marketplace Ad Placement Inventory

The Keylead marketplace has **10 distinct ad placement zones** across the site:

**Tier 1 — Premium placements (homepage above-the-fold):**
1. **Featured Property Section** — Currently hardcoded to one property (OPAL Beverly Hills). Could be a rotating premium showcase slot.
2. **Billionaires Row Carousel** — 12 listings sorted by price. Sponsored listings can be injected.
3. **Hero Trending Searches** — 4 search chips that rotate. Sponsored search suggestions possible.

**Tier 2 — High visibility (primary content areas):**
4. **Discover Deals Carousel** — Newest listings, auto-scrolling. Sponsored injection every 4-5 cards.
5. **Location Sections** (Miami/NYC/Dubai) — 12 listings per city. 1-2 sponsored per location.
6. **Search Results Grid** — 4-column, 20/page. Sponsored at positions 1, 7, 13.

**Tier 3 — Secondary placements:**
7. **Partners Section** — Featured agents/brokerages.
8. **Listing Detail "Similar Listings"** — 4 related cards, 1-2 could be sponsored.
9. **Agent/Company Profile Pages** — Cross-promotion slots.
10. **Partners Directory** — Sponsored partner pinning.

### What Tinybird does in this system

**Tinybird is the measurement layer, not the serving layer.** Here's the flow:

```
1. SERVE: Marketplace renders a promoted listing (existing isPromoted flag in DB)
2. TRACK: Tinybird Events API records the event:
   - impression: listing appeared on screen (homepage, search, listing page)
   - click: user clicked the listing
   - view: user visited the listing detail page
   - contact: user clicked agent contact info
3. AGGREGATE: Tinybird Pipes (SQL) compute:
   - Total impressions/clicks/views per listing
   - Total views per agent (across all their listings)
   - CTR (click-through rate) per placement zone
   - Views by time period, location, device
4. SERVE: Tinybird API endpoints return:
   - Agent dashboard: "Your listings got X views this month"
   - Admin dashboard: "Promotion ABC delivered 5,432 impressions"
   - Ad billing: "Partner Boost delivered 10K impressions, 2.3% CTR"
```

### Two products from the stakeholder call that Tinybird enables:

**Partner Boost** — Agent pays to rank higher in agent/partner discovery
- Tinybird tracks: profile impressions in directory, profile page views, listing clicks from profile
- Agent sees: "Your Partner Boost delivered X profile views"

**Property Boost** — Agent pays to feature specific listing in premium positions
- Tinybird tracks: listing impressions per zone (homepage, search, city section), clicks, detail views
- Agent sees: "Your listing got X views from Property Boost"

### Already-built infrastructure that helps:
- `isPromoted` boolean flag on listings → already renders a promoted badge on property cards
- `promotions` table with status workflow → can track boost orders
- Promoted badge UI → purple-amber gradient star icon already exists on all card variants

### What's NOT built yet:
- No event tracking on the marketplace (Tinybird fills this gap)
- No way to inject promoted listings at specific positions in queries
- No ad management admin UI
- No impression/click billing system

### Other stakeholders affected:
1. **Keylead ops team** — Currently tells agents results manually. This automates that entirely.
2. **Future advertisers** — Discovery Ads buyers need impression/click proof to justify spend.
3. **Keylead leadership** — Platform-wide KPIs, ad revenue tracking, marketplace health metrics.

## Risks

**Primary risk: Scope creep**

This feature touches three distinct concerns that could easily balloon:
1. **Tinybird infrastructure** — Account setup, data sources, pipes, endpoints, environment config
2. **Marketplace tracking** — Client-side event tracking across 10+ page sections
3. **Agent results UI** — Dashboard view showing combined on/off-platform views
4. **Ads system** — Promoted placement injection, impression billing, admin management

**Mitigation — Suggested phasing:**

| Phase | Scope | Deliverable |
|-------|-------|-------------|
| **Phase 1: Tinybird Foundation** | Set up Tinybird account, create data sources, build service layer, track basic pageviews on listing pages | Events flowing into Tinybird, queryable via API |
| **Phase 2: Agent Results** | Build results view showing total views (Tinybird on-platform + Late API off-platform) | Agents see "Your listings got X views" |
| **Phase 3: Marketplace Tracking** | Expand tracking to all placement zones (homepage sections, search, partner pages) | Full impression/click tracking across marketplace |
| **Phase 4: Discovery Ads** | Promoted listing injection, ad management, impression billing | Ads product ready for April launch |

**Other risks:**
- **Low view counts early on** — If marketplace traffic is still growing, agents might see small numbers. Mitigated by combining on-platform + off-platform (Instagram) views into one total.
- **Tinybird learning curve** — First integration with Tinybird. TypeScript SDK and good docs reduce risk, but expect iteration time.
- **April deadline** — 3 weeks to Phase 1+2 is achievable. Phase 3+4 may need to extend into late March / early April.

## Exit Check

**Problem space coverage:**
- **Core desire** — Clear: prove ROI to agents + unblock ads revenue
- **Architecture** — Clear: Tinybird = on-platform tracking, Late API = off-platform, merged in dashboard
- **User need** — Clear: agents want one big number, not complex analytics
- **Marketplace audit** — Complete: 10 ad placement zones identified across 3 tiers
- **Tinybird role** — Clear: measurement layer that tracks impressions/clicks/views and serves aggregate APIs
- **Scope risk** — Identified: 4-phase approach recommended to prevent scope creep
- **Stakeholders** — Mapped: agents, ops team, future advertisers, leadership

Problem space is fully explored. The key insight is that **this sprint should focus on Phase 1 (Tinybird foundation) and Phase 2 (agent results view)**, with Phases 3-4 as follow-up work.
