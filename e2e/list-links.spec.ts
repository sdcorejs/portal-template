import { test, expect } from '@playwright/test';
import { openPattern } from './helpers/demo-fixtures';
for (const [id, code, badgeType] of [
  ['list-standard', 'CUS-0001', 'tag'],
  ['list-advanced-filter', 'ORD-0001', 'round'],
  ['list-grouped-tree', 'PRO-0001', 'icon'],
  ['list-master-detail', 'TIC-0001', 'icon'],
  ['drawer-compact', 'CAT-0001', 'round'],
  ['drawer-sections', 'CON-0001', 'tag'],
]) {
  test('CASE-RECORD-LINK: ' + id + ' opens by code with ' + badgeType + ' status badges', async ({ page }, testInfo) => {
    await openPattern(page, id);
    const table = page.locator('app-demo-host sd-table').first();
    await expect(table.getByRole('button', { name: /Xem hồ sơ|Xem chi tiết/ })).toHaveCount(0);
    const link = table.getByRole('link', { name: code, exact: true });
    await expect(link).toBeVisible();
    const row = table
      .getByRole('row')
      .filter({ has: page.getByRole('link', { name: code, exact: true }) })
      .first();
    const badge = row.locator('sd-badge');
    await expect(badge).toContainText('Đang hoạt động');
    if (badgeType === 'tag') await expect(badge.locator('.c-badge--tag')).toBeVisible();
    if (badgeType === 'round') {
      await expect(badge.locator('.c-badge')).toBeVisible();
      await expect(badge.locator('.c-badge--tag')).toHaveCount(0);
    }
    if (badgeType === 'icon') await expect(badge.locator('.c-badge-icon')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('listing.png') });
    if (id === 'list-standard') {
      await link.focus();
      await link.press('Enter');
    } else await link.click();
    await expect(page.getByRole('button', { name: 'Cập nhật', exact: true })).toBeVisible();
    if (id.startsWith('drawer-')) {
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(link).toBeFocused();
    } else {
      await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
      await expect(link).toBeVisible();
    }
  });
}
