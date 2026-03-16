# Inputs Summary

**Project:** Keylead
**Feature:** Tinybird & Results Implementation
**Mode:** Comprehensive
**Sprint:** 2026-W12
**Feature Type:** New Feature
**Commit Target:** project-repo

## Project Selected
Project: Keylead (keylead) — Content scheduling and publishing SaaS for real estate professionals

## Mode Selected
Mode: Comprehensive (full 6-phase Double Diamond)

## Directory Created
Feature directory created at: `projects/keylead/sprints/2026-W12/tinybird-results-implementation/`

## Codebase Discovery Highlights

**Current state:**
- Mature analytics pipeline using Late API (Instagram) with hourly Inngest cron snapshots
- Dashboard with period-based views chart (today/yesterday/7d/30d)
- Mixpanel for client-side event tracking
- `page_views` table schema exists but is not wired up
- Promotion metrics rollup from Late API → `analytics_snapshots` → dashboard

**What needs to be built:**
- Tinybird service layer (`lib/services/tinybird-service.ts`)
- Pageview tracking hook (`lib/hooks/use-pageview-tracking.ts`)
- Environment config (TINYBIRD_API_URL, TINYBIRD_API_TOKEN)
- New DB tables: `post_views`, `view_aggregates`
- New API endpoints: `/api/views/user`, `/api/views/by-listing`, `/api/leaderboard/agents`
- Merge Tinybird on-platform views with Late API off-platform views in dashboard

**Key patterns to follow:** Drizzle ORM, Inngest for background jobs, service layer pattern, Next.js API routes

See `codebase-discovery.md` for full details.

## Key Points from Stakeholder Call

**3-Layer Keylead Economy:**
1. **Subscriptions** (Starter/Growth/Pro/Plus) — baseline exposure, promotions, analytics
2. **Discovery Ads** (Partner Boost, Property Boost) — premium discovery ranking, 3 slots per city
3. **Credits** — flexible power-ups (upgrade channels, move promotions, extra revisions)

**Discovery Ranking Formula:**
```
DiscoveryScore = Relevance + ContentQuality + Engagement + SubscriptionScore + BoostScore
```
- SubscriptionScore = small organic advantage by tier
- BoostScore = large paid advantage (Discovery Ads)

**Key decisions:**
- Credits separated from subscriptions (intent-based purchases)
- Only paying subscribers get Discovery Ads access
- UI should have 3 tabs: Exposure, Boost, Upgrades

**Value flywheel:** Subscriptions → Agents → Listings → Content → Traffic → Discovery demand → Ad revenue

## Key Points from Slack
- Tinybird setup is a prerequisite for introducing Keylead Ads (Discovery Boost)
- Ads introduction targeted for April 2026

## Key Points from Research
- Tinybird: managed real-time data platform on ClickHouse
- Free tier: 0.25 vCPU, 10GB, 10 QPS — sufficient for initial setup
- Developer plan: $25-299/mo — production-ready
- TypeScript SDK available for type-safe development
- Events API for ingestion, Pipes for SQL transforms, auto-generated REST endpoints
- Sub-100ms query latency, data queryable within seconds of arrival
- Perfect fit for: pageview tracking, discovery ranking, leaderboard APIs, ad impression tracking

## Design References
None provided.

## Next Steps
Ready to run `/discover` to explore the problem space in depth.
