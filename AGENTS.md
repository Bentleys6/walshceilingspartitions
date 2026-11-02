## Walsh Ceilings and Partitions site
- All business facts, photos, services, Our Work galleries and FAQs live in src/data/*; components never hard-code them, so content changes are data-only.
- Photos are WebP files in public/images/ (an -800 and, where the original was big enough, a -1600 version) referenced via src/data/images.ts. Missing files render a "photo to be supplied" placeholder.
- URLs match the old Landingsite site (/services/ceilings, /services/partitions, /services/plastering, /services/tape-jointing, /our-work, /reviews, /contact). Don't rename them: Google rankings and old links depend on them. Keep public/sitemap.xml in step with the pages.
- Enquiry forms post to Web3Forms from the browser; no database. Until business.formKeys.client is set, forms tell visitors to call instead of pretending to send.
- Every tel:/wa.me link uses PhoneLink/WhatsAppLink so the Meta Contact event fires; tracking is a no-op while metaPixelId is empty.
- Router scrollRestoration is off; useRouteEffects in Layout handles scroll-to-top and #hash scrolling.

# Rules for Claude Code
- Start every session with git pull.
- Work on a branch and share the Cloudflare preview URL for approval; merge to main only when approved (main is live).
- Make the smallest change that achieves each request. Do not restyle or rewrite anything that wasn't mentioned.
- Change content in the src/data files, not in components.
- Never invent reviews, star ratings, job counts, accreditations, prices or guarantee claims. FAQ answers must only use facts stated elsewhere on the site or confirmed by Daniel.
- Don't use stock photos on the site without a licence that covers it.
- No new npm packages, backend, database or auth without asking first.
- Don't change the form submission logic unless asked.
- After every change, run npm run build and npm test, and fix any errors before committing.

# Hosting
- Cloudflare Workers Builds from this GitHub repo. Build `npm run build`, deploy `npx wrangler deploy` (default; uses the config the build generates in .output/), production branch `main`. See README.md.
- public/_headers sets browser caching for /images/*; Nitro adds long-lived caching for /assets/* at build time.
- Cloudflare Web Analytics is cookie-free and turns on when `cloudflareAnalyticsToken` is set in src/data/business.ts.
