import { PAGE_EXAMPLES } from '../src/modules/page/catalog/page-examples';
import { test, expect } from '@playwright/test';

test('list entry saves a new record and restores it after reload', async ({ page }) => {
  const base = '/page/category';
  await page.goto(base);
  await page.getByRole('button', { name: 'Tạo mới', exact: true }).click();
  await page.getByRole('textbox', { name: 'Mã hồ sơ', exact: true }).fill('CAT-LIST-NEW');
  await page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).fill('Danh mục tạo từ danh sách');
  await page.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(page).toHaveURL(new RegExp('/category-31/detail$'));
  await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
  await expect(page).toHaveURL(base);
  await page.reload();
  await page.locator('app-record-list').getByRole('textbox', { name: 'Tìm kiếm', exact: true }).fill('CAT-LIST-NEW');
  await page.locator('app-record-list').getByRole('textbox', { name: 'Tìm kiếm', exact: true }).press('Enter');
  await page.getByRole('link', { name: 'CAT-LIST-NEW', exact: true }).click();
  await expect(page.locator('app-record-header')).toContainText('Danh mục tạo từ danh sách');
});

for (const id of [
  'detail-overview',
  'detail-tabbed',
  'detail-related-records',
  'form-simple',
  'form-sections',
  'form-line-items',
  'drawer-compact',
  'drawer-sections',
]) {
  test(id + ': list is the entry point for create, detail and update', async ({ page }) => {
    const base = '/page/' + PAGE_EXAMPLES.find(example => example.id === id)!.path;
    await page.goto(base);
    await expect(page.locator('app-demo-host sd-table').first()).toBeVisible();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page).toHaveURL(base);
    const link = page.locator('app-demo-host sd-table a').first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    await link.click();
    await expect(page).toHaveURL(href!);
    const surface = id.startsWith('drawer-') ? page.getByRole('dialog') : page.locator('app-demo-host');
    await surface.getByRole('button', { name: 'Cập nhật', exact: true }).click();
    await expect(page).toHaveURL(href!.replace(/\/detail$/, '/update'));
    await expect(surface.getByRole('textbox', { name: 'Tên hồ sơ', exact: true })).not.toHaveValue('');
    await surface.getByRole('button', { name: 'Quay lại', exact: true }).click();
    await expect(page).toHaveURL(href!);
    await surface.getByRole('button', { name: 'Quay lại', exact: true }).click();
    await expect(page).toHaveURL(base);
    await page.getByRole('button', { name: 'Tạo mới', exact: true }).click();
    await expect(page).toHaveURL(base + '/create');
    await expect(surface.getByRole('textbox', { name: 'Tên hồ sơ', exact: true })).toHaveValue('');
    await expect(surface.getByRole('button', { name: 'Lưu', exact: true })).toBeVisible();
    await surface.getByRole('button', { name: 'Quay lại', exact: true }).click();
    await expect(page).toHaveURL(base);
  });
}
