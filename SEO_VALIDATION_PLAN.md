# TPPS Website SEO Validation Plan

## Scope

Website: `apps/web`, currently a Vite + React single-page site for TPPS Landscapes. Target architecture should be React-authored static generation: use React components at build time to emit crawlable HTML, ship CSS and optimized assets, and send little or no customer-facing JavaScript unless a page genuinely needs interaction.

Primary SEO goal: improve local search visibility for landscaping, patios, driveways, fencing, groundworks, garden design, and garden maintenance across Thanet and East Kent, especially Broadstairs, Ramsgate, Margate, Westgate-on-Sea, Birchington, Sandwich, and Deal.

## Current Findings

### Critical

- The static HTML title is still `figma` in `apps/web/index.html`.
- The initial HTML contains only `<div id="root"></div>`, so primary page content is injected client-side after JavaScript runs.
- The current SPA architecture sends JavaScript for content that could be static HTML. This is unnecessary for most local business pages and adds crawl/rendering risk.
- There is no meta description, canonical URL, robots directive, Open Graph metadata, Twitter/X card metadata, or structured data.
- There is no visible sitemap or robots file under `apps/web/public`.
- The navigation links to `#gallery`, but no matching `id="gallery"` section exists in `Home.tsx`.
- Contact details should stay consistent across the site and any launch collateral: use `tim@tppslandscapes.com` and `07886 106 517`.

### High

- The site appears to be a one-page SPA, but the business has multiple local service intents that would benefit from crawlable landing pages: patios, driveways, fencing, groundworks, garden design, garden maintenance, and location pages.
- Images are loaded from long Unsplash URLs. This creates external dependency, weaker local relevance, less control over asset names, and potential performance instability.
- Hero image is likely the Largest Contentful Paint element but is not explicitly optimized with local dimensions, responsive `srcset`, preload/fetch priority, or predictable sizing.
- Testimonials appear as plain page content only. If reviews are genuine and eligible, they should be supported by appropriate review/testimonial presentation and structured data used cautiously.
- Footer social links and legal links currently point to `#`, which creates dead links and poor trust signals.

### Medium

- Service cards are clickable-looking `div`s but do not link to service detail pages or sections.
- Image alt text is generic in places, for example `Background`.
- No visible business address or service-area entity data is exposed beyond broad copy.
- There is no Google Business Profile validation checklist tied to the same NAP details used on the site.
- No FAQ content is present for common conversion and long-tail search questions.

## Target Static Generation Approach

- Keep React for authoring page templates, shared layout, service cards, area pages, metadata generation, and structured data generation.
- Replace client-side routing for public marketing pages with build-time route generation that outputs real files such as `dist/index.html`, `dist/services/patios-pathways/index.html`, and `dist/areas/broadstairs/index.html`.
- Render each SEO page to HTML at build time using React server rendering or a static-site framework.
- Default to zero hydration for content pages. Navigation, CTAs, service cards, footer links, accordions, and galleries should work as normal HTML/CSS.
- Add tiny, page-scoped JavaScript only for features that truly need it, such as an enhanced mobile menu, analytics events, or a future quote form. Prefer progressive enhancement so the page remains fully usable without JavaScript.
- Generate per-page `<title>`, meta description, canonical URL, Open Graph tags, and JSON-LD during the same build step as the HTML.
- Generate `sitemap.xml` from the route manifest so every static page is discoverable.
- Preserve Cloudflare Pages deployment: output static assets to `apps/web/dist`.

Recommended implementation path:

1. Add a static route manifest for home, service pages, area pages, legal pages, and future project/gallery pages.
2. Split the current `Home.tsx` into React components that do not depend on browser-only APIs.
3. Replace `createBrowserRouter` for public pages with static HTML generation. Keep a small client entry only if a component explicitly needs hydration.
4. Add a build script that renders each route to an HTML file and copies Vite-built CSS/assets.
5. Remove the default full React app bundle from static content pages once equivalent no-JS HTML output is verified.
6. Validate generated HTML using local `dist` output, not only the Vite dev server.

Framework decision:

- **Chosen direction: Astro with React islands.** This is the best fit for mostly-static local business pages with React components and minimal client JavaScript.
- Keep React components for reusable sections and page templates, but let Astro own routing, page shells, metadata, static generation, and selective hydration.
- Do not hydrate React components by default. Add Astro client directives only when an island truly needs browser behavior.
- Avoid converting the site into a full client app inside Astro. The value of the migration is HTML-first output.

