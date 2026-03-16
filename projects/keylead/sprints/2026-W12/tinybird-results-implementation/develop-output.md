# Develop Output — Tinybird & Results Implementation

## Flows

### Complete View Tracking Audit

Every location where Tinybird will track views, organized by what feeds into the 3 dashboard categories:

---

### POST VIEWS (Already powered by Late API)
Source: Late API hourly snapshots. Already working.
- Instagram post views/impressions from scheduled promotions

---

### PROPERTY VIEWS (Tinybird — currently "soon")

| # | Location | Route | Component | What's Shown | Traffic | Promoted Possible? |
|---|----------|-------|-----------|-------------|---------|-------------------|
| P1 | **Listing Detail Page** | `/listing/[slug]` | Full listing page | Gallery, details, agent contact, map | HIGH | N/A (it IS the view) |
| P2 | **Homepage - Discover Deals** | `/` | `DiscoverDealsSection` | Horizontal carousel, 12 cards, infinite scroll | VERY HIGH | Yes — inject at carousel start |
| P3 | **Homepage - Billionaires Row** | `/` | `FeaturedListingsSection` | Horizontal carousel, sorted by price | HIGH | Yes — curated placement |
| P4 | **Homepage - Miami Section** | `/` | `LocationListingsSection` | 12 Miami listings carousel | HIGH | Yes — per-city injection |
| P5 | **Homepage - New York Section** | `/` | `LocationListingsSection` | 12 NY listings carousel | HIGH | Yes — per-city injection |
| P6 | **Homepage - Dubai Section** | `/` | `LocationListingsSection` | 12 Dubai listings carousel | HIGH | Yes — per-city injection |
| P7 | **Homepage - Featured Property** | `/` | `FeaturedPropertySection` | Single property spotlight with video | MEDIUM | Yes — premium slot |
| P8 | **Search Results** | `/search` | 4-col grid, 20/page | Full search with filters + region tabs | VERY HIGH | Yes — positions 1, 7, 13 |
| P9 | **AI Search Results** | `/search/ai` | Grid/carousel | AI-ranked results with RRF scoring | MEDIUM | Yes — boost RRF score |
| P10 | **Listing Detail - Similar** | `/listing/[slug]` | `SimilarListingsSection` | 4 related listings carousel | MEDIUM-HIGH | Yes — cross-sell slot |
| P11 | **Partner Profile - Listings** | `/partner/[slug]` | 4-col grid, 16/page | Agent's own listings | MEDIUM | No (agent's own page) |
| P12 | **Company Profile - Listings** | `/company/[id]` | 4-col grid, 16/page | Company's listings | LOW-MEDIUM | No (company's own page) |

**Total: 12 property view locations**

---

### PROFILE VIEWS (Tinybird — currently "soon")

