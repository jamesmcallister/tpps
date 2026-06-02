import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { seoInAstro } from "seo-in-astro";

const baseUrl = "https://www.tppslandscapes.com";

export default defineConfig({
  integrations: [
    react(),
    seoInAstro({
      baseUrl,
      siteName: "TPPS Landscapes",
      defaultOgImg: "/og-image.jpg",
      llmsTxt: true,
      sitemapXml: {
        sitemap: [
          {
            route: "/",
            changeFrequency: "weekly",
            priority: 1,
          },
        ],
      },
      robotsTxt: {
        rules: {
          userAgent: "*",
          allow: "/",
        },
        sitemap: `${baseUrl}/sitemap-index.xml`,
      },
    }),
  ],
  site: baseUrl,
  vite: {
    css: {
      transformer: "lightningcss",
    },
    build: {
      cssMinify: "lightningcss",
    },
    plugins: [tailwindcss()],
  },
});
