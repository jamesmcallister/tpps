module.exports = {
  ci: {
    collect: {
      startServerCommand: "node ./scripts/lhci-preview.mjs",
      startServerReadyPattern: "Local:",
      startServerReadyTimeout: 120000,
      url: ["http://127.0.0.1:4173/"],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "total-byte-weight": ["warn", { maxNumericValue: 900000 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
