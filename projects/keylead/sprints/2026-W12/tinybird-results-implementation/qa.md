# QA Checklist: Tinybird & Results Implementation

## 1. Context
**Feature:** Tinybird on-platform view tracking + dashboard results
**User types:** Marketplace visitor (anonymous), Marketplace visitor (logged in), Agent (dashboard), Admin (@keylead.com)

## 2. Test Account Setup

| Account | State Required |
|---------|----------------|
| Agent (free tier) | Has at least 1 published listing, no promotions |
| Agent (paid tier) | Has multiple listings, at least 1 completed promotion with Late API views |
| Admin (@keylead.com) | Admin role, used for internal filtering verification |
| Anonymous visitor | No login — just browse marketplace |

## 3. Pre-Test Setup

- [ ] Tinybird workspace is created with `property_views` and `profile_views` data sources
- [ ] Tinybird Pipes are deployed (agent_property_views, agent_profile_views)
- [ ] Environment variables set: `TINYBIRD_API_URL`, `TINYBIRD_API_TOKEN`
- [ ] Marketplace is accessible with test listings published

## 4. Test Cases

### Tinybird Event Ingestion

**TC-1: Property view — listing detail page**
- Action: Visit `/listing/[slug]` as anonymous user
- Expected: `property_view` event sent to Tinybird with `location: "listing_detail"`, correct `listing_id` and `agent_id`

**TC-2: Property view — homepage card impression**
- Action: Load homepage, scroll to Discover Deals section
- Expected: `property_view` events fire for each listing card that enters the viewport. Events include `location: "homepage_discover"`.

**TC-3: Property view — search results**
- Action: Navigate to `/search`, wait for results to load
- Expected: `property_view` events fire for visible listing cards with `location: "search_results"`

**TC-4: Property view — AI search**
- Action: Navigate to `/search/ai`, run a search query
- Expected: `property_view` events fire for visible listing results with `location: "ai_search"`

**TC-5: Profile view — partner profile page**
- Action: Visit `/partner/[slug]` as anonymous user
- Expected: `profile_view` event sent with `location: "partner_detail"` and correct `partner_id`

**TC-6: Profile view — homepage partners section**
- Action: Load homepage, scroll to Partners section
- Expected: `profile_view` events fire for visible partner cards with `location: "homepage_partners"`

**TC-7: Profile view — partners directory**
- Action: Navigate to `/partners`
- Expected: `profile_view` events fire for visible partner cards with `location: "partners_directory"`

**TC-8: Event batching**
- Action: Rapidly scroll through homepage (multiple sections)
- Expected: Events are batched (not sent individually). Check network tab — should see batched POST requests every ~2 seconds, not one per card.

### Internal User Filtering

**TC-9: Internal user flag**
- Action: Log in as @keylead.com admin, browse marketplace listings
- Expected: Events sent to Tinybird with `is_internal: true`

**TC-10: Internal views excluded from agent dashboard**
- Action: As admin, view an agent's listing 10 times. Then check the agent's dashboard.
- Expected: Agent's Profile/Property Views should NOT include the admin's views. Verify in Tinybird that events exist with `is_internal: true` but are excluded by the Pipe query.

**TC-11: Regular user flag**
- Action: Log in as regular agent or anonymous user, browse marketplace
- Expected: Events sent with `is_internal: false`

### Dashboard Integration

**TC-12: Total Views sum**
- Action: Log in as agent with Tinybird data. Check dashboard.
- Expected: Total Views = Post Views (Late API) + Profile Views (Tinybird) + Property Views (Tinybird)

**TC-13: Period selector applies to all categories**
- Action: Switch between Today / Yesterday / 7 days / 30 days
- Expected: All three view categories update to reflect the selected period. Numbers change accordingly.

**TC-14: "soon" to number transition**
- Action: Check dashboard for agent with zero Tinybird data
- Expected: Profile Views and Property Views still show "soon". Total Views = Post Views only.
- Action: Generate some Tinybird views for that agent, refresh dashboard
- Expected: "soon" labels replaced with real numbers. Total Views now includes all three.

**TC-15: Tinybird API failure graceful degradation**
- Action: Temporarily set invalid Tinybird token, load dashboard
- Expected: Post Views shows normally (Late API). Profile/Property Views show "soon" (fallback). Dashboard does not error or crash.

### Cross-Location Tracking

**TC-16: Same listing tracked across multiple locations**
- Action: See a listing on homepage, then in search results, then click to detail page
- Expected: 3 separate `property_view` events with different `location` values, all with same `listing_id`

**TC-17: Listing agent card profile view**
- Action: Visit `/listing/[slug]`, agent contact card is visible in sidebar
- Expected: `profile_view` event with `location: "listing_agent_card"` for the listing's agent

**TC-18: Similar listings section**
- Action: Scroll to "Similar Listings" on a listing detail page
- Expected: `property_view` events for visible similar listing cards with `location: "similar_listings"`

## 5. Edge Cases

**TC-19: Rapid scroll (no minimum threshold)**
- Action: Quickly scroll past listing cards (< 200ms visibility)
- Expected: Events still fire. No minimum visibility threshold.

**TC-20: Agent views own listing**
- Action: Agent browses marketplace and views their own listing
- Expected: Event counted (no self-exclusion)

**TC-21: Deleted listing views**
- Action: View a listing, then delete it, check agent dashboard
- Expected: Historical views preserved and still count in totals

**TC-22: Multiple browser tabs**
- Action: Open same listing in 3 tabs
- Expected: 3 separate events (different session activity, each counts)

**TC-23: Mobile scroll tracking**
- Action: On mobile, scroll through homepage carousels
- Expected: IntersectionObserver fires correctly on mobile viewports. Events sent.

## 6. Polish Check

- [ ] No console errors related to Tinybird on any marketplace page
- [ ] Event batching doesn't cause noticeable performance degradation
- [ ] Dashboard loads in < 3 seconds even with Tinybird queries
- [ ] Numbers display with proper formatting (comma-separated: 1,234 not 1234)
- [ ] Period selector transitions are smooth (no layout shift when numbers change)
- [ ] "Updated X:XX PM" timestamp reflects latest data fetch
- [ ] No duplicate events on page reload (events should fire once per page load / card visibility)
