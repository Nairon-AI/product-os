# PRD: Tinybird & Results Implementation

## 1. Summary

Set up Tinybird as Keylead's on-platform analytics engine and connect it to the agent dashboard so agents can see how many views their listings and profiles are getting across the marketplace. The dashboard currently shows "soon" for Profile Views and Property Views — this feature makes those numbers real by tracking every card impression and page visit via Tinybird, then merging them with existing Late API (Instagram) post views into one Total Views number.

## 2. Why

**Business context:** Tinybird is a prerequisite for Keylead's Discovery Ads product (targeted April 2026). Without on-platform view tracking, there's no foundation for measuring ad impressions, proving delivery to advertisers, or powering the discovery ranking formula. This sprint lays that foundation while simultaneously delivering agent value.

**Customer pain:** Real estate agents paying for Keylead promotions have no self-service way to see if their investment is working. The ops team manually tells agents their numbers, which doesn't scale. Agents just want one big number that validates their ROI.

**What happens if we don't build this:** Agents can't see ROI → churn risk → value flywheel breaks. Discovery Ads launch gets blocked → no new revenue stream.

## 3. What

**In scope:**
- Set up Tinybird account, data sources, and Pipes (SQL aggregation queries)
- Build Tinybird service layer (`tinybird-service.ts`) for event ingestion and querying
- Build IntersectionObserver hook (`use-impression-tracking.ts`) for card visibility tracking
- Track property views across 12 marketplace locations (P1-P12)
- Track profile views across 5 marketplace locations (A1-A5)
- Update dashboard analytics to query Tinybird alongside Late API
- Replace "soon" labels with real numbers when data exists
- Internal user filtering (`is_internal` flag, excluded at query time)

**Goals:**
- Agents see a combined Total Views number (on-platform + off-platform)
- Events flowing into Tinybird within 1 week of development start
- Dashboard shows real Profile/Property View numbers when promotion data exists
- Foundation ready for Discovery Ads (impression tracking, attribution, location tagging)

## 4. Out of Scope

- Discovery Ads product (promoted listing injection, billing, admin management)
- Leaderboards or competitive ranking between agents
- Per-listing or per-placement-zone analytics breakdowns in agent UI
- Bot/crawler filtering (can be added later via Tinybird Pipes)
- View deduplication (every impression counts)
- Chart visualization of Profile/Property Views over time (chart stays Post Views only)
- Loom outline

## 5. Where

**Product locations:**

- **Agent Dashboard — Total Views section** (MODIFIED): Replace "soon" labels for Profile Views and Property Views with real Tinybird numbers. Total Views becomes sum of all three categories.
- **Marketplace — All listing card locations** (NEW tracking): IntersectionObserver on PropertyCard across homepage, search, AI search, similar listings, partner/company profile pages.
- **Marketplace — All partner card locations** (NEW tracking): IntersectionObserver on PartnerCard across homepage partners section, partners directory, AI search.
- **Listing detail page** (NEW tracking): Page visit event to Tinybird (alongside existing `TrackView` component).
- **Partner profile page** (NEW tracking): Page visit event to Tinybird (alongside existing `TrackView` component).
- **Tinybird workspace** (NEW): Data sources, Pipes, and API endpoints for view aggregation.

## 6. How

### User Journey

**Marketplace visitor (anonymous or logged in):**
1. Visits Keylead marketplace (homepage, search, listing page, etc.)
2. As listing cards become visible on screen → Tinybird receives `property_view` events
3. As partner cards become visible on screen → Tinybird receives `profile_view` events
4. Visits a listing detail page → Tinybird receives `property_view` event with `location: "listing_detail"`
5. Visits a partner profile page → Tinybird receives `profile_view` event with `location: "partner_detail"`

**Agent viewing their dashboard:**
1. Logs into Keylead → sees Dashboard Overview
2. Total Views section shows combined number (Post + Profile + Property Views)
3. Dropdown shows breakdown:
   - Profile Views: [number] (from Tinybird)
   - Property Views: [number] (from Tinybird)
   - Post Views: [number] (from Late API, existing)
4. Period selector (Today/Yesterday/7d/30d) filters all three categories

### Behavior Specs

**Event Ingestion (Client → Tinybird):**
- Events sent via Tinybird Events API (HTTP POST, JSON payload)
- Batched: buffer 5-10 events, send every 2 seconds to reduce API calls
- `is_internal` flag set to `true` if viewer has `@keylead.com` email or admin role
- `session_id` generated per browser session (no PII)
- `is_promoted` flag reflects listing's current promotion status
- Fires on IntersectionObserver entry (no minimum visibility threshold)

