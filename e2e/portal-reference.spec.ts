import { test, expect } from '@playwright/test';
import { selectCore } from './helpers/demo-fixtures';
test('CASE-PORTAL: direct entry with List/Detail and no old Patterns module', async ({ page }) => {
  await page.goto('/page');
  await expect(page).toHaveURL(/pages\/list\/list-standard/);
  await expect(page.locator('app-demo-host')).toBeVisible();
  await expect(page.getByText('List', { exact: true })).toBeVisible();
  await expect(page.getByText('Detail', { exact: true })).toBeVisible();
  await expect(page.getByText('Patterns', { exact: true })).toHaveCount(0);
});
for (const version of [1, 2, 3])
  test('CASE-SIDEBAR: version ' + version + ' persists and renders', async ({ page }) => {
    await page.goto('/instruction/portal-config');
    await selectCore(
      page,
      'Sidebar',
      version === 1 ? 'Version 1 — Nhóm biểu tượng' : version === 2 ? 'Version 2 — Điều hướng hai tầng' : 'Version 3 — Menu thu gọn'
    );
    if (await page.getByRole('button', { name: 'Lưu & Tải lại', exact: true }).isEnabled())
      await page.getByRole('button', { name: 'Lưu & Tải lại', exact: true }).click();
    await expect(page.locator('sd-sidebar-v' + version)).toBeVisible();
    await page.reload();
    await expect(page.locator('sd-sidebar-v' + version)).toBeVisible();
  });
test('CASE-SPACING: input playground has padding and full width fields', async ({ page }) => {
  await page.goto('/form/input');
  const panel = page.locator('.demo-config-panel');
  await expect(panel).toBeVisible();
  const measure = await panel.evaluate(el => {
    const section = el.closest('sd-section')!.getBoundingClientRect();
    const content = el.getBoundingClientRect();
    const item = el.querySelector('.config-item')!.getBoundingClientRect();
    const control = el.querySelector('sd-input')!.getBoundingClientRect();
    return { left: content.left - section.left, right: section.right - content.right, controlWidth: control.width, itemWidth: item.width };
  });
  expect(measure.left).toBeGreaterThanOrEqual(16);
  expect(measure.right).toBeGreaterThanOrEqual(16);
  expect(measure.controlWidth).toBeGreaterThanOrEqual(measure.itemWidth - 4);
});

test('CASE-TAB-METADATA: tab router shows a meaningful title and icon', async ({ page }) => {
  await page.goto('/instruction/portal-config');
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Lưu & Tải lại', exact: true }).click();
  await page.goto('/form/input');
  await expect(page.locator('sd-tab-router-item')).toContainText('SdInput Component');
  await expect(page.locator('sd-tab-router-item sd-icon').filter({ hasText: 'edit_note' })).toBeVisible();
});
