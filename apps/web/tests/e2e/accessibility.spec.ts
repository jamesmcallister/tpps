import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("accessibility", () => {
  const routes = [
    "/",
    "/services/patios-pathways/",
    "/services/driveways/",
    "/services/fencing/",
    "/services/groundworks/",
    "/services/garden-design/",
    "/services/garden-maintenance/",
    "/services/tree-removal/",
  ];

  for (const route of routes) {
    test(`${route} has no detectable axe violations`, async ({ page }) => {
      await page.goto(route);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
