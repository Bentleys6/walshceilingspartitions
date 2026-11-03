---
name: web-design
description: CB Exposure's process for building and running client websites with Claude Code on Cloudflare, following Noah's Website Build SOP. Use whenever Noah says "website project: [client]", starts a new client site, rebuilds or moves a site from another builder (Landingsite, Lovable, Wix, Squarespace, WordPress, Framer), changes, speeds up or secures an existing client site, adds photos, forms, tracking or an outside service, asks about hosting or form tools, or takes a site live on its domain.
---

# CB Exposure web design

Noah (CB Exposure) builds marketing websites for local trade businesses. He is not a developer. Claude does as much of each step as it can, explains decisions in plain English with a recommendation, and pushes back on anything that would hurt the client. Every site has one job: get the visitor to call, WhatsApp or send the quote form.

This skill follows Noah's **Website Build SOP** (Notion › CB Exposure › Website Build SOP), step by step. At each step it says what Noah does and what Claude does for him. The aim is to make Noah's part as small as possible.

## Where things live

- **SOP:** Notion › CB Exposure › Website Build SOP. **Client tracker:** the Clients database it links to.
- **Build template:** Google Doc "Master Website Build Template" (Drive file `1aEqRB5Szbml8HT5IG1Hovqo_Sd_4j3SdKx-Kg4AUVVY`): Part 0 intake, Part 1 project rules (becomes CLAUDE.md), Part 2 build prompt (section 10 is the security kit), Part 3 testing and go-live.
- **Client folder:** Drive › Clients › [Business] (copied from `_Client Template`): 02 Brand, 03 Content › Raw (unsorted), 04 Website.
- **Reference sites on GitHub:** `bentleys6/walshceilingspartitions` (rebuilt from Landingsite, full safety kit) and `bentleys6/thomaspatioworks` (multi-step quote form, postcode check, before/after videos, Meta Pixel with cookie banner). Copy infrastructure from these, never content.
- **Each repo's CLAUDE.md / AGENTS.md** overrides this skill for that site.

If a doc or tool can't be reached, say which one and carry on with what can be done.

---

## SOP step 1–3: Onboard, requirements email, file what comes back

**Noah:** adds the Clients row, copies the Drive folder, sends the requirements email (the SOP has the text), and shares the Raw photos folder.
**Claude can:** fill in the requirements email for the client; check the Clients row and Drive folder exist and say what's missing; when answers come back, sort them against Part 0 of the template and list the gaps. Gaps to chase are usually: proof points with registration numbers, the Google review link, every area covered, quote form questions, and domain registrar access.

## SOP step 4: Build the master prompt ("website project: [client]")

1. Read the client's Notion row and page, their Drive folder (02 Brand, 03 Content) and the template.
2. Check everything against Part 0 and **list the gaps in one message**. Never fill a gap with a guess.
3. Combine the data with Part 1 and Part 2 into one master prompt. No `[BRACKETS]` left, nothing invented.
4. Save it as a Google Doc in the client's 04 Website folder.

**If the client already has a website (a rebuild):** crawl it first and use it as the main source for content, page structure and look (see "Rebuilds" below). Then the intake only needs what the old site lacks.

## SOP step 5: Prep. Claude does most of this

- **Photos:** Noah doesn't need squoosh. Claude downloads the originals from 03 Content (or the old site), finds duplicates and stock images, crops black bars from phone screenshots, and makes WebP versions at 800px and 1600px, named by content. Tool: `python3 scripts/optimise-images.py <dir> --report`, then run it with a mapping file (instructions at the top of the script).
- **Hero:** Claude suggests the best landscape photo and a portrait one from the same job.
- **Reference sites:** Claude can screenshot them itself with Playwright from the URLs.
- **Web3Forms:** the one thing that needs the client. They create **their own free Web3Forms account with their own email** (250 enquiries/month each, and the key is emailed to them to verify) and forward the key. Never put a client under Noah's account: it only allows 2 emails, and clients must not share. An optional second key copies enquiries to CB Exposure.

## SOP step 6: Build in Claude Code

- **Noah:** creates the private GitHub repo, selects only that repo when starting the Claude Code session, and connects it to Cloudflare (Workers & Pages → Create → GitHub; build `npm run build`, deploy `npx wrangler deploy`, production branch `main`). If the repo starts empty, `main` has to be created from the first branch, and then set as the default branch in GitHub settings.
- **Claude:** builds from the master prompt on the stack below, including the security kit (template Part 2, section 10). It shows homepage screenshots at 375px and 1440px before building the rest.

**Stack:** TanStack Start (React, server-rendered) + Tailwind v4 + TypeScript, built with Nitro to a Cloudflare Worker. Install with `bun install`. All content lives in `src/data/*` (business.ts, images.ts, services.ts, faqs.ts, work/results, formFields), never hard-coded in components. Forms post from the browser to Web3Forms. Until `formKeys.client` is set, forms must say "please call us", never pretend to send.

## SOP step 7: Test and fix

Claude runs these itself before Noah tests on his phone:

- `npm run check`: lint, type check, build, tests (including the security scan) and a package security scan. It must pass, and the pre-push hook enforces it.
- Run the built site in Cloudflare's local runtime in the background: `npx wrangler dev --config .output/server/wrangler.json --ip 127.0.0.1 --port 8787`. (`vite preview` doesn't work here.) Check every route's status, that unknown pages return 404, and that the security headers are present.
- Playwright: screenshot each page at 1440px and 390px, load every page checking the console for errors and Content-Security-Policy blocks, open the mobile menu, and step through the forms. Compare page weight with the old site.
- Fix what's wrong, then hand Noah a short phone checklist: Part 3 of the template.