| # | Location | Route | Component | What's Shown | Traffic | Promoted Possible? |
|---|----------|-------|-----------|-------------|---------|-------------------|
| A1 | **Partner Profile Page** | `/partner/[slug]` | Full profile page | Avatar, bio, social links, listings grid | MEDIUM | N/A (it IS the view) |
| A2 | **Homepage - Partners Section** | `/` | `PartnersSection` | 4-6 featured partner cards | MEDIUM-HIGH | Yes — featured partners |
| A3 | **Partners Directory** | `/partners` | Grid, 16-50/page | Partner cards with search/filter | MEDIUM | Yes — pin to top |
| A4 | **AI Search - Partner Results** | `/search/ai` | `AIPartnerCard` | AI-ranked partner results | MEDIUM | Yes — boost ranking |
| A5 | **Listing Detail - Agent Card** | `/listing/[slug]` | Sidebar contact card | Agent name, avatar, contact button | HIGH | N/A (listing's agent) |

**Total: 5 profile view locations**

---

### Already-Built Tracking Infrastructure

- `TrackView` component already exists — fires POST to `/api/tracking/view` on listing detail and partner profile pages (P1, A1)
- `page_views` DB table exists with `viewType` ('listing' | 'partner') and `targetId`
- `isPromoted` flag already on listings — renders purple-amber badge on PropertyCard
- Promoted badge renders on all card variants (grid, scroll, compact)

---

### Flow Scope Decision

**In scope this sprint (Tinybird + Results):**
- [x] **F1: Tinybird Setup** — Account, data sources, pipes, service layer, env config
- [x] **F2: Listing page view tracking** (P1) — Track `/listing/[slug]` visits via Tinybird
- [x] **F3: Partner page view tracking** (A1) — Track `/partner/[slug]` visits via Tinybird
- [x] **F4: Homepage card impression tracking** (P2-P7, A2) — Track when cards appear on homepage
- [x] **F5: Search result impression tracking** (P8, A3) — Track search result appearances
- [x] **F6: Dashboard results view** — Show total views breakdown (Post Views, Profile Views, Property Views)

**Out of scope (future sprint — Discovery Ads):**
- [ ] Promoted listing injection into search/homepage queries
- [ ] AI search RRF boost for promoted content
- [ ] Ad management admin UI
- [ ] Impression billing / CTR reporting
- [ ] Similar listings promoted injection (P10)
- [ ] Company profile tracking (P12)

## UI Flow

### Design Decisions

1. **Results location:** Keep existing dashboard UI — fill in "soon" items with real Tinybird data
2. **Total Views = sum of all three:** Post Views (Late API) + Profile Views (Tinybird) + Property Views (Tinybird)
3. **Data collection first:** Start tracking immediately when Tinybird is live, even before UI shows numbers. Build up historical data.
4. **Property View definition:** Any time a listing card is visible on screen (IntersectionObserver), anywhere on the site. Bigger numbers.
5. **Profile View definition:** Any time a partner card is visible on screen, anywhere on the site.
6. **No deduplication:** Every impression counts. Same card seen 5x = 5 views. Higher numbers, simpler implementation.
7. **Chart:** Keep it simple — just show numbers in the dropdown for now (easiest to implement). Chart stays Post Views only initially.

### Event Schema (Tinybird)

```
Event: property_view
Fields:
  - timestamp: DateTime
  - listing_id: String
  - agent_id: String (listing owner)
  - session_id: String
  - location: String (e.g., "homepage_discover", "homepage_billionaires", "homepage_miami", "search_results", "listing_detail", "similar_listings", "ai_search")
  - is_promoted: Boolean
  - is_internal: Boolean (true if viewer is @keylead.com or admin role)

Event: profile_view
Fields:
  - timestamp: DateTime
  - partner_id: String
  - session_id: String
  - location: String (e.g., "homepage_partners", "partners_directory", "ai_search", "partner_detail")
  - is_internal: Boolean (true if viewer is @keylead.com or admin role)
```

### Dashboard Data Flow

```
Total Views (sum)
├── Post Views:     Late API hourly snapshots (existing)
├── Profile Views:  Tinybird API → count(profile_view WHERE partner_id = agent)
└── Property Views: Tinybird API → count(property_view WHERE agent_id = agent)
```

## Desktop Wireframe

Minimal UI change — fill in existing "soon" items with real Tinybird data:

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

AFTER (with Tinybird):
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

Changes:
- Total = Profile Views + Property Views + Post Views (summed)
- "soon" labels replaced with real numbers from Tinybird
- Lock icon removed (data is live)
- No other UI changes needed
- Chart below continues showing Post Views only (existing Late API data)

## Mobile Wireframe

Same minimal change — the dashboard already adapts to mobile. The Total Views section stacks vertically:

```
Mobile (current):
┌──────────────────────┐
│ Total Views v        │
│                      │
│  5,000               │
│  🔒 Unlock           │
│                      │
│ Profile Views  soon  │
│ Property Views soon  │
│ Post Views       0   │
│                      │
│ Updated 9:39 PM      │
└──────────────────────┘

Mobile (with Tinybird):
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

No mobile-specific changes needed — the existing responsive layout handles it.

## Edge Cases

| # | Scenario | Decision |
|---|----------|----------|
| 1 | **Zero state on launch** | Keep showing "soon" for Profile/Property Views until promotions go live and data exists. Post Views continues powering Total Views as today. Once Tinybird has data, flip "soon" to real numbers. |
| 2 | **Tinybird API down** | Fetch Tinybird data independently from Late API. If Tinybird fails, show Post Views normally + "soon" for Profile/Property Views. Don't break the dashboard. |
| 3 | **Card scroll visibility** | Any visibility counts as a view — no minimum threshold. IntersectionObserver fires immediately when card enters viewport. |
| 4 | **Agent's own visits** | Count them. No self-exclusion. |
| 5 | **Bot/crawler traffic** | No filtering initially. Can add Tinybird Pipe filters later if needed. |
| 9 | **Internal users (@keylead.com / admins)** | Track with `is_internal: true` flag. Filter out at query time in Tinybird Pipes (`WHERE is_internal = 0`). Data preserved for internal analytics but excluded from agent-facing totals. |
| 6 | **Period selector** | Tinybird data respects the same period selector as Post Views (Today/Yesterday/7d/30d). |
| 7 | **Deleted listings** | Historical views preserved in Tinybird. Still count toward agent's total. |
| 8 | **Rapid-fire scroll events** | Debounce/batch Tinybird Events API calls (e.g., buffer 5-10 events and send in one batch every 2 seconds to reduce API load). |

## Codebase Risks

### Files that will be modified:

**New files to create:**
- `lib/services/tinybird-service.ts` — Tinybird Events API client + query endpoints
- `lib/hooks/use-impression-tracking.ts` — IntersectionObserver hook for card visibility
- Tinybird data source definitions (in Tinybird workspace, not codebase)
- Tinybird Pipe definitions (SQL aggregation queries)

**Files to modify:**
- `components/features/dashboard-overview/dashboard-overview.tsx` — Replace "soon" with Tinybird data in TotalViewsOverview
- `app/api/dashboard/analytics/route.ts` — Add Tinybird query alongside Late API query
- `components/marketplace/property-card.tsx` — Add impression tracking wrapper
- `components/marketplace/partner-card.tsx` (or equivalent) — Add impression tracking
- `.env.local` / `.env.example` — Add TINYBIRD_API_URL, TINYBIRD_API_TOKEN

**Dependencies:**
- Tinybird account must be created (manual step)
- TINYBIRD_API_TOKEN env var must be set in production
- No new npm packages needed (Tinybird uses standard HTTP fetch)

**Engineering Investigation Notes:**
- Check if `TotalViewsOverview` component in dashboard-overview.tsx currently fetches from `/api/dashboard/analytics` — need to understand how "soon" labels are currently rendered
- Verify `PropertyCard` component accepts a ref or wrapper for IntersectionObserver
- Check if existing `TrackView` component on listing/partner pages should be replaced with Tinybird tracking or kept as dual-write
- Verify Tinybird free tier (10 QPS) handles the query load from dashboard

## Trade-offs

| Decision | Trade-off | Why acceptable |
|----------|-----------|----------------|
| No deduplication | View counts will be inflated by repeat visitors | Agents want big numbers. Simplifies implementation. Can add dedup later in Tinybird Pipes. |
| No minimum visibility threshold | Fast scrolls count as views | Maximizes numbers. IntersectionObserver is standard. Can tighten threshold later. |
| No bot filtering | Some views from crawlers | Low priority for MVP. Tinybird Pipes can filter by user-agent later. |
| "soon" until data exists | Agents don't immediately see the new feature | Better than showing zeros. Natural transition when promotions go live. |
| Chart stays Post Views only | Profile/Property Views not visualized over time | Easiest to implement. Chart can be enhanced later. Numbers in dropdown are sufficient. |
| Tinybird free tier to start | 10 QPS, 10GB, 1000 queries/day limits | Sufficient for current traffic. Upgrade to Developer ($25/mo) when needed. |

## Exit Check

**Solution clarity:**
- Flows: 12 property view locations + 5 profile view locations fully audited
- UI: Minimal change — fill "soon" with real numbers, sum to Total Views
- Tracking: IntersectionObserver on all PropertyCard/PartnerCard instances, events to Tinybird
- Architecture: Tinybird service layer → Events API (ingest) + Pipes API (query)
- Edge cases: 8 scenarios decided

**Mobile:** Addressed — existing responsive layout, no changes needed

**What's ready for PRD:**
1. Set up Tinybird account, data sources (property_view, profile_view), Pipes (agent aggregations)
2. Build `tinybird-service.ts` (track events + query totals)
3. Build `use-impression-tracking.ts` hook (IntersectionObserver wrapper)
4. Wire impression tracking into PropertyCard + PartnerCard across marketplace
5. Update dashboard analytics endpoint to query Tinybird alongside Late API
6. Replace "soon" with real numbers when data exists
