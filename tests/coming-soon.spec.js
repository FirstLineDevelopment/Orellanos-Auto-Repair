import { expect, test } from "@playwright/test";
import firstline from "../firstline.config.js";

test.skip(!firstline.comingSoon, "Coming-soon mode is disabled.");

for (const path of ["/", "/index.html", "/?source=google#services"]) {
  test(`${path} redirects to the minimal coming-soon page`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/coming-soon\.html$/);
    await expect(page.getByRole("heading", { name: "Coming soon" })).toBeVisible();
    const logo = page.getByRole("img", { name: "Orellano's Auto Repair" });
    await expect(logo).toBeVisible();
    await expect.poll(() => logo.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator("nav, form, header, footer")).toHaveCount(0);
  });
}

test("redirect works without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page).toHaveURL(/\/coming-soon\.html$/);
  await expect(page.getByRole("heading", { name: "Coming soon" })).toBeVisible();
  await context.close();
});