**Event Schemas:**

```
property_view:
  - timestamp: DateTime
  - listing_id: String
  - agent_id: String (listing owner)
  - session_id: String
  - location: String
  - is_promoted: Boolean
  - is_internal: Boolean

profile_view:
  - timestamp: DateTime
  - partner_id: String
  - session_id: String
  - location: String
  - is_internal: Boolean
```

**Location values for property_view:**
| Value | Marketplace Location |
|-------|---------------------|
| `homepage_discover` | Discover Deals carousel |
| `homepage_billionaires` | Billionaires Row carousel |
| `homepage_miami` | Miami section |
| `homepage_newyork` | New York section |
| `homepage_dubai` | Dubai section |
| `homepage_featured` | Featured property spotlight |
| `search_results` | Standard search grid |
| `ai_search` | AI search results |
| `listing_detail` | Listing detail page visit |
| `similar_listings` | Similar listings carousel |
| `partner_listings` | Listings on partner profile |
| `company_listings` | Listings on company profile |

**Location values for profile_view:**
| Value | Marketplace Location |
|-------|---------------------|
| `homepage_partners` | Homepage partners section |
| `partners_directory` | Partners directory page |
| `ai_search` | AI search partner results |
| `partner_detail` | Partner profile page visit |
| `listing_agent_card` | Agent card on listing detail |

**Tinybird Pipes (SQL aggregation):**

```sql
-- Agent property views (filtered, period-aware)
SELECT count() as views
FROM property_views
WHERE agent_id = {{agent_id}}
  AND is_internal = 0
  AND timestamp >= {{start_date}}
  AND timestamp < {{end_date}}

-- Agent profile views (filtered, period-aware)
SELECT count() as views
FROM profile_views
WHERE partner_id = {{partner_id}}
  AND is_internal = 0
  AND timestamp >= {{start_date}}
  AND timestamp < {{end_date}}
```

**Dashboard Data Flow:**

```
/api/dashboard/analytics?period=7days
  ├── Late API → Post Views (existing, unchanged)
  ├── Tinybird Pipe API → Profile Views (new)
  ├── Tinybird Pipe API → Property Views (new)
  └── Response: { postViews, profileViews, propertyViews, totalViews }
```

**"soon" → number transition:**
- Keep showing "soon" until Tinybird returns > 0 views for that category
- Once data exists, show the number permanently (even if it drops to 0 in a period)
- Lock icon removed when any Tinybird data exists

### Edge Cases

| # | Scenario | Behavior |
|---|----------|----------|
| 1 | Zero state on launch | Keep "soon" for Profile/Property Views until Tinybird has data. Post Views powers Total Views as today. |
| 2 | Tinybird API down | Show Post Views normally. Profile/Property Views fall back to "soon". Dashboard doesn't break. |
| 3 | Card scroll visibility | Any viewport entry counts. No minimum threshold. IntersectionObserver fires immediately. |
| 4 | Agent's own visits | Counted. No self-exclusion. |
| 5 | Bot/crawler traffic | Not filtered initially. Add user-agent filter in Tinybird Pipes later if needed. |
| 6 | Internal users | Tracked with `is_internal: true`. Filtered out at query time (`WHERE is_internal = 0`). Data preserved for internal analytics. |
| 7 | Period selector | Tinybird queries respect same periods as Late API (Today/Yesterday/7d/30d). |
| 8 | Deleted listings | Historical views preserved in Tinybird. Still count toward agent's total. |
| 9 | Rapid scroll events | Events batched client-side (buffer 5-10, flush every 2s). Reduces Tinybird API load. |

### Success Criteria

- [ ] Tinybird workspace created with `property_views` and `profile_views` data sources
- [ ] Events flowing from marketplace to Tinybird (verifiable in Tinybird dashboard)
- [ ] Internal views tagged with `is_internal: true` and excluded from agent queries
- [ ] Dashboard shows real Profile Views number (replaces "soon") when data exists
- [ ] Dashboard shows real Property Views number (replaces "soon") when data exists
- [ ] Total Views = Post Views + Profile Views + Property Views
- [ ] Period selector filters all three categories consistently
- [ ] Dashboard loads normally even if Tinybird is unreachable

## 7. Wireframes

### Dashboard — Total Views (Desktop)

