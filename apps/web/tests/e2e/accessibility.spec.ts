import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("accessibility", () => {
  test("home page has no detectable axe violations", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
