# Product Vision: Dubai Real Estate Analyzer

**Created:** 2026-03-26
**Status:** Complete

## Elevator Pitch

A personal investment intelligence tool that tracks Dubai real estate prices over time — across buildings, neighborhoods, and off-plan projects — so you can spot where prices are actually dropping and make a confident, data-backed purchase decision in a 3-6 month window. Unlike Property Finder or Bayut, which only show you today's snapshot, this builds a historical dataset that reveals price trajectories and distress signals over weeks and months.

### Investment Thesis Context

Dubai is in a crisis period (Iran conflict). Expectation is that real estate prices will decline over the next 3-6 months. The goal is to build a dataset NOW so that when the buying window opens, decisions are data-backed. Target: off-plan projects under 500k AED, 2-year horizon.

### Core Differentiator

**Time-series market intelligence for a non-professional investor.** Portals show current listings. This tool builds the movie — tracking price drops, time on market, and area-level trends — so you can see which sub-500k AED off-plan projects are genuinely distressed vs. just listed high.

## Target User

**Who:** Personal investor (non-professional) with cash ready, looking to buy during a market downturn
**Core problem:** No way to systematically track how Dubai real estate prices move over time — portals only show today's snapshot, making it impossible to know if a deal is actually good
**Current workaround:** Casual browsing of Property Finder / Bayut with no systematic tracking — no historical data, no way to compare trends across projects or neighborhoods

## Why This, Why Now

**Timing:** Dubai real estate is entering a crisis period. Prices are expected to decline over the next 3-6 months, creating a buying window for distressed assets. The dataset needs to be built NOW — before the bottom — so decisions can be informed when the time comes.

**Painkiller:** Without systematic tracking, there's a real risk of buying at the wrong time, in the wrong area, or at a price that isn't actually discounted. The crisis window is finite — data collection can't start retroactively.

## Product Shape

**Interaction Model:** Data-first — the core product is a structured dataset of Dubai real estate listings tracked over time. Primary interaction is through Claude Code for analytics and querying. A lightweight dashboard may be added later for visualization, but the dataset IS the product.

**Platform:**
- Data collection: TBD (scraping, API, manual — to be decided during engineering)
- Analytics/querying: Claude Code (primary interface)
- Visualization: Optional lightweight web dashboard

## Boundaries

**This product is NOT:**
- A listing portal — not replacing Property Finder, no agent contact or buying flow
- A full analytics platform — not Bloomberg Terminal for real estate, just what's needed for one investment decision
- A SaaS product — built for personal use only, no multi-user, no monetization
- A real-time system — historical data collection over weeks/months, not live trading

**Where it ends:** This tool helps you decide WHAT to buy and WHEN. The actual purchase, agent negotiation, and transaction happen outside this tool. The primary value is the accumulated dataset and the ability to query it for insights.
