# TPPS Website SEO Validation Plan

## Scope

Website: `apps/web`

Current architecture: Astro static site with React components and Astro page routes. This is no longer a Vite + React SPA and there is no TanStack migration work to plan here.

Primary SEO goal: improve local search visibility for landscaping, patios, driveways, fencing, groundworks, garden design, garden maintenance, and related garden work across Thanet and East Kent.

Canonical domain: `https://www.tppslandscapes.com/`

## Current Implementation Status

### Completed

- `apps/web` is running on Astro static generation, not a client-rendered SPA.
- Homepage metadata is generated from shared content in `@tpps/content`.
- Service pages exist as crawlable static routes under:
  - `/services/patios-pathways/`
  - `/services/driveways/`
  - `/services/fencing/`
  - `/services/groundworks/`
  - `/services/garden-design/`
  - `/services/garden-maintenance/`
  - `/services/tree-removal/`
- Canonical URLs, meta descriptions, Open Graph tags, Twitter card tags, and social image metadata are present in the shared site layout.
- Homepage JSON-LD for `LocalBusiness` and `LandscapingBusiness` is in place.
- Service pages include `Service` and `BreadcrumbList` JSON-LD.
- SEO-critical content has been moved into `packages/content` so the website and other channels share the same source text.
- Company phone, email, service area, and SEO location lists are now driven from shared content.
- `seo-in-astro` is configured in Astro and is generating `robots.txt` and sitemap output during build.
- The current generated robots file points to `sitemap-index.xml`, which matches the plugin's actual output.
- Playwright axe accessibility coverage exists for the homepage and all current service pages.
- `pnpm test:web:e2e` is passing.
- Lighthouse CI is configured and `pnpm test:web:lighthouse` is currently passing.
- The footer contrast issue introduced during SEO work was fixed and revalidated through Playwright.

### Partially Completed

- Local SEO town coverage is improved and now shared from content, but the site still needs more deliberate page-level targeting beyond the homepage and service pages.
- Real local work imagery is in place for some service galleries, but not all user-facing imagery has been fully normalized into a consistent local-first asset strategy.
- The site has working service galleries with progressive enhancement, so the old broken `#gallery` concern is no longer current. Gallery coverage is still limited to some service pages.

### Still Open

- No dedicated area pages exist yet for target towns.
- Privacy policy and terms pages are not yet implemented as crawlable routes.
- Search Console submission and production indexing validation are still operational tasks, not yet recorded as complete.
- Analytics event tracking for quote clicks, phone clicks, and email clicks is not yet documented as complete.
- Review/testimonial strategy and any eligible review schema remain open.
- Some content still references broad regional coverage rather than purpose-built town landing pages.

## Current Findings

### Verified Good

- Astro static output is being built into `apps/web/dist`.
- Service pages contain real HTML content before JavaScript execution.
- Canonical domain usage is aligned to `.com`.
- Homepage social sharing metadata uses `https://www.tppslandscapes.com/og-image.jpg`.
- Shared content is now the source of truth for homepage SEO metadata and the location/service summary text.
- The current a11y regression introduced during SEO work has already been fixed and covered by automated tests.

### Remaining Risks

- The current sitemap output shape is plugin-driven: `robots.txt` points to `sitemap-index.xml`, not `/sitemap.xml`. This is valid, but should stay intentional and be rechecked if the plugin configuration changes.
- `seo-in-astro` build logs still report `llms.txt` creation even with `llmsTxt: false`, so output should continue to be verified in `dist` rather than assumed from logs.
- Area intent is currently handled through shared copy and service descriptions rather than dedicated area landing pages.
- Legal and trust content is still lighter than a production-hardened local business site should be.

## Validation Checklist

### 1. Crawlability and Indexability

- Confirm the generated homepage and service pages exist in `dist` after every SEO-affecting change.
- Validate `dist/robots.txt` and `dist/sitemap-index.xml` after build.
- Confirm canonical tags point to `https://www.tppslandscapes.com/` and the correct service URLs.
- Confirm raw built HTML contains page copy, metadata, and JSON-LD before JavaScript executes.
- Confirm pages remain readable and navigable with JavaScript disabled.
- Run a crawler against local preview and production to verify status codes, canonicals, and indexability.

