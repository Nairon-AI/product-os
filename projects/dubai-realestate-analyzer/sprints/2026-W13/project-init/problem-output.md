# Problem Output

## Core Desire

**Why now:** The market downturn is happening now. Data collection can't be backfilled — every week without tracking is a permanent gap. The goal is to have months of price history by the time prices bottom out (estimated 3-6 months).

**What success looks like:**
1. **Know what exists** — a clean, organized inventory of Dubai off-plan projects, neighborhoods, and their current state (price, supply, availability)
2. **Track over time** — watch how these numbers change week over week to spot real trends vs. noise
3. **Future projections** — understand where things are heading, not just where they've been

**Underlying need:** Reduce uncertainty. As a non-professional investor with cash ready, the risk isn't missing the perfect deal — it's making a poorly-informed decision on a large purchase. The tool replaces gut feeling with data.

## Reasoning Chain

**Approach:** Collect listing data → store locally → query with Claude Code. Build custom rather than buy.

**Why build custom is the right call:**
- Owning the data means full control over what's tracked, how it's queried, and how it's analyzed
- Claude Code as the analytics layer means unlimited flexibility — no dashboard limitations
- The value is in the accumulated dataset, not the tool itself

**Key assumption to validate:**
- **Data availability is the biggest risk.** Property portals (Property Finder, Bayut) may block scraping, have incomplete data, or not expose the fields needed (like listing date, price changes). This needs to be validated early — if data can't be collected, the entire approach needs to pivot (manual entry, DLD transaction data, developer price lists, etc.)

**Assumptions we're accepting:**
- Listed prices are a useful proxy even if they don't match transaction prices (they show direction and relative value)
- Off-plan is the target category (user's conviction, not something we need to validate)
- Claude Code is a sufficient analytics interface (no web UI needed initially)

## Blind Spots

1. **DLD transaction data:** Dubai Land Department publishes actual transaction prices — these show what people actually paid, not just what sellers are asking. Could be a more reliable signal than listing prices. Should investigate whether this data is accessible and how to incorporate it alongside portal listings.

2. **Developer payment plans:** Off-plan pricing isn't just the sticker price. A 500k AED unit with 60/40 payment plan vs. one with post-handover payments have very different real costs and cash flow implications. The data model should capture payment plan structures, not just headline prices.

## Risks

**Risk of building:**
- **Data collection fails** (HIGH) — Property portals may block scraping, APIs may not exist, or data may be too incomplete to be useful. Mitigation: validate data availability FIRST before building anything else. Have fallback strategies (DLD data, manual entry, developer price lists).

**Risk of NOT building:**
- **Buying blind** (HIGH) — Without systematic data, a 300-500k AED purchase decision is based on gut feel and portal snapshots. Risk of overpaying, picking the wrong area, or buying something that's not actually distressed.

**Net assessment:** The cost of building is time (Claude Code makes it fast). The cost of not building is potentially overpaying by tens of thousands of AED on a major purchase. Build.

## Problem Statement

**There is no way to systematically track Dubai off-plan real estate prices over time, leaving a cash-ready investor unable to distinguish genuinely distressed assets from normal market noise during a crisis-driven downturn.**

### Supporting Context
- **Core need:** A structured, growing dataset of Dubai off-plan projects and listings that reveals price trends, supply dynamics, and distress signals — queryable through Claude Code
- **Key risks:** Data collection feasibility (portal access) is the make-or-break dependency; without data, the tool is worthless
- **Blind spots to watch:** DLD transaction data may be more reliable than listing prices; payment plan structures significantly affect real investment cost and should be captured
