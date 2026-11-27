# Zero Clicks — Competitor Watch Setup

Competitor intelligence for `0-clicks.uk`. Nothing is monitored yet — this is the setup contract for when the watchlist is frozen.

## Watchlist (draft)

| Company | Domain | Geography | What they sell | Approx. price |
|---|---|---|---|---|
| Yext | yext.com | US/UK | Multi-location reputation management | £400+/month |
| Birdeye | bird-eye.com | US/UK | Reputation + customer experience | Enterprise |
| Generic auto-reply bots | various | Global | Template-based review replies | Low cost |

## Real competition

Pub owners doing nothing. In the reviewed set, 26 of 30 pubs were not replying to reviews.

## Event categories to track

- Pricing changes
- Product launches
- UK hospitality moves (partnerships with pub groups, POS integrations)
- Funding and executive moves
- Incidents (outages, security)

## Sources per company

1. Official newsroom / blog / changelog
2. Pricing and product pages
3. Trade press (Morning Advertiser, The Caterer, Publican's Morning Advertiser)
4. LinkedIn company page and job postings (weak signal only)

## Procedure

Use the Hermes `competitor-news-monitor` skill:
1. Freeze the watchlist (names, domains, categories, cadence, materiality threshold)
2. Register primary sources
3. Schedule a weekly cron tick (every Monday 9am)
4. On each run: collect from last cutoff, deduplicate by event, assess materiality, deliver digest or stay silent
5. Record source failures as coverage gaps, never as "no news"

## State file

`~/.hermes/competitor-watches/zero-clicks-uk.json` — to be created on first setup run.

## Deliverable format

Per event: company, event, date, evidence links, what changed, why it matters, confidence.