Alternatives no longer preferred:

- **Vite custom SSG:** viable but adds custom routing, metadata, asset, sitemap, and hydration plumbing.
- **TanStack Start static prerendering:** strong React-first option, but more app-shaped than this site needs.
- **Next.js static export:** capable, but a larger framework shift with less benefit for a mostly-static local service website.

### CSS Cleanup and Build Pipeline

- Use Astro's Vite pipeline with Tailwind CSS 4.
- Use Lightning CSS for CSS transforms, minification, and modern syntax lowering where supported by the Astro/Vite setup.
- Treat Lightning CSS as a build optimizer, not the whole cleanup strategy. Also remove unused theme tokens, empty files, Figma leftovers, and animation imports that are not used.
- Keep CSS mostly static and global where practical. For this site, simple HTML + Tailwind utilities + a small design-token layer is enough.
- Audit the current CSS files:
  - `apps/web/src/styles/index.css`
  - `apps/web/src/styles/tailwind.css`
  - `apps/web/src/styles/theme.css`
  - `apps/web/src/styles/globals.css`
- Remove `tw-animate-css` unless there are real, visible animations that improve the site.
- Reduce the generated CSS payload after the Astro migration and verify the final CSS bundle size during build.

## Validation Checklist

### 1. Crawlability and Indexability

- Run a crawl against the production URL and local preview using Screaming Frog, Sitebulb, or an equivalent crawler.
- Confirm HTTP status codes, redirects, canonical handling, indexability, and crawl depth.
- Verify raw generated HTML contains the primary page content, headings, links, metadata, and structured data before any JavaScript executes.
- Verify Google can fetch and render the generated static pages using Google Search Console URL Inspection once deployed.
- Confirm public pages remain readable and navigable with JavaScript disabled.
- Add and validate `robots.txt`.
- Add and validate `sitemap.xml`.

### 2. Metadata and SERP Presentation

- Replace the placeholder title with a local-service title, for example:
  `TPPS Landscapes | Landscaping, Patios & Driveways in Thanet`
- Add a concise meta description focused on services, service area, and quote intent.
- Add canonical URL.
- Add Open Graph and Twitter/X card tags for sharing.
- Use a production preview image that represents actual TPPS work where possible.
- Confirm title and description are unique for every future service/location page.

### 3. Structured Data

- Add JSON-LD for `LocalBusiness` or a more specific eligible subtype, including name, URL, phone, email, service area, sameAs links, and opening/contact details.
- Add `Service` structured data for core services where page content supports it.
- Add `FAQPage` schema only if matching visible FAQ content exists.
- Add `BreadcrumbList` schema when multi-page service/location pages are introduced.
- Validate with Google Rich Results Test and Schema Markup Validator.

### 4. Local SEO

- Choose one canonical NAP source and update every app/content module to match it.
- Confirm whether TPPS has a public address, service-area-only setup, or appointment-only office and reflect that consistently.
- Align website details with Google Business Profile.
- Add service-area copy that naturally references Thanet, East Kent, Broadstairs, Ramsgate, Margate, Westgate-on-Sea, Birchington, Sandwich, and Deal.
- Add genuine project examples with town-level context, materials, and outcomes.
- Add trust details: insurance, licences, years of experience, VAT status if public-facing and accurate.

### 5. Content and Keyword Coverage

- Map target pages:
  - `/services/patios-pathways`
  - `/services/driveways`
  - `/services/fencing`
  - `/services/groundworks`
  - `/services/garden-design`
  - `/services/garden-maintenance`
  - `/areas/broadstairs`
  - `/areas/ramsgate`
  - `/areas/margate`
- For each service page, include: service overview, materials/options, process, project suitability, rough quote CTA, FAQs, related services, and service-area links.
- For each area page, include: service coverage, local project examples, testimonials from that area where genuine, and links to relevant services.
- Add a gallery/projects section or remove the broken `#gallery` nav item until it exists.
- Add FAQs addressing pricing, timelines, site surveys, waste removal, materials, drainage, planning permission, and maintenance.

### 6. Technical Performance

