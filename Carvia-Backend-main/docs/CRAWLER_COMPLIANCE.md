# Crawler compliance and operations

Carvia’s crawler is designed to index public job listings, not candidate or recruiter data.

## Required source review

Before adding a source, record its owner, terms URL, robots URL, permitted listing path, contact address, crawl interval, and approval date. Enable only public, unauthenticated pages that the owner permits crawling. The first supported adapters target public Greenhouse and Lever feeds, which are intended for published job boards. Static and Playwright adapters require explicit selector configuration and run `robots.txt` checks before requesting a page.

## Non-negotiable restrictions

- Never bypass a CAPTCHA, login wall, paywall, anti-bot measure, or robots exclusion.
- Never scrape candidate, recruiter, profile, or application data.
- Use the configured identifiable user agent, minimum host delay, retry backoff, and caching.
- Stop the source and investigate 401, 403, 429, legal complaints, abnormal errors, or a terms change.
- Preserve original job/apply URLs and send candidates to the original source to apply.

## Operational model

`CRAWLER_ENABLED=false` is the safe default. In production, run source jobs in BullMQ workers with Redis, persist crawl logs/sync status in PostgreSQL, and apply RBAC to all `/v1/admin/crawler/*` routes. The in-process scheduler included here is appropriate only for a single-instance demo.

```text
Approved source config → adapter → robots/rate-limit gate → normalize → dedupe
                                                        ↓
                                             crawl log / source health
                                                        ↓
                                         PostgreSQL jobs + historical state
```
