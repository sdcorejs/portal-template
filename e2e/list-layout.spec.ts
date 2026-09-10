import { test, expect } from '@playwright/test';
import { openPattern, selectCore } from './helpers/demo-fixtures';
for (const id of [
  'list-standard',
  'list-advanced-filter',
  'list-grouped-tree',
  'list-master-detail',
  'drawer-compact',
  'drawer-sections',
]) {
  for (const [width, height] of [
    [1280, 720],
    [390, 844],
  ])
    test('CASE-LIST-HEIGHT: ' + id + ' ' + width + 'x' + height, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await openPattern(page, id);
      const table = page.locator('app-demo-host sd-table').first();
      await expect(table).toBeVisible();
      const pager = table.getByRole('button', { name: 'Trang sau', exact: true });
      if (id !== 'list-grouped-tree') await expect(pager).toBeVisible();
      const bounds = await (id === 'list-grouped-tree' ? table : pager).boundingBox();
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height + 2);
      const layout = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        viewportHeight: innerHeight,
      }));
      expect(layout.width).toBeLessThanOrEqual(width + 2);
      expect(layout.height).toBeLessThanOrEqual(height + 2);
      await page.screenshot({ path: testInfo.outputPath('list.png') });
    });
}
test('CASE-QUICK-SEARCH: keyword plus dropdown combine and preserve on return', async ({ page }) => {
  await openPattern(page, 'list-standard');
  const search = page.getByPlaceholder('Tìm theo mã hoặc tên', { exact: true });
  await search.fill('CUS-0001');
  await search.press('Enter');
  await expect(page.locator('app-demo-host sd-table a.record-link')).toHaveCount(1);
  await selectCore(page, 'Trạng thái', 'Chờ xử lý');
  await expect(page.locator('app-demo-host sd-table a.record-link')).toHaveCount(0);
  await selectCore(page, 'Trạng thái', 'Đang hoạt động');
  await expect(page.locator('app-demo-host sd-table a.record-link')).toHaveCount(1);
});
test('CASE-EXTERNAL: filters combine with quick search and scorecards reflect saves', async ({ page }) => {
  await openPattern(page, 'list-advanced-filter');
  const cards = page.locator('.list-scorecards');
  await expect(cards.locator('dd')).toHaveText(['30', '10', '10']);
  const search = page.getByPlaceholder('Tìm theo mã hoặc tên', { exact: true });
  await search.fill('ORD-0002');
  await search.press('Enter');
  await selectCore(page, 'Trạng thái', 'Chờ xử lý');
  await selectCore(page, 'Khu vực', 'Miền Trung');
  const table = page.locator('app-demo-host sd-table');
  const row = table.getByRole('row').filter({ hasText: 'ORD-0002' }).first();
  await expect(row).toBeVisible();
  await expect(page.locator('app-demo-host sd-table a.record-link')).toHaveCount(1);
  await row.getByRole('checkbox').check();
  await table.getByRole('button', { name: 'Duyệt đơn hàng', exact: true }).click();
  await expect(cards.locator('dd')).toHaveText(['30', '9', '11']);
  await expect(page.locator('app-demo-host sd-table a.record-link')).toHaveCount(0);
});
test('CASE-EXTERNAL-ONLY: product listing filters without quick search', async ({ page }) => {
  await openPattern(page, 'list-grouped-tree');
  await expect(page.getByPlaceholder('Tìm theo mã hoặc tên', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('combobox', { name: 'Trạng thái', exact: true })).toBeVisible();
  await selectCore(page, 'Trạng thái', 'Chờ xử lý');
  const table = page.locator('app-demo-host sd-table');
  // Keep ancestors for context while removing unrelated children.
  await expect(table.getByRole('row').filter({ hasText: 'PRO-0003' })).toHaveCount(0);
  await expect(table.getByRole('row').filter({ hasText: 'PRO-0002' }).first()).toBeVisible();
});
