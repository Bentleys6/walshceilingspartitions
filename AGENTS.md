## Walsh Ceilings and Partitions site
- All business facts, photos, services, Our Work galleries and FAQs live in src/data/*; components never hard-code them, so content changes are data-only.
- Photos are WebP files in public/images/ (an -800 and, where the original was big enough, a -1600 version) referenced via src/data/images.ts. Missing files render a "photo to be supplied" placeholder.
- URLs match the old Landingsite site (/services/ceilings, /services/partitions, /services/plastering, /services/tape-jointing, /our-work, /reviews, /contact). Don't rename them: Google rankings and old links depend on them. Keep public/sitemap.xml in step with the pages.
- Enquiry forms post to Web3Forms from the browser; no database. Until business.formKeys.client is set, forms tell visitors to call instead of pretending to send.
- Every tel:/wa.me link uses PhoneLink/WhatsAppLink so the Meta Contact event fires; tracking is a no-op while metaPixelId is empty.
- Router scrollRestoration is off; useRouteEffects in Layout handles scroll-to-top and #hash scrolling.

# Rules for Claude Code
- Start every session with git pull.
- Commit and push straight to main for normal changes (wording, photos, content, small layout tweaks); main is live and the owner prefers speed. Use a branch and ask before merging only for risky changes: form submission, security headers, packages, outside services, hosting, or large redesigns.
- Make the smallest change that achieves each request. Do not restyle or rewrite anything that wasn't mentioned.
- Change content in the src/data files, not in components.
- Never invent reviews, star ratings, job counts, accreditations, prices or guarantee claims. FAQ answers must only use facts stated elsewhere on the site or confirmed by Daniel.
- Don't use stock photos on the site without a licence that covers it.
- No new npm packages, backend, database or auth without asking first.
- Don't change the form submission logic unless asked.
- After every change, run `npm run check` (lint, type check, tests, build, security scan) and fix anything that fails before committing. A hook runs it automatically before every `git push` and blocks the push if it fails; never bypass it.
- Use the site-health-check skill (.claude/skills/site-health-check) before go-live, after adding any outside service, and after package updates.
- Adding an outside service (analytics, embed, chat, booking, form provider): add its domain to the Content-Security-Policy in src/lib/security-headers.ts and to src/test/security.test.ts.
- Keep secrets out of the site. Only public keys (like the Web3Forms access key) may go in src/. The security-scan test fails the check if a key pattern, .env file, raw-HTML injection, debug leftover or source map appears.
- Security check every time: `npm run check` after every change (the hook enforces it on push), plus the built-in `/security-review` on the changes before anything is merged to main. Report the result in plain English.
- The site has no logins, admin, database, uploads or API of its own, which removes most of the standard "20 security checks". Adding any of these needs asking first, and then the matching checks in the site-health-check skill become required.

# Hosting
- Hosted on Cloudflare Workers. GitHub Actions deploys it: the "Check site" workflow runs every check on a push to main and then `npx wrangler deploy --name walshceilingspartitions` (needs the CLOUDFLARE_API_TOKEN repo secret; keep `--name`, the build's generated config uses a different Worker name). Cloudflare Workers Builds is not connected. See README.md.
- After every push to main, wait for the "Check site" run on that commit to finish, including its "Deploy to Cloudflare" step (public API: https://api.github.com/repos/Bentleys6/walshceilingspartitions/actions/runs?head_sha=<sha>; about 1–2 minutes). Only tell the owner a change is live once it succeeded. If it fails, read the job log, fix it and say what happened.
- Security headers for pages are set in src/lib/security-headers.ts (applied in src/server.ts); public/_headers only reaches static files (images caching, nosniff, HSTS). Nitro adds long-lived caching for /assets/* at build time.
- GitHub Actions ("Check site", .github/workflows/check.yml) runs `npm run check` steps on every push, pull request and weekly. Don't merge to main while it's red.
- Dependabot (.github/dependabot.yml) opens monthly package update PRs; merge when the check is green.
- Cloudflare Web Analytics is cookie-free and turns on when `cloudflareAnalyticsToken` is set in src/data/business.ts.
