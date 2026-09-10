import { test, expect } from '@playwright/test';
import { openPattern } from './helpers/demo-fixtures';
for (const width of [1440, 1024, 768, 390, 320])
  test('[case-ac-004 case-ac-009 case-ac-011] CASE-REFLOW: ' + width + 'px keeps page overflow contained', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await openPattern(page, 'form-sections');
    await page.getByRole('button', { name: 'Cập nhật', exact: true }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    expect(overflow).toBe(false);
    const input = page.locator('app-entity-form-sections sd-input[name="name"] input');
    await expect(input).toBeVisible();
    const bounds = await input.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 2);
    await page.screenshot({ path: testInfo.outputPath('form-sections.png'), fullPage: true });
  });
