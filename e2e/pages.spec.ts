import { test, expect } from '@playwright/test';
import { openPattern, selectCore } from './helpers/demo-fixtures';
const patterns = [
  'list-standard',
  'list-advanced-filter',
  'list-grouped-tree',
  'list-master-detail',
  'detail-overview',
  'detail-tabbed',
  'detail-related-records',
  'form-simple',
  'form-sections',
  'form-line-items',
  'drawer-compact',
  'drawer-sections',
];
for (const id of patterns)
  test('CASE-PAGE: ' + id + ' is a business screen', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await openPattern(page, id);
    await expect(page.locator('app-demo-host sd-page').first()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Preview', exact: true })).toHaveCount(0);
    await expect(page.getByRole('tab', { name: 'Source', exact: true })).toHaveCount(0);
    expect(errors).toEqual([]);
  });
test('CASE-SESSION: create, update, reload and revisit preserve data', async ({ page }) => {
  await page.goto('/page/detail/form-simple/create');
  await page.getByRole('textbox', { name: 'Mã hồ sơ', exact: true }).fill('CAT-NEW');
  await page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).fill('Danh mục phiên làm việc');
  const save = page.getByRole('button', { name: 'Lưu', exact: true });
  const start = Date.now();
  await save.click();
  await expect(page.getByRole('status').filter({ hasText: 'Đang lưu hồ sơ' })).toBeVisible();
  await expect(page.locator('app-demo-host')).toContainText('Danh mục phiên làm việc');
  await expect(save).toHaveCount(0);
  expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  await page.getByRole('button', { name: 'Cập nhật', exact: true }).click();
  await page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).fill('Danh mục đã cập nhật');
  await page.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cập nhật', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('app-demo-host')).toContainText('Danh mục đã cập nhật');
  const records = await page.evaluate(() => JSON.parse(sessionStorage.getItem('portal-pages:v1:category')!));
  expect(records).toHaveLength(31);
  expect(records.filter((r: { code: string }) => r.code === 'CAT-NEW')).toHaveLength(1);
  await openPattern(page, 'list-standard');
  await page.goto('/page/detail/form-simple/category-31/detail');
  await expect(page.locator('app-demo-host')).toContainText('Danh mục đã cập nhật');
});
test('CASE-VALIDATION: invalid form stays open with actionable error', async ({ page }) => {
  await page.goto('/page/detail/form-simple/create');
  await page.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(page.getByTestId('form-error')).toContainText('Mã hồ sơ');
  await expect(page.getByTestId('form-error')).toContainText('Tên hồ sơ');
});
test('CASE-LIST-RETURN: list filter survives detail, edit and back', async ({ page }) => {
  await openPattern(page, 'list-standard');
  const search = page.getByPlaceholder('Tìm theo mã hoặc tên', { exact: true });
  await search.fill('CUS-0001');
  await search.press('Enter');
  await expect(page.locator('app-demo-host sd-table a.record-link')).toHaveCount(1);
  await page.locator('app-demo-host sd-table a.record-link').click();
  await page.getByRole('button', { name: 'Cập nhật', exact: true }).click();
  await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
  await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
  await expect(search).toHaveValue('CUS-0001');
});
test('CASE-SELECTION: sorting keeps identity and bulk action persists', async ({ page }) => {
  await openPattern(page, 'list-advanced-filter');
  const table = page.locator('app-demo-host sd-table').first();
  const row = table.getByRole('row').filter({ hasText: 'ORD-0002' }).first();
  await row.getByRole('checkbox').check();
  await table.getByRole('columnheader', { name: 'Mã hồ sơ', exact: true }).click();
  await expect(row.getByRole('checkbox')).toBeChecked();
  await table.getByRole('button', { name: 'Duyệt đơn hàng', exact: true }).click();
  await expect(page.locator('app-demo-host')).toContainText('Đã duyệt 1 đơn hàng.');
  const saved = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('portal-pages:v1:order')!).find((r: { code: string }) => r.code === 'ORD-0002')
  );
  expect(saved.status).toBe('active');
  await table.getByRole('button', { name: 'Trang sau', exact: true }).click();
  await expect(table.getByRole('checkbox', { checked: true })).toHaveCount(0);
  await selectCore(page, 'Trạng thái', 'Đang hoạt động');
  await expect(table.getByRole('checkbox', { checked: true })).toHaveCount(0);
});
test('CASE-LINES: editing a line persists the calculated total', async ({ page }) => {
  await openPattern(page, 'form-line-items');
  await page.getByRole('button', { name: 'Cập nhật', exact: true }).click();
  const quantity = page.locator('app-line-item-editor').getByRole('textbox', { name: 'Số lượng', exact: true }).first();
  await quantity.fill('7');
  await quantity.press('Tab');
  await page.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cập nhật', exact: true })).toBeVisible();
  const records = await page.evaluate(() => JSON.parse(sessionStorage.getItem('portal-pages:v1:order')!));
  expect(records[0].lines[0].quantity).toBe(7);
  expect(records[0].amount).toBe(
    records[0].lines.reduce((n: number, line: { quantity: number; unitPrice: number }) => n + line.quantity * line.unitPrice, 0)
  );
});
test('CASE-DRAWER: discard confirmation and focus restoration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPattern(page, 'drawer-sections');
  const opener = page.getByRole('button', { name: 'Tạo mới', exact: true });
  await opener.click();
  const drawer = page.getByRole('dialog', { name: 'Tạo hồ sơ', exact: true });
  await drawer.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).fill('Liên hệ mới');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Tiếp tục chỉnh sửa', exact: true }).click();
  await expect(drawer.getByRole('textbox', { name: 'Tên hồ sơ', exact: true })).toHaveValue('Liên hệ mới');
  await page.keyboard.press('Escape');
  await page.getByRole('radio', { name: 'Bỏ thay đổi', exact: true }).check();
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(opener).toBeFocused();
});
