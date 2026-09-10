import { test, expect } from '@playwright/test';
const base = '/pages/list/list-standard';
const header = (page: import('@playwright/test').Page) => page.locator('app-demo-host app-record-header').filter({ visible: true }).first();
test('CASE-RECORD-URL: detail header, edit, save and reload use the selected record', async ({ page }, info) => {
  await page.goto(base);
  const link = page.getByRole('link', { name: 'CUS-0002', exact: true });
  await expect(link).toHaveAttribute('href', base + '/customer-2/detail');
  await link.click();
  await expect(page).toHaveURL(new RegExp('customer-2/detail$'));
  await expect(header(page)).toContainText('Chi tiết công ty');
  await expect(header(page).locator('.record-code')).toHaveText('#CUS-0002');
  await expect(header(page).locator('.record-description')).toHaveText('An Phú Logistics');
  await expect(header(page).locator('sd-badge .c-badge')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tạo mới', exact: true })).not.toBeVisible();
  await page.screenshot({ path: info.outputPath('detail.png') });
  await page.getByRole('button', { name: 'Cập nhật', exact: true }).click();
  await expect(page).toHaveURL(new RegExp('customer-2/update$'));
  await page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).fill('An Phú Logistics cập nhật');
  await page.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Đang lưu hồ sơ' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp('customer-2/detail$'));
  await expect(header(page).locator('.record-description')).toHaveText('An Phú Logistics cập nhật');
  await page.reload();
  await expect(header(page).locator('.record-description')).toHaveText('An Phú Logistics cập nhật');
});
test('CASE-CREATE-URL: header actions validate and save to a new record detail URL', async ({ page }, info) => {
  await page.goto(base + '/create');
  await expect(page.getByText('Các trường có dấu', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Hủy', exact: true })).toHaveCount(0);
  const save = page.getByRole('button', { name: 'Lưu', exact: true });
  await save.click();
  await expect(page.getByTestId('form-error')).toContainText('Mã hồ sơ');
  await expect(page).toHaveURL(new RegExp('/create$'));
  await page.getByRole('textbox', { name: 'Mã hồ sơ', exact: true }).fill('CUS-NEW');
  await page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).fill('Công ty mẫu mới');
  await page.screenshot({ path: info.outputPath('create.png') });
  await save.click();
  await expect(page).toHaveURL(new RegExp('/customer-31/detail$'));
  await expect(header(page)).toContainText('#CUS-NEW');
  await page.reload();
  await expect(header(page)).toContainText('Công ty mẫu mới');
});
test('CASE-HISTORY-GUARD: browser Back and header Back protect dirty edits', async ({ page }) => {
  await page.goto(base);
  await page.getByRole('link', { name: 'CUS-0001', exact: true }).click();
  await page.getByRole('button', { name: 'Cập nhật', exact: true }).click();
  const name = page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true });
  await name.fill('Bản nháp chưa lưu');
  await page.evaluate(() => history.back());
  await page.getByRole('button', { name: 'Tiếp tục chỉnh sửa', exact: true }).click();
  await expect(page).toHaveURL(new RegExp('/customer-1/update$'));
  await expect(name).toHaveValue('Bản nháp chưa lưu');
  await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
  await page.getByRole('radio', { name: 'Bỏ thay đổi', exact: true }).check();
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(page).toHaveURL(new RegExp('/customer-1/detail$'));
  await expect(header(page).locator('.record-description')).toHaveText('Công ty Minh An');
});
for (const [id, record] of [
  ['detail-tabbed', 'contract-2'],
  ['detail-related-records', 'order-3'],
  ['form-simple', 'category-2'],
  ['form-sections', 'partner-2'],
  ['form-line-items', 'order-2'],
]) {
  test('CASE-DIRECT-UPDATE: ' + id + ' reopens the correct form', async ({ page }) => {
    await page.goto('/pages/detail/' + id + '/' + record + '/update');
    const name = page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true });
    await expect(name).not.toHaveValue('');
    const original = await name.inputValue();
    await page.reload();
    await expect(name).toHaveValue(original);
    await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
    await expect(page).toHaveURL(new RegExp('/' + record + '/detail$'));
    await expect(header(page).locator('.record-description')).toHaveText(original);
  });
}
for (const id of ['drawer-compact', 'drawer-sections']) {
  test('CASE-DRAWER-URL: ' + id + ' create/save/detail/update/reload', async ({ page }) => {
    const url = '/pages/detail/' + id;
    await page.goto(url + '/create');
    let dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox', { name: 'Mã hồ sơ', exact: true }).fill('NEW-31');
    await dialog.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).fill('Hồ sơ từ drawer');
    await dialog.getByRole('button', { name: 'Lưu', exact: true }).click();
    await expect(page).toHaveURL(new RegExp('/(category|contact)-31/detail$'));
    await expect(dialog.locator('app-record-header')).toContainText('Hồ sơ từ drawer');
    await dialog.getByRole('button', { name: 'Cập nhật', exact: true }).click();
    await expect(page).toHaveURL(new RegExp('/(category|contact)-31/update$'));
    await page.reload();
    dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('textbox', { name: 'Tên hồ sơ', exact: true })).toHaveValue('Hồ sơ từ drawer');
    await dialog.getByRole('button', { name: 'Quay lại', exact: true }).click();
    await expect(page).toHaveURL(new RegExp('/detail$'));
    await expect(dialog.getByRole('button', { name: 'Cập nhật', exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: 'Quay lại', exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(dialog).not.toBeVisible();
  });
}
test('CASE-MISSING-RECORD: invalid ID never falls back to another customer', async ({ page }) => {
  await page.goto(base + '/missing/detail');
  await expect(page.getByText('Không tìm thấy hồ sơ', { exact: true })).toBeVisible();
  await expect(page.getByText('Công ty Minh An', { exact: true })).not.toBeVisible();
  await page.goto(base + '/missing/update');
  await expect(page.getByText('Hồ sơ không còn tồn tại', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lưu', exact: true })).toHaveCount(0);
});

for (const width of [320, 390]) {
  test('CASE-RECORD-REFLOW: header actions remain reachable at ' + width + 'px', async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base + '/create');
    const save = page.getByRole('button', { name: 'Lưu', exact: true });
    await expect(save).toBeVisible();
    const box = await save.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    expect(box!.y + box!.height).toBeLessThan(260);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await page.screenshot({ path: info.outputPath('create-mobile.png') });
    await page.getByRole('textbox', { name: 'Ghi chú phối hợp', exact: true }).scrollIntoViewIfNeeded();
    await expect(save).toBeInViewport();
    await page.goto(base + '/customer-2/detail');
    await expect(header(page)).toContainText('#CUS-0002');
    await expect(page.getByRole('button', { name: 'Quay lại', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await page.screenshot({ path: info.outputPath('detail-mobile.png') });
  });
}