**Changes after go-live:** work on a branch. Merge to `main` only when Noah says so and the GitHub "Check site" run is green. Run `/security-review` before merging (if `origin/HEAD` is missing, run `git remote set-head origin main` first). Never delete branches or rewrite history without asking.

## SOP step 8: Go live and hand over

1. The client's Web3Forms key is in, and a real test enquiry has arrived from every form.
2. **Find where the domain is actually registered.** Check the client doc against the live domain, because spellings differ. If the old builder registered it, check for transfer locks and fees.
3. **Copy the domain's email records (MX, TXT/SPF, DKIM) into Cloudflare DNS before switching nameservers.** This is the most common way a move silently breaks the client's email.
4. Add the custom domain to the Worker, set `siteUrl`, check `sitemap.xml`, and submit it in Google Search Console.
5. Cloudflare: SSL/TLS → Always Use HTTPS on. 2FA on GitHub, Cloudflare, the registrar and email. Free UptimeRobot monitor on the homepage.
6. Test on a phone: forms, Call, WhatsApp. Cancel the old host only after the new site is live and an enquiry has arrived, with a day's buffer.
7. Remind Noah to update the Clients row (Status = Active, Website URL) and ask for a Google review.

---

## Rebuilds from another builder

1. `node scripts/crawl-site.cjs https://www.client.co.uk <out-dir>` saves every page's text, meta tags, structured data, images, links and forms, screenshots at 1440px and 390px, and page weight (keep this as the "before" figure).
2. Read every page's text and look at every screenshot before writing code. Match wording, structure, colours (pull hex values from the site's CSS variables), fonts and section order.
3. **Keep every URL the same** (the sitemap lists them). Changing URLs loses Google rankings and breaks old links. Add a test that the slugs match.
4. Download the original photos (strip `?w=` resize parameters). Builders often hold the same photo 3–5 times; keep one copy. **Stock photos that came with the builder are licensed to the builder, not the client, so don't carry them over.**
5. Add what the old site lacked (see "Standard on every site"), then compare screenshots and weight against the old site. Builder sites typically weigh 3–5MB per page; ours should be under about 1MB.

## Standard on every site

- **SEO:** per-page title and description, canonical URLs, Open Graph and Twitter tags, a 1200×630 share image (hero photo plus logo), LocalBusiness / HomeAndConstructionBusiness JSON-LD, BreadcrumbList and FAQPage JSON-LD, sitemap.xml, robots.txt disallowing /thank-you.
- Thank-you page (noindex), a privacy policy matching what the site actually does, a 404 page, a mobile call/WhatsApp bar, a desktop WhatsApp button. Every tel:/wa.me link goes through PhoneLink/WhatsAppLink.
- Lead source capture (UTM, fbclid), a Meta Pixel that only loads after cookie consent, and a slot for the Cloudflare Web Analytics token.
- **UX and accessibility:** before handing over, check pages against the `ui-ux-pro-max` skill's rules (contrast, tap targets, visible labels, inline form errors, focus states, mobile layout) with targeted `--domain ux` searches. It's a checking tool: never let its `--design-system` output replace the client's brand or the template's design system.
- **Speed:** WebP at 800/1600 with width and height set, lazy loading below the fold, the hero preloaded. Maps (about 2MB) load on click; videos load near the screen. No animation or form libraries; remove unused template packages.
- **Security kit** (template section 10; see each repo's site-health-check skill):
  - security headers in `src/lib/security-headers.ts`, applied in `src/server.ts` (`public/_headers` only reaches static files)
  - `npm run check` and the security-scan test
  - GitHub Actions on every push and weekly, plus Dependabot monthly
  - the pre-push hook, CLAUDE.md (`@AGENTS.md`) and the site-health-check skill
  - any new outside service gets its domain added to the CSP and the security test
  - after package changes, run `bun audit fix` and leave zero vulnerabilities in what reaches visitors

## Hard rules

1. **Never invent** reviews, star ratings, job counts, years, prices, guarantees, accreditations or insurance. FAQ answers may only restate confirmed facts.
2. **Photos:** the client's own, or properly licensed (bought stock, Pexels, Unsplash non-plus). Never images copied from other websites or stock previews: iStock/Getty send invoices to the business. If there's no photo, use text only or a simple line drawing in the logo's style, and ask the client for a real phone photo.
3. **Clients never overlap:** no shared photos, text, form keys or accounts. Shared code is fine.
4. **No backend** (logins, admin, database, uploads, payments, custom APIs) without asking. Most breaches of AI-built sites come from these, and most online "20 security checks" lists only apply once a site has them.

## Decisions already made (don't relitigate without new facts)

- **Hosting: Cloudflare.** Vercel's free plan bans client work ($20/user/month Pro). Netlify forms are unlimited, but its free plan is one shared allowance per account, so one busy or spammed client can pause every site. Cloudflare is free for commercial use and keeps domain, DNS, email records and hosting together.
- **Forms: Web3Forms**, one free account per client.
- **One Claude Code cloud environment for every site.** Network access is Full. The setup script loops over every repo with a package.json and never fails the session. Anything outside a repo is wiped when the session ends, so rules, skills and checks live in each repo and in this skill.
