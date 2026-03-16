# Tinybird Research Report

## Overview
Tinybird is a managed, serverless real-time data platform built on ClickHouse. It ingests data at scale, transforms it with SQL, and publishes results as low-latency REST API endpoints.

## Why Tinybird for Keylead
- **User-facing analytics** — Sub-100ms responses at thousands of concurrent requests
- **Event ingestion** — Events API accepts JSON/NDJSON via HTTP POST (up to 1,000 RPS)
- **SQL-native** — Pipes transform data with SQL, publish as API endpoints
- **Cost-effective** — Free tier (0.25 vCPU, 10GB), Developer from $25/mo, median production workspace < $10/mo
- **TypeScript SDK** — Define data sources, pipes, endpoints as strongly-typed TypeScript code
- **MCP Server** — AI agents can query Tinybird workspaces directly

## Architecture (3 Layers)
1. **Ingestion** — Events API, Kafka, S3, GCS connectors, PostgreSQL table functions
2. **Transformation** — Pipes (chained SQL queries), materialized views, Copy Pipes
3. **API Publishing** — REST endpoints with auth, rate limiting, row-level security, OpenAPI docs

## Pricing (vCPU-based)
| Plan | Cost | vCPUs | Storage | QPS |
|------|------|-------|---------|-----|
| Free | $0 | 0.25 | 10 GB | 10 |
| Developer | $25-299 | 0.25-3 | 25 GB | 10-55 |
| SaaS | Custom | 4-32 | 500 GB+ | 55-200 |

93% of non-enterprise customers pay < $100/month.

## Key Capabilities for Keylead
- Track pageviews, listing views, profile views in real-time
- Power discovery ranking algorithm (DiscoveryScore)
- Serve leaderboard APIs with millisecond latency
- Support future Discovery Ads product with real-time impression/click tracking
- Local development via Docker for dev/CI

## Limitations to Note
- No row-level updates/deletes (OLAP only)
- 10MB max request size per ingestion call
- Free tier limited to 1,000 queries/day
- ClickHouse knowledge needed for materialized views optimization
