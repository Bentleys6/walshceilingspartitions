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

## 8. The 20 standard security checks

Go through every line each time and report ✅ / ➖ (not applicable, say why) / ❌.

| #   | Check                 | On this site                                                                                                                      |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hide API keys         | Automatic: security-scan test. Only public keys (Web3Forms) in src/.                                                              |
| 2   | Environment variables | Automatic: no .env committed. Secrets only in Cloudflare/GitHub settings, never in code.                                          |
| 3   | Keys in git history   | `git log -p --all` scan for key patterns before go-live and after any key was ever pasted.                                        |
| 4   | Protect admin routes  | ➖ No admin area. Required the moment one is added.                                                                               |
| 5   | Authentication / 2FA  | ➖ No logins on the site. Do turn on 2FA for GitHub, Cloudflare, domain registrar, email.                                         |
| 6   | User permissions      | ➖ No user accounts.                                                                                                              |
| 7   | Sanitise user inputs  | Form fields validated in QuoteForm; Web3Forms handles delivery. React escapes all text.                                           |
| 8   | XSS protection        | Automatic: no dangerouslySetInnerHTML/eval/innerHTML (security-scan test) + CSP header. JSON-LD only uses our own data.           |
| 9   | SQL injection         | ➖ No database.                                                                                                                   |
| 10  | Database rules (RLS)  | ➖ No database.                                                                                                                   |
| 11  | Rate limiting / spam  | Honeypot field + Web3Forms spam filtering. If spam arrives: add Cloudflare Turnstile (ask first).                                 |
| 12  | Spend caps            | Cloudflare Workers free plan and Web3Forms free plan can't bill. Any paid API added later must have a spend cap set.              |
| 13  | Secure file uploads   | ➖ No uploads (drawings go by WhatsApp).                                                                                          |
| 14  | CSRF protection       | ➖ No logged-in actions. TanStack Start's CSRF middleware stays on in src/start.ts.                                               |
| 15  | CORS settings         | ➖ The site has no API of its own.                                                                                                |
| 16  | HTTPS                 | Cloudflare. In the dashboard: SSL/TLS → Always Use HTTPS on; HSTS header set in code.                                             |
| 17  | Security headers      | Automatic: src/lib/security-headers.ts + security test.                                                                           |
| 18  | Secure cookies        | ➖ The site sets no cookies (consent stored in localStorage). Meta Pixel only after consent.                                      |
| 19  | Debug mode off        | Automatic: production build, no console.log/debugger (security-scan test), no source maps published, error pages show no details. |
| 20  | Production settings   | `siteUrl` is the live domain, Cloudflare production branch is `main`, form keys set.                                              |

Anything marked ➖ becomes required (and needs its own tests) as soon as the site gains that feature: logins, admin, database, uploads, payments or its own API. Ask before adding any of these.

## 9. Code security review

Before anything is merged to `main`, run the built-in `/security-review` skill on the changes and fix anything it finds.

## Ask first

New npm packages, any backend/database/auth, changing form submission logic, removing pages or changing URLs.
