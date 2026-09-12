import { expect, test } from '@playwright/test';
import { INSTRUCTIONS, INSTRUCTION_GROUPS } from '../src/modules/instructions/catalog/instruction-registry';

test('article links navigate between distinct lessons and support Back', async ({ page }) => {
  await page.goto('/instructions/getting-started/overview');
  await page.locator('.related').getByRole('link', { name: 'Module & Feature →' }).click();
  await expect(page).toHaveURL(/\/instructions\/architecture$/);
  await page.locator('.pagination').getByRole('link', { name: 'Routing & Public API →' }).click();
  await expect(page).toHaveURL(/\/instructions\/architecture\/routing$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Routing & Public API');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Module & Feature');
});
test('setup and integration checklists expose completion', async ({ page }) => {
  await page.goto('/instructions/getting-started/setup');
  for (const checkbox of await demo(page).getByRole('checkbox').all()) await checkbox.check();
  await expect(demo(page).getByRole('link', { name: 'Review Portal' })).toBeVisible();
  await page.goto('/instructions/architecture/integration');
  await demo(page).getByRole('button', { name: 'Git submodule', exact: true }).click();
  for (const checkbox of await demo(page).getByRole('checkbox').all()) await checkbox.check();
  await expect(demo(page).getByRole('status')).toContainText('Đủ 5 điểm');
  await page.getByRole('button', { name: 'Reset ví dụ', exact: true }).click();
  await expect(demo(page).getByRole('status')).toContainText('Còn thiếu');
});
test('async TypeScript example clears pending on failure and retry', async ({ page }) => {
  await page.goto('/instructions/coding-convention/typescript');
  await demo(page).getByLabel('Giả lập lưu lỗi').check();
  await demo(page).getByRole('button', { name: 'Lưu khách hàng' }).click();
  await expect(demo(page).getByRole('button', { name: 'Đang lưu…' })).toBeDisabled();
  await expect(demo(page).getByRole('status')).toContainText('Không thể lưu');
  await demo(page).getByLabel('Giả lập lưu lỗi').uncheck();
  await demo(page).getByRole('button', { name: 'Lưu khách hàng' }).click();
  await expect(demo(page).getByRole('status')).toContainText('Đã lưu khách hàng');
});
test('quality demo is keyboard operable and has semantic table headers', async ({ page }) => {
  await page.goto('/instructions/coding-convention/quality');
  await expect(demo(page).getByRole('table', { name: 'Khách hàng được chọn' })).toBeAttached();
  await demo(page).getByRole('button', { name: 'Xác nhận chọn' }).focus();
  await page.keyboard.press('Enter');
  await expect(demo(page).getByRole('status')).toContainText('Đã xác nhận');
  await expect(demo(page).getByRole('columnheader')).toHaveCount(2);
});
test('git workflow blocks dirty checkout and theme warns about low contrast', async ({ page }) => {
  await page.goto('/instructions/tooling/git-submodules');
  await expect(demo(page).getByRole('button', { name: 'Mô phỏng đồng bộ theo branch' })).toBeDisabled();
  await demo(page).getByLabel('Working tree có thay đổi chưa lưu').uncheck();
  await demo(page).getByRole('button', { name: 'Mô phỏng đồng bộ theo branch' }).click();
  await expect(demo(page).getByRole('status')).toContainText('push commit repo con');
  await page.goto('/instructions/custom-theme/guide');
  await demo(page).getByLabel('Primary', { exact: true }).fill('#ffffff');
  await expect(demo(page).getByRole('status')).toContainText('Chưa đạt');
  await page.getByRole('button', { name: 'Reset ví dụ', exact: true }).click();
  await expect(demo(page).getByLabel('Primary', { exact: true })).toHaveValue('#2a66f4');
  await demo(page).getByRole('link', { name: 'Mở công cụ tạo palette →' }).click();
  await expect(page).toHaveURL(/custom-theme\/tool$/);
});
test('copy code and open verified UI screenshot', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/instructions/modern-angular/signals');
  await page.getByText('Ảnh giao diện thật · Core 22.2.8', { exact: true }).click();
  await expect(page.locator('.ui-evidence img')).toBeVisible();
  expect(await page.locator('.ui-evidence img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Code minh họa', exact: true }).click();
  await page.getByRole('button', { name: 'Sao chép code', exact: true }).click();
  await expect(page.getByText('Đã sao chép', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('readonly price = signal(120000)');
});
test('tab router keeps lesson title, icon and independent lesson state', async ({ page }) => {
  await page.goto('/instructions/portal-config');
  await demo(page).getByRole('switch').click();
  await demo(page).getByRole('button', { name: 'Lưu & Tải lại', exact: true }).click();
  await page.goto('/instructions/modern-angular/signals');
  await expect(page.locator('sd-tab-router-item')).toContainText('Signals & Component APIs');
  await expect(page.locator('sd-tab-router-item sd-icon').filter({ hasText: 'bolt' })).toBeVisible();
  await page.locator('.related').getByRole('link', { name: 'Dependency Injection →' }).click();
  await expect(page).toHaveURL(/dependency-injection$/);
  await expect(demo(page).getByRole('button', { name: 'Tăng Shared A' })).toBeVisible();
});

const demo = (page: import('@playwright/test').Page) => page.getByTestId('instruction-demo');
test('all lesson layouts fit a 390px viewport', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const article of INSTRUCTIONS) {
    await page.goto('/instructions/' + article.path);
    await expect(demo(page)).toBeAttached();
    await demo(page).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), article.id).toBe(true);
    expect(await demo(page).evaluate(element => element.getBoundingClientRect().right <= innerWidth), article.id).toBe(true);
  }
});
for (const article of INSTRUCTIONS) {
  test('article: ' + article.title, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/instructions/' + article.path);
    await expect(page.locator('sd-page')).toContainText(article.title);
    const image = page.locator('.hero img');
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(demo(page)).toBeAttached();
    await page.getByRole('button', { name: 'Code minh họa', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Sao chép code', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Reset ví dụ', exact: true }).click();
    await expect(demo(page)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
test('menu has six learning groups and metadata stays unique', async ({ page }) => {
  expect(INSTRUCTION_GROUPS).toHaveLength(6);
  expect(new Set(INSTRUCTIONS.map(article => article.path)).size).toBe(17);
  await page.goto('/instructions');
  await expect(page).toHaveURL(/getting-started\/overview$/);
  for (const group of INSTRUCTION_GROUPS) await expect(page.locator('sd-layout')).toContainText(group);
});
test('signal input, model, output, query and reset work together', async ({ page }) => {
  await page.goto('/instructions/modern-angular/signals');
  await demo(page).getByLabel('Số lượng', { exact: true }).fill('3');
  await expect(demo(page).getByTestId('order-total')).toContainText('360');
  await demo(page).getByLabel('Đơn giá', { exact: true }).selectOption('250000');
  await expect(demo(page).getByTestId('order-total')).toContainText('750');
  await demo(page).getByRole('button', { name: 'Thêm hàng', exact: true }).click();
  await expect(demo(page).getByRole('status')).toContainText('750');
  await demo(page).getByRole('button', { name: 'Focus số lượng' }).click();
  await expect(demo(page).getByLabel('Số lượng', { exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Reset ví dụ', exact: true }).click();
  await expect(demo(page).getByLabel('Số lượng', { exact: true })).toHaveValue('1');
  await expect(demo(page).getByRole('status')).toContainText('Chưa nhận');
});
test('DI shares parent state and isolates local provider', async ({ page }) => {
  await page.goto('/instructions/modern-angular/dependency-injection');
  await demo(page).getByRole('button', { name: 'Tăng Shared A' }).click();
  const cards = demo(page).locator('app-di-consumer');
  await expect(cards.nth(0).locator('.value')).toHaveText('1');
  await expect(cards.nth(1).locator('.value')).toHaveText('1');
  await expect(cards.nth(2).locator('.value')).toHaveText('0');
  const ids = await cards.locator('code').allTextContents();
  expect(ids[0]).toBe(ids[1]);
  expect(ids[2]).not.toBe(ids[0]);
  await demo(page).getByRole('button', { name: 'Dựng lại scope' }).click();
  await expect(cards.nth(0).locator('.value')).toHaveText('0');
  expect(await cards.nth(0).locator('code').textContent()).not.toBe(ids[0]);
});
test('group overlap survives revoke and reset restores defaults', async ({ page }) => {
  await page.goto('/instructions/authorization/model');
  await demo(page).getByLabel('Tạo khách hàng', { exact: true }).check();
  await demo(page).getByLabel('Tạo đơn hàng kèm khách hàng').check();
  await demo(page).getByLabel('Tạo khách hàng', { exact: true }).uncheck();
  await demo(page).getByText('Mapping kỹ thuật · dành cho developer').click();
  await expect(page.getByTestId('effective-permissions')).toContainText('CRM_CUSTOMER_A_CREATE');
  await demo(page).getByLabel('Tạo đơn hàng kèm khách hàng').uncheck();
  await expect(page.getByTestId('effective-permissions')).not.toContainText('CRM_CUSTOMER_A_CREATE');
});
test('direct route and backend simulation deny missing and stale grants', async ({ page }) => {
  await page.goto('/instructions/authorization/checks');
  await demo(page).getByRole('button', { name: 'Thử URL /customer/create' }).click();
  await expect(demo(page).getByRole('status')).toContainText('bị từ chối');
  await demo(page).getByLabel('Tạo khách hàng', { exact: true }).check();
  await demo(page).getByRole('button', { name: 'Thử URL /customer/create' }).click();
  await expect(demo(page).getByRole('status')).toContainText('được phép');
  await demo(page).getByLabel('UI đã cũ', { exact: false }).check();
  await demo(page).getByRole('button', { name: 'Gọi API tạo giả lập' }).click();
  await expect(demo(page).getByRole('status')).toContainText('403');
});
test('assignment changes list and direct record access consistently', async ({ page }) => {
  await page.goto('/instructions/authorization/data-scope');
  await expect(demo(page).getByRole('table')).not.toContainText('CUS-002');
  await demo(page).getByRole('button', { name: 'Mở CUS-002' }).click();
  await expect(demo(page).getByRole('status')).toContainText('Từ chối');
  await demo(page).getByLabel('Giao CUS-002 cho Lan').check();
  await expect(demo(page).getByRole('table')).toContainText('CUS-002');
  await demo(page).getByLabel('Có quyền xem khách hàng').uncheck();
  await expect(demo(page).getByRole('table')).toContainText('Không có bản ghi');
});
test('mock API exposes loading, error and retry', async ({ page }) => {
  await page.goto('/instructions/architecture/configuration');
  await demo(page).getByLabel('Giả lập lỗi 503').check();
  await demo(page).getByRole('button', { name: 'Gửi request' }).click();
  await expect(demo(page).getByRole('button', { name: 'Đang tải…' })).toBeDisabled();
  await expect(demo(page).getByRole('status')).toContainText('503');
  await demo(page).getByLabel('Giả lập lỗi 503').uncheck();
  await demo(page).getByLabel('Môi trường').selectOption('staging');
  await demo(page).getByRole('button', { name: 'Gửi request' }).click();
  await expect(demo(page).getByRole('status')).toContainText('200');
  await expect(demo(page).getByRole('status')).toContainText('/mock/staging/crm');
});
test('spacing, validation and view density', async ({ page }) => {
  await page.goto('/instructions/coding-convention/scss');
  const body = page.getByTestId('spacing-body');
  expect(await body.evaluate(element => ({ padding: getComputedStyle(element).padding, gap: getComputedStyle(element).gap }))).toEqual({
    padding: '20px',
    gap: '8px',
  });
  await demo(page).getByLabel('Tên công ty', { exact: false }).fill('');
  await demo(page).getByRole('button', { name: 'Kiểm tra dữ liệu' }).click();
  await expect(demo(page)).toContainText('Vui lòng nhập thông tin');
  await demo(page).getByRole('button', { name: 'Xem chi tiết', exact: true }).click();
  expect(await body.evaluate(element => getComputedStyle(element).gap)).toBe('16px');
});
test('zoom keyboard focus return and mobile containment', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/instructions/modern-angular/signals');
  const trigger = page.getByRole('button', { name: 'Phóng to sơ đồ Signals & Component APIs' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByText('Trong trang này', { exact: true }).click();
  await page.locator('.mobile-toc').getByRole('button', { name: 'Thử ngay', exact: true }).click();
  await expect(demo(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('portal configuration keeps sidebar selection after reload', async ({ page }) => {
  await page.goto('/instructions/portal-config');
  const select = demo(page).locator('sd-select').first();
  await select.click();
  await page.getByRole('option', { name: /Version 2/ }).click();
  await demo(page).getByRole('button', { name: 'Lưu & Tải lại' }).click();
  await expect(demo(page).locator('sd-select').first()).toContainText('Version 2');
  await page.reload();
  await expect(demo(page).locator('sd-select').first()).toContainText('Version 2');
});