### 2. Metadata and SERP Presentation

- Keep homepage title and meta description sourced from `@tpps/content`.
- Keep service-page titles and descriptions unique and route-specific.
- Keep Open Graph and Twitter metadata aligned with the canonical `.com` domain.
- Keep the social preview image stable and verify WhatsApp/OG previews after any image change.
- Recheck `og:image:alt` and visible on-page relevance whenever homepage/service copy changes.

### 3. Structured Data

- Keep homepage `LocalBusiness` and `LandscapingBusiness` JSON-LD aligned with shared company content.
- Keep service-page `Service` and `BreadcrumbList` schema aligned with route content.
- Validate homepage and a sample of service pages with Rich Results Test or Schema Markup Validator after schema changes.
- Only add FAQ schema if matching visible FAQ content is introduced.

### 4. Local SEO

- Keep company details in `packages/content/src/company.ts` as the single source of truth.
- Keep the shared featured towns and full service-area towns consistent across homepage, service pages, and schema.
- Add dedicated area pages for the strongest towns when ready.
- Align live website details with Google Business Profile and Search Console.
- Add stronger town-level project proof where genuine examples exist.

### 5. Content and Keyword Coverage

- Keep homepage copy aligned with the agreed service list and local intent.
- Keep service pages internally linked and individually optimized.
- Add dedicated area pages for core locations instead of relying only on shared regional phrasing.
- Add FAQ content for pricing approach, site visits, drainage, waste removal, materials, and timescales if those questions recur.
- Continue moving any remaining website-owned content into `@tpps/content` where it should be shared outside the website.

### 6. Technical Performance

- Keep Astro static output and avoid unnecessary client hydration.
- Keep Lighthouse CI thresholds enforced:
  - Performance: `>= 0.90`
  - Accessibility: `>= 0.95`
  - Best Practices: `>= 0.95`
  - SEO: `>= 0.95`
  - Largest Contentful Paint: `<= 2500ms`
  - Cumulative Layout Shift: `<= 0.1`
  - Total Blocking Time: `<= 200ms`
- Re-run Lighthouse after any substantial metadata, layout, image, or dependency change.
- Continue reducing unnecessary JavaScript on static marketing pages.
- Keep hero and gallery imagery optimized with explicit sizing and sensible loading behavior.

### 7. Accessibility and Semantic HTML

- Keep Playwright axe coverage passing for homepage and all service pages.
- Maintain one clear `h1` per page and a logical heading structure.
- Recheck color contrast after any footer, hero, or overlay text changes.
- Keep gallery controls keyboard accessible and touch-friendly.
- Expand automated a11y coverage when area pages or legal pages are added.

### 8. Trust, Conversion, and E-E-A-T Signals

- Add real privacy policy and terms pages.
- Add stronger trust content where accurate: insurance, experience, review sources, and quote process detail.
- Keep contact details consistent everywhere.
- Keep quote CTAs prominent and measurable.

### 9. Analytics and Monitoring

- Keep Cloudflare Web Analytics as the chosen analytics direction unless requirements change.
- Add explicit event tracking for quote clicks, phone clicks, and email clicks if not already wired.
- Submit the sitemap in Google Search Console once production SEO output is finalized.
- Monitor indexing, Core Web Vitals, and local query performance monthly.

## Suggested Next Steps

1. Add dedicated area pages for the strongest target towns.
2. Add real `privacy` and `terms` routes and link them from the footer.
3. Validate live production robots, sitemap index, canonicals, and schema after deployment.
4. Replace any remaining non-local or placeholder imagery where possible with real TPPS work.
5. Add Search Console submission and ongoing indexing checks to the operational workflow.

## Reference Guidance

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google rendering troubleshooting: https://developers.google.com/search/docs/guides/rendering
- Google technical requirements: https://developers.google.com/search/docs/essentials/technical
