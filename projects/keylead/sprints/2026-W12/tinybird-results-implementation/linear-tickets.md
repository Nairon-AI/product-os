# Linear Tickets: Tinybird & Results Implementation

---

## Ticket 1: Set Up Tinybird Workspace & Data Sources

**Description:** Create the Tinybird account/workspace and define the two data sources (`property_views`, `profile_views`) with their schemas. Create the aggregation Pipes that power the dashboard queries (agent property views, agent profile views — filtered by `is_internal = 0` and time period). Deploy and verify endpoints return expected data format.

**Acceptance Criteria:**
- [ ] Tinybird workspace created (free tier initially)
- [ ] `property_views` data source created with fields: timestamp, listing_id, agent_id, session_id, location, is_promoted, is_internal
- [ ] `profile_views` data source created with fields: timestamp, partner_id, session_id, location, is_internal
- [ ] Aggregation Pipe for agent property views (filtered by agent_id, is_internal=0, time range)
- [ ] Aggregation Pipe for agent profile views (filtered by partner_id, is_internal=0, time range)
- [ ] Both Pipes published as API endpoints
- [ ] Test data ingested and queries return correct results
- [ ] Environment variables documented: TINYBIRD_API_URL, TINYBIRD_API_TOKEN

**Links:** PRD Section 6 (Event Schemas, Tinybird Pipes)

---

## Ticket 2: Build Tinybird Service Layer & Impression Hook

**Description:** Create `lib/services/tinybird-service.ts` with methods for ingesting events (batched) and querying aggregated views. Create `lib/hooks/use-impression-tracking.ts` using IntersectionObserver to detect when cards enter the viewport. The hook should buffer events and flush to Tinybird every 2 seconds. Add `TINYBIRD_API_URL` and `TINYBIRD_API_TOKEN` to `.env.local` and `.env.example`.

**Acceptance Criteria:**
- [ ] `tinybird-service.ts` created with: `trackPropertyView()`, `trackProfileView()`, `getAgentPropertyViews(agentId, startDate, endDate)`, `getAgentProfileViews(partnerId, startDate, endDate)`
- [ ] `use-impression-tracking.ts` hook created — wraps IntersectionObserver, fires once per card entry
- [ ] Client-side event buffer: collects 5-10 events, flushes every 2 seconds via Events API
- [ ] `is_internal` flag set automatically based on viewer's session (checks @keylead.com email or admin role)
- [ ] `session_id` generated per browser session (stored in sessionStorage)
- [ ] Graceful handling when Tinybird env vars are not set (no errors in dev)
- [ ] `.env.example` updated with TINYBIRD_API_URL and TINYBIRD_API_TOKEN placeholders

**Links:** PRD Section 6 (Behavior Specs — Event Ingestion)

---

## Ticket 3: Wire Impression Tracking Across Marketplace

**Description:** Integrate the impression tracking hook into PropertyCard and PartnerCard components so that every card visibility across the marketplace generates a Tinybird event. Also add page-level tracking on listing detail and partner profile pages. Each tracking point must include the correct `location` value per the PRD location map.

**Acceptance Criteria:**
- [ ] PropertyCard fires `property_view` event on viewport entry with correct `location` value
- [ ] PartnerCard fires `profile_view` event on viewport entry with correct `location` value
- [ ] Listing detail page (`/listing/[slug]`) fires `property_view` with `location: "listing_detail"` on load
- [ ] Partner profile page (`/partner/[slug]`) fires `profile_view` with `location: "partner_detail"` on load
- [ ] All 12 property view locations tracked (P1-P12 per PRD appendix)
- [ ] All 5 profile view locations tracked (A1-A5 per PRD appendix)
- [ ] Events include correct `listing_id`/`partner_id`, `agent_id`, `is_promoted`, `is_internal`
- [ ] No duplicate events on component re-render (IntersectionObserver fires once per entry)
- [ ] No console errors on any marketplace page
- [ ] No measurable performance degradation (Lighthouse score unchanged)

**Links:** PRD Section 6 (Location values tables), PRD Appendix (Complete View Tracking Location Map)

---

## Ticket 4: Connect Dashboard to Tinybird Data

**Description:** Update the dashboard analytics API endpoint to query Tinybird for Profile Views and Property Views alongside the existing Late API Post Views query. Update the TotalViewsOverview component to replace "soon" labels with real numbers when Tinybird data exists. Total Views = sum of all three categories. All three categories must respect the period selector.

**Acceptance Criteria:**
- [ ] `/api/dashboard/analytics` endpoint queries Tinybird Pipe APIs for profile_views and property_views
- [ ] Tinybird queries filtered by agent's ID and selected period (Today/Yesterday/7d/30d)
- [ ] Response includes: `{ postViews, profileViews, propertyViews, totalViews }`
- [ ] `totalViews` = `postViews` + `profileViews` + `propertyViews`
- [ ] Dashboard shows "soon" when Tinybird returns 0 views (or on API error)
- [ ] Dashboard shows real numbers when Tinybird returns > 0 views
- [ ] Lock icon removed when Tinybird data exists
- [ ] Tinybird API failure doesn't break dashboard — Post Views still shows normally, Profile/Property fall back to "soon"
- [ ] Period selector correctly filters all three categories
- [ ] Numbers formatted with commas (e.g., 2,835 not 2835)

**Links:** PRD Section 7 (Wireframes), PRD Section 6 (Dashboard Data Flow)

---

## Ticket 5: Production Deploy & Verification

**Description:** Deploy Tinybird integration to production. Set environment variables in production. Verify events are flowing. Monitor for errors, performance issues, and data accuracy. Confirm internal user filtering works. Allow data to accumulate before enabling the dashboard number display.

**Acceptance Criteria:**
- [ ] TINYBIRD_API_URL and TINYBIRD_API_TOKEN set in production environment
- [ ] Events flowing from production marketplace to Tinybird (verified in Tinybird dashboard)
- [ ] Internal user events (@keylead.com) tagged with `is_internal: true`
- [ ] No errors in production logs related to Tinybird
- [ ] No performance degradation on marketplace pages (Core Web Vitals unchanged)
- [ ] Dashboard displays "soon" initially (since no historical data exists yet)
- [ ] After sufficient data accumulates, verify dashboard shows correct numbers
- [ ] Tinybird free tier limits not exceeded (monitor QPS and storage)

**Links:** PRD Section 6 (Success Criteria)
