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
