# Problem Statement — Tinybird & Results Implementation

## Synthesize

Three clusters emerged from discovery:

| Cluster | Theme | Urgency |
|---------|-------|---------|
| **A: Visibility Gap** | Agents can't see their results. Ops tells them manually. No self-service ROI proof. Retention risk. | **NOW** |
| **B: Infrastructure Gap** | No event tracking on the marketplace. Can't measure anything on-platform. Tinybird must be set up first. | **NOW** |
| **C: Revenue Enabler** | Discovery Ads need impression/click tracking. No Tinybird = no ads = no revenue. | **April** |

**Selected priority:** A + B together — they're intertwined. You can't show agents results (A) without tracking infrastructure (B). And B without A is infrastructure with no user value. They must ship together.

Cluster C (ads) is the downstream beneficiary — it builds on A+B but is a separate sprint.

## Narrow Down

**Selected focus:** End-to-end — Tinybird tracking + agent-facing results view, shipped together.

**Reasoning:** Infrastructure without a user-facing result is invisible work. A results view without real tracking data is a fake number. Both must ship as one coherent unit:
1. Tinybird captures on-platform views (listing pages, homepage impressions)
2. Late API captures off-platform views (Instagram promotions)
3. Agent dashboard shows one combined total

**Out of scope for this sprint:** Discovery Ads (placement injection, billing, admin). That's a follow-up sprint leading to April launch.

## Articulate

**Problem Statement:** Real estate agents paying for Keylead promotions have no self-service way to see if their investment is working. The ops team manually reports results, which doesn't scale. Meanwhile, Keylead has zero on-platform view tracking — only off-platform Instagram data via Late API. We need to set up Tinybird to track on-platform marketplace views and build an agent-facing results view that combines on-platform + off-platform views into one total number.

**Why This Problem:** Agents need proof of ROI to stay subscribed and upgrade. Without self-service results, every "how am I doing?" costs ops team time. And without on-platform tracking, half the picture is missing — agents don't know their listings are being seen on the Keylead marketplace itself.

**What We're NOT Solving:**
- Discovery Ads product (placement injection, billing, admin management)
- Leaderboards or competitive ranking between agents
- Detailed per-listing or per-placement-zone analytics breakdowns
- Full marketplace-wide impression tracking across all 10 zones (starting with listing pages only)
- Ad impression billing or CTR reporting

## Defend Check

**Defense:** "You can't sell ads without proving the tracking works first. Tinybird + results is the foundation that makes Discovery Ads possible. If we skip straight to ads, we'd have no way to measure impressions, no way to prove delivery to advertisers, and no credibility with agents. Foundation before product."

**Stakeholder alignment:** Direct match with the Slack message — "really need to get tinybird set up so we can shift to the introduction of keylead ads." This sprint IS "getting tinybird set up" + giving agents immediate value (results view) while the ads product is designed next.

**Confirmed:** Problem statement is defensible and aligned with priorities.