- Run a baseline Lighthouse audit before the Astro/static-generation migration using the current Vite site.
- Save the baseline scores and key metrics for Performance, Accessibility, Best Practices, SEO, LCP, CLS, INP/TBT, transfer size, and JavaScript payload.
- Add a GitHub Actions Lighthouse CI gate that fails pull requests when agreed thresholds are missed.
- Initial Lighthouse CI thresholds:
  - Performance: `>= 0.90`
  - Accessibility: `>= 0.95`
  - Best Practices: `>= 0.95`
  - SEO: `>= 0.95`
  - Largest Contentful Paint: `<= 2500ms`
  - Cumulative Layout Shift: `<= 0.1`
  - Total Blocking Time: `<= 200ms`
- Build and preview the generated static site, then run Lighthouse/PageSpeed checks on mobile and desktop.
- Run a post-migration Lighthouse audit against the generated Astro static output using the same viewport/network settings as the baseline.
- Compare before/after results and investigate any regression before shipping.
- Confirm JavaScript shipped to public content pages is zero or near-zero. Any shipped script should have a named purpose.
- Optimize LCP hero image: local asset, modern format, explicit dimensions, responsive sizes, and preload or high fetch priority.
- Lazy-load below-the-fold images only; avoid lazy-loading the hero image.
- Compress and cache images.
- Check unused JavaScript and CSS bundle size.
- Verify fonts are loaded efficiently and do not cause layout shift.
- Confirm Core Web Vitals: LCP, CLS, INP.

### 7. Accessibility and Semantic HTML

- Confirm one clear `h1` per page.
- Confirm heading hierarchy is logical.
- Replace clickable service-card `div`s with real links once destinations exist.
- Improve vague image alt text and mark decorative images appropriately.
- Ensure mobile menu and anchor navigation are keyboard accessible.
- Check contrast, focus states, and skip-link needs.
- Add Playwright end-to-end accessibility tests using axe-core.
- Fail CI on detectable WCAG A/AA violations for key public pages.
- Expand the Playwright a11y route list as static service and area pages are added.

### 8. Trust, Conversion, and E-E-A-T Signals

- Replace placeholder social/legal links with real destinations or remove them.
- Add clear company details: registered company name, service area, phone, email, and quote process.
- Add privacy policy and terms pages if collecting enquiries or using analytics.
- Add real project photos and case studies.
- Add verified reviews or links to review platforms.
- Make quote CTAs consistent and trackable.

### 9. Analytics and Monitoring

- Install Google Search Console and submit sitemap.
- Use Cloudflare Web Analytics as the chosen analytics tool.
- Do not use cookie-based analytics, retargeting pixels, or consent-banner-dependent tracking for the public marketing site.
- Do not add a cookie banner unless a future feature introduces cookies or tracking that legally requires one.
- Track quote clicks, phone clicks, email clicks, and form submissions.
- Monitor branded and local queries monthly.
- Review Search Console indexing, performance, Core Web Vitals, and enhancement reports.

## Suggested Implementation Order

1. Fix the basics in `apps/web/index.html`: title, meta description, canonical, social metadata, and favicon metadata.
2. Run and save a baseline Lighthouse audit against the current site.
3. Add GitHub Actions checks for Lighthouse CI thresholds and Playwright axe accessibility tests.
4. Migrate `apps/web` to Astro with React islands and Tailwind CSS 4.
5. Configure Lightning CSS in the Astro/Vite build path if it is not already active through the chosen toolchain.
6. Convert the current one-page SPA into generated static HTML and verify the home page works without JavaScript.
7. Clean the CSS source: remove unused Figma theme tokens, unused animation imports, empty files, and dead styles.
8. Resolve NAP inconsistencies between `apps/web/src/app/data/content.ts` and `packages/content/src/company.ts`.
9. Add generated `robots.txt` and `sitemap.xml` to the static output.
10. Add LocalBusiness JSON-LD based on the final confirmed business details.
11. Remove or implement the missing gallery section.
12. Add service detail pages with unique metadata and internal links.
13. Add local area pages for the strongest target towns.
14. Replace Unsplash hero/service images with optimized local images of real work.
15. Add only purposeful progressive-enhancement JavaScript, then measure the final JS payload.
16. Run a post-change Lighthouse audit, compare it to the baseline, and fix regressions.
17. Add Cloudflare Web Analytics, Search Console, and a recurring monthly SEO health review without introducing cookie-banner-dependent tracking.

## Reference Guidance

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google rendering troubleshooting: https://developers.google.com/search/docs/guides/rendering
- Google technical requirements: https://developers.google.com/search/docs/essentials/technical
