---
name: site-health-check
description: Security, speed and reliability checklist for this website. Use before going live or moving a domain, after adding any outside service (analytics, chat widget, map, embed, booking or form provider), after package updates or Dependabot pull requests, when asked for a health, security or speed check, and when starting a new client site from this one.
---

# Site health check

Run these in order and report results in plain English. Fix what fails; ask before anything in "Ask first".

## 1. One-command check

`npm run check` = lint, type check, tests, build, and a security scan of the packages that reach visitors (`bun audit --prod`). It must pass. The same check runs on GitHub ("Check site" workflow) on every push and weekly, and a hook in .claude/settings.json runs it before every `git push`.

## 2. Packages

- `bun audit` (all packages). Fix with `bun audit fix`, then `npm run check`.
- Anything left must be build-tool only (not in `bun audit --prod`); note it rather than forcing a major upgrade.
- Dependabot opens monthly update PRs. Merge only when the "Check site" workflow is green.

## 3. Security headers

- Pages: src/lib/security-headers.ts, applied in src/server.ts. public/_headers only covers static files.
- New outside service? Add its domain to the right line of the Content-Security-Policy AND to the host list in src/test/security.test.ts, or the browser blocks it.
- Verify in a browser (run the built site with `npx wrangler dev --config .output/server/wrangler.json`): load every page, check the console has no "Content Security Policy" errors, open the mobile menu, click "Show map".

## 4. Secrets and data

- No secret keys in src/ or public/ (Web3Forms access keys are public by design; anything else like Stripe secret, OpenAI, Supabase service keys must never be in the site).
- No database, logins or custom server code. Most breaches of AI-built sites come from these.

## 5. Content rules

- Photos: the client's own, or a licence that covers website use (bought stock, Pexels, Unsplash non-plus). Never images copied from other sites or stock previews.
- Never invent reviews, ratings, prices, guarantees or accreditations.

## 6. Speed

- Photos as WebP with -800 / -1600 versions, width and height set, lazy below the fold, hero preloaded.
- Heavy embeds (maps, videos) load on click.
- Compare page weight before and after big changes; homepage should stay under about 1 MB on a phone.

## 7. Go-live (domain move)

- Form key set and a real test enquiry received for every form.
- Domain email (MX/TXT) records copied into Cloudflare before switching nameservers.
- `siteUrl`, sitemap.xml and robots.txt point at the live domain; submit the sitemap in Google Search Console.
- Uptime monitor (e.g. UptimeRobot, free) on the homepage, alerting the site owner's agency email.

## Ask first

New npm packages, any backend/database/auth, changing form submission logic, removing pages or changing URLs.
