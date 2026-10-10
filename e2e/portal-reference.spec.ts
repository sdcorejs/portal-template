import { test, expect } from '@playwright/test';
test('CASE-PORTAL: direct entity entry with list/detail links and no old Patterns module', async ({ page }) => {
  await page.goto('/page');
  await expect(page).toHaveURL('/page/company');
  await expect(page.locator('app-demo-host')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Khách hàng doanh nghiệp', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Khách hàng doanh nghiệp', exact: true })).toHaveAttribute('href', '/page/company');
  await expect(page.getByRole('link', { name: 'Hồ sơ khách hàng', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Hồ sơ khách hàng', exact: true })).toHaveAttribute('href', '/page/customer');
  await expect(page.getByText('Patterns', { exact: true })).toHaveCount(0);
});
for (const version of [1, 2, 3])
  test('CASE-SIDEBAR: version ' + version + ' persists and renders', async ({ page }) => {
    await page.goto('/instruction/portal-config');
    const sidebar = page.locator('app-demo-property').filter({ has: page.getByText('Phiên bản sidebar', { exact: true }) });
    await expect(sidebar).toHaveCount(1);
    const option =
      version === 1 ? 'Version 1 — Nhóm biểu tượng' : version === 2 ? 'Version 2 — Điều hướng hai tầng' : 'Version 3 — Menu thu gọn';
    await sidebar.getByRole('combobox').locator('xpath=ancestor::mat-form-field').click();
    await page.getByRole('option', { name: option, exact: true }).click();
    await expect(sidebar.getByRole('combobox')).toContainText(option);
    const save = page.getByRole('button', { name: 'Lưu & Tải lại', exact: true });
    if (version === 1) await expect(save).toBeDisabled();
    else {
      await expect(save).toBeEnabled();
      await save.click();
    }
    await expect(page.locator('sd-sidebar-v' + version)).toBeVisible();
    await page.reload();
    await expect(page.locator('sd-sidebar-v' + version)).toBeVisible();
    await expect(sidebar.getByRole('combobox')).toContainText(option);
  });
test('CASE-SPACING: input playground has padding and full width fields', async ({ page }) => {
  await page.goto('/form/input');
  const panel = page.locator('.demo-config-panel');
  await expect(panel).toBeVisible();
  const measure = await panel.evaluate(el => {
    const section = el.closest('sd-section')!.getBoundingClientRect();
    const property = el.querySelector('app-demo-property')!;
    const content = property.querySelector('.property-row')!.getBoundingClientRect();
    const item = property.querySelector('.property-control')!.getBoundingClientRect();
    const control = property.querySelector('sd-input')!.getBoundingClientRect();
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