```
BEFORE (current):
┌────────────────────────────────────┐
│ Total Views v                      │
│                                    │
│  5,000       Profile Views   soon  │
│  🔒 Unlock   Property Views  soon  │
│             Post Views       0     │
│                                    │
│ Updated 9:39 PM                    │
└────────────────────────────────────┘

AFTER (with Tinybird data):
┌────────────────────────────────────┐
│ Total Views v                      │
│                                    │
│  8,247       Profile Views   412   │
│             Property Views  2,835  │
│             Post Views      5,000  │
│                                    │
│ Updated 9:39 PM                    │
└────────────────────────────────────┘
```

- Total = 412 + 2,835 + 5,000 = 8,247
- "soon" replaced with real numbers
- Lock icon removed
- Chart below unchanged (Post Views only via Late API)

### Dashboard — Total Views (Mobile)

```
Mobile (with Tinybird data):
┌──────────────────────┐
│ Total Views v        │
│                      │
│  8,247               │
│                      │
│ Profile Views   412  │
│ Property Views 2,835 │
│ Post Views     5,000 │
│                      │
│ Updated 9:39 PM      │
└──────────────────────┘
```

No mobile-specific changes — existing responsive layout handles stacking.

### Tracking Architecture (Invisible to User)

```
Marketplace Pages
  │
  ├── PropertyCard (IntersectionObserver)
  │     └── property_view event → buffer
  │
  ├── PartnerCard (IntersectionObserver)
  │     └── profile_view event → buffer
  │
  ├── Listing Detail Page (on load)
  │     └── property_view event (location: listing_detail)
  │
  └── Partner Profile Page (on load)
        └── profile_view event (location: partner_detail)
                │
                ▼
        Event Buffer (client-side)
        Flush every 2s, batch 5-10 events
                │
                ▼
        Tinybird Events API (HTTP POST)
                │
                ▼
        Tinybird Data Sources
        ├── property_views
        └── profile_views
                │
                ▼
        Tinybird Pipes (SQL)
        ├── agent_property_views (filtered, period-aware)
        └── agent_profile_views (filtered, period-aware)
                │
                ▼
        Dashboard API (/api/dashboard/analytics)
        Merges: Late API (post) + Tinybird (profile + property)
                │
                ▼
        Agent Dashboard UI
```

## 8. Links

- **Problem Statement:** `problem-statement.md`
- **Develop Output:** `develop-output.md`
- **Discover Output:** `discover-output.md`
- **Inputs Summary:** `inputs-summary.md`
- **Codebase Discovery:** `codebase-discovery.md`
- **ADR-003:** `tech-adrs/analytics-infrastructure/ADR-003-user-facing-analytics.md` (in Keylead repo)
- **Views PRD:** `sprints/2026-W05/prd-views-analytics-aggregation.md` (in Keylead repo)

## Appendix: Complete View Tracking Location Map

### Property View Locations (12 total)

| # | Location | Route | Traffic | Ad Potential |
|---|----------|-------|---------|-------------|
| P1 | Listing Detail Page | `/listing/[slug]` | HIGH | N/A |
| P2 | Homepage - Discover Deals | `/` | VERY HIGH | Inject at carousel start |
| P3 | Homepage - Billionaires Row | `/` | HIGH | Curated placement |
| P4 | Homepage - Miami Section | `/` | HIGH | Per-city injection |
| P5 | Homepage - New York Section | `/` | HIGH | Per-city injection |
| P6 | Homepage - Dubai Section | `/` | HIGH | Per-city injection |
| P7 | Homepage - Featured Property | `/` | MEDIUM | Premium slot |
| P8 | Search Results | `/search` | VERY HIGH | Positions 1, 7, 13 |
| P9 | AI Search Results | `/search/ai` | MEDIUM | Boost RRF score |
| P10 | Listing Detail - Similar | `/listing/[slug]` | MEDIUM-HIGH | Cross-sell slot |
| P11 | Partner Profile - Listings | `/partner/[slug]` | MEDIUM | No |
| P12 | Company Profile - Listings | `/company/[id]` | LOW-MEDIUM | No |

### Profile View Locations (5 total)

| # | Location | Route | Traffic | Ad Potential |
|---|----------|-------|---------|-------------|
| A1 | Partner Profile Page | `/partner/[slug]` | MEDIUM | N/A |
| A2 | Homepage - Partners Section | `/` | MEDIUM-HIGH | Featured partners |
| A3 | Partners Directory | `/partners` | MEDIUM | Pin to top |
| A4 | AI Search - Partner Results | `/search/ai` | MEDIUM | Boost ranking |
| A5 | Listing Detail - Agent Card | `/listing/[slug]` | HIGH | N/A |
