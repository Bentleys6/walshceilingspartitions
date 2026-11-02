# Walsh Ceilings and Partitions

Website for Walsh Ceilings and Partitions Ltd, ceilings, partitions and plastering contractor based in Hoddesdon, Hertfordshire. Rebuilt from the original Landingsite.ai site with the same pages, URLs, wording and design.

## Stack

- TanStack Start (React, server-rendered) with Tailwind CSS
- Builds to a Cloudflare Worker (`.output/`, via Nitro's `cloudflare-module` preset)
- Enquiry forms post to Web3Forms from the browser; no database or backend

All content (business details, services, photos, Our Work galleries, FAQs) lives in `src/data/`. See `AGENTS.md` for the working rules.

## Development

Needs Node.js 22+.

```sh
bun install     # or: npm install --legacy-peer-deps
npm run dev     # local dev server
npm run build   # production build into .output/
npm test        # unit tests
npm run check   # everything: lint, types, tests, build, security scan
```

## Safety checks

- **GitHub Actions** (`.github/workflows/check.yml`): lint, type check, tests, build and a package security scan on every push and pull request, plus weekly. Don't merge a red ✗ to `main`.
- **Dependabot** (`.github/dependabot.yml`): monthly package update pull requests, tested by the workflow.
- **Security headers** (`src/lib/security-headers.ts`): Content-Security-Policy, HSTS, clickjacking and sniffing protection on every page.
- **Claude Code**: `CLAUDE.md` loads the rules in `AGENTS.md`; a hook runs `npm run check` before every `git push`; the `site-health-check` skill holds the full checklist.

## Deploying to Cloudflare

Cloudflare Workers Builds deploys automatically from GitHub:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (the default; it finds the config the build writes to `.output/`)

Other branches get preview URLs, so changes can be checked before they go live.

## Go-live checklist

- [ ] Web3Forms access key in `business.formKeys.client` (forms show a "call us" message until it's set)
- [ ] Cloudflare Web Analytics token in `business.cloudflareAnalyticsToken`
- [ ] Copy the domain's email (MX/TXT) records into Cloudflare DNS before switching nameservers
- [ ] Point www.walshceilingspartitions.co.uk at the Worker, and redirect the bare domain to www
- [ ] Submit `/sitemap.xml` in Google Search Console
- [ ] Free uptime monitor (e.g. UptimeRobot) on the homepage
- [ ] Real photo of a metal stud partition for `metal-stud-partitions` in `src/data/services.ts`
