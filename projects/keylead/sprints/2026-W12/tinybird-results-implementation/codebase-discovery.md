# Codebase Discovery Report

**Product Area:** Analytics & Tinybird
**Focus:** UX & User Flows, Data & Schema, Business Logic
**Project:** Keylead
**Date:** 2026-03-16

## Current Implementation Overview

Keylead has a mature analytics pipeline built around Late API (Instagram post scheduling) with hourly snapshot cron jobs, a dashboard with views charts, and promotion-level metrics rollup. Tinybird integration is **planned (ADR-003) but not yet implemented**. Mixpanel handles client-side event tracking. Page views table exists in schema but has no tracking code yet.

## UX & User Flows

### Key Screens/Components
- **Dashboard Overview** — Main analytics view with period selector and chart — `client-app/app/dashboard/page.tsx` + `client-app/components/features/dashboard-overview/dashboard-overview.tsx`
- **Period Selector** — Today, Yesterday, Last 7 days, Last 30 days
- **Views Chart** — Time-series chart showing view trends with comparison to previous period

### User Journey
1. User logs in → Dashboard shows total views + chart
2. User selects period → Chart updates with time-bucketed data (hourly for today/yesterday, daily for 7/30 days)
3. Views come from Late API (off-platform Instagram posts) or manual entry
4. Onboarding checklist guides new users

### Current Pain Points or Gaps
- No on-platform view tracking (listing views, profile views not tracked in analytics)
- No leaderboard or gamification features
- No real-time view counts — data is hourly snapshots from Late API
- Page views table exists but has no tracking hook connected

## Data & Schema

### Key Types/Interfaces
```typescript
// analytics-snapshots.ts
AnalyticsSnapshot: {
  userId, lateProfileId, latePostId,
  snapshotAt, totalViews, totalImpressions,
  totalLikes, totalComments, totalShares, postCount
}

// page-views.ts
PageView: {
  userId (nullable), viewType ('listing'|'partner'),
  targetId, viewedAt
}

// promotions.ts
Promotion: {
  viewsDelivered, viewsEstimated,
  status, workflowStatus, postType, contentStatus
}
PromotionPost: {
  views, likes, comments, manualMetadata,
  status, ayrsharePostId
}

// late-api.ts
LateAnalyticsMetrics, LateAnalyticsPost, LateAnalyticsListResponse
```

### Database Models
- **`analytics_snapshots`** — Hourly aggregate snapshots from Late API
- **`page_views`** — On-platform view tracking (schema only, not wired up)
- **`promotions`** — Promotion records with rolled-up viewsDelivered
- **`promotion_posts`** — Individual posts with views/likes/comments

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dashboard/analytics` | GET | Dashboard views chart with period filtering |
| `/api/dashboard/stats` | GET | Context-aware suggestions for dashboard |

### Data Flow
```
Late API (Instagram posts) ──→ analytics-functions.ts (hourly cron)
                             ──→ analytics_snapshots table
                             ──→ /api/dashboard/analytics (query)
                                    ↓
Manual Fallback (promotion_posts.manualMetadata)
                                    ↓
                           DashboardOverview Component
```

## Business Logic

### Core Rules
- Analytics snapshots run hourly (minute 0) via Inngest cron
- Promotion analytics sync runs hourly (minute 15) via Inngest cron
- Dashboard prefers Late API data, falls back to manual entries
- Views are aggregated at both post and promotion level
- Period comparison: current period vs previous same-length period

### Key Functions
- `captureAnalyticsSnapshots()` in `lib/inngest/analytics-functions.ts` — Hourly snapshot capture
- `syncPromotionPostAnalytics()` in `lib/inngest/analytics-functions.ts` — Promotion metrics sync
- `getAnalyticsFromSnapshots()` in `lib/inngest/analytics-functions.ts` — Calculate view deltas
- `syncPromotionAnalytics()` in `lib/services/promotion-analytics-sync.ts` — Sync with error handling
- `getAnalyticsForLatePosts()` in `lib/services/late-api.ts` — Late API analytics client
- `identifyUser()` / `aliasUser()` in `lib/client/analytics.ts` — Mixpanel tracking

## Implications for New Feature

### Patterns to Follow
- Use Drizzle ORM for database schemas (consistent with existing tables)
- Use Inngest for background/scheduled jobs
- Service layer pattern: `lib/services/[service-name].ts`
- Client hooks: `lib/hooks/use-[hook-name].ts`
- API routes: `app/api/[resource]/route.ts`

### Key Documentation
- **ADR-003** (`tech-adrs/analytics-infrastructure/ADR-003-user-facing-analytics.md`) — Tinybird decision & architecture
- **Views PRD** (`sprints/2026-W05/prd-views-analytics-aggregation.md`) — Aggregation spec with needed tables & endpoints
- **Calendar V2 Plan** (`client-app/docs/content-plan-builder/CONTENT_CALENDAR_V2_IMPLEMENTATION_PLAN.md`) — Stage 2 Tinybird tasks

### What Needs to Be Built
1. **Tinybird service layer** — `lib/services/tinybird-service.ts` (trackPageview, getViewCount, getLeaderboard)
2. **Pageview tracking hook** — `lib/hooks/use-pageview-tracking.ts`
3. **Environment config** — Add TINYBIRD_API_URL and TINYBIRD_API_TOKEN
4. **New DB tables** — `post_views` (aggregated), `view_aggregates` (pre-computed)
5. **New API endpoints** — `/api/views/user`, `/api/views/by-listing`, `/api/leaderboard/agents`, `/api/admin/views/platform`
6. **Dashboard integration** — Merge Tinybird on-platform views with Late API off-platform views

### Constraints
- Must coexist with existing Mixpanel (Mixpanel for internal product analytics, Tinybird for user-facing metrics)
- Must gracefully handle missing Tinybird config (development mode)
- Budget target: ~$25-100/month at scale (per ADR-003)

## Questions to Explore

- What Tinybird workspace/data sources have been set up (if any)?
- Should on-platform views (listing page, profile page) be the first use case?
- How should Tinybird views merge with Late API views in the dashboard chart?
- What's the priority: leaderboards, individual view counts, or admin KPIs?
- Should we implement real-time view updates or stick with periodic sync?
