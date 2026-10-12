import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import { captureCompatibility } from './helpers/core-candidate-capture';

const errors = new Map<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') messages.push(message.text());
  });
});
test.afterEach(({ page }) => {
  expect(errors.get(page)).toEqual([]);
  errors.delete(page);
});

async function choose(page: Page, id: string, label: string) {
  const names = {
    'contract-sample': 'Mẫu hợp đồng',
    'contract-mode': 'Chế độ hiển thị',
    'query-preset': 'Tình huống',
    'query-mode': 'Chế độ hiển thị',
  };
  const control = page.getByRole('combobox', { name: names[id as keyof typeof names], exact: true });
  await control.click();
  await page.getByRole('option', { name: label, exact: true }).click();
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.cdk-overlay-pane:has([role="listbox"])')).toHaveCount(0);
}
async function noPageOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  const layout = await page.locator('.demo-page-body').evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: el.clientWidth, scroll: el.scrollWidth, viewport: window.innerWidth };
  });
  expect(layout.left).toBeGreaterThanOrEqual(-1);
  expect(layout.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.scroll).toBeLessThanOrEqual(layout.width + 1);
}

test('new demos are reachable through sidebar search and breadcrumb navigation', async ({ page }) => {
  await page.goto('/component/button');
  await page.getByRole('searchbox', { name: 'Tìm kiếm', exact: true }).fill('Query Builder');
  await page.getByRole('link', { name: 'Query Builder', exact: true }).click();
  await expect(page).toHaveURL(/\/component\/query-builder$/);
  await expect(page.getByTestId('query-count')).toHaveText('2 / 6 dự án phù hợp');
  await page.getByRole('navigation', { name: 'Đường dẫn demo truy vấn' }).getByRole('link', { name: 'Component' }).click();
  await expect(page).toHaveURL(/\/component\/button$/);
});

test('contract edits, snapshot, exported canonical JSON and diagnostics use the same model', async ({ page }, info) => {
  await page.goto('/component/api-contract-builder');
  await expect(page.getByTestId('contract-validity')).toHaveText('0 lỗi · 0 cảnh báo');
  const builder = page.locator('sd-api-contract-builder');
  await builder.getByRole('textbox', { name: 'Tên', exact: true }).fill('Nova search contract');
  await page.getByRole('button', { name: 'Lưu bản chụp', exact: true }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất hợp đồng JSON', exact: true }).click();
  const download = await downloadEvent;
  const file = info.outputPath('contract.json');
  await download.saveAs(file);
  const contract = JSON.parse(await fs.readFile(file, 'utf8'));
  expect(contract.name).toBe('Nova search contract');
  expect(contract.contractVersion).toBe(1);
  expect(contract.input.schema).toBeDefined();
  expect(contract.req).toBeDefined();
  expect(contract.res).toBeDefined();
  expect(contract.output.schema).toBeDefined();
  await captureCompatibility(page, { path: 'docs/screenshots/core31-contract-desktop.png', fullPage: true, animations: 'disabled' });
  await builder.getByRole('textbox', { name: 'Tên', exact: true }).fill('');
  await expect(page.getByRole('button', { name: 'Xuất hợp đồng JSON', exact: true })).toBeDisabled();
  await choose(page, 'contract-sample', 'Hợp đồng có lỗi');
  await page.getByRole('button', { name: 'Nạp mẫu hợp đồng', exact: true }).click();
  await expect(page.getByTestId('contract-diagnostics')).toContainText('mapping.');
  await expect(page.getByRole('button', { name: 'Lưu bản chụp', exact: true })).toBeDisabled();
});

test('contract blank/view/disabled states and reset cancellation retain the right state', async ({ page }) => {
  await page.goto('/component/api-contract-builder');
  await choose(page, 'contract-sample', 'Bắt đầu trống');
  await page.getByRole('button', { name: 'Nạp mẫu hợp đồng', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Xuất hợp đồng JSON', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Khôi phục mẫu', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Xuất hợp đồng JSON', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Khôi phục mẫu', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await choose(page, 'contract-mode', 'Chỉ xem');
  await expect(page.locator('sd-api-contract-builder').getByRole('textbox', { name: 'Tên', exact: true })).toHaveCount(0);
  await choose(page, 'contract-mode', 'Chỉnh sửa');
  await page.getByRole('switch', { name: 'Khóa chỉnh sửa (disabled)', exact: true }).click();
  await expect(page.locator('sd-api-contract-builder').getByRole('textbox', { name: 'Tên', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Lưu bản chụp', exact: true })).toBeDisabled();
});

test('query builder applies AND/OR/nesting/field/date, empty search and retry', async ({ page }) => {
  await page.goto('/component/query-builder');
  for (const [preset, count] of [
    ['OR · Thiết kế hoặc ngân sách > 120', 3],
    ['Nhóm AND/OR lồng nhau', 3],
    ['So sánh Đã chi > Ngân sách', 2],
    ['Ngày tạo trong tháng 9', 3],
  ] as const) {
    await choose(page, 'query-preset', preset);
    await page.getByRole('button', { name: 'Nạp tình huống', exact: true }).click();
    await page.getByRole('button', { name: 'Áp dụng bộ lọc', exact: true }).click();
    await expect(page.getByTestId('query-count')).toHaveText(`${count} / 6 dự án phù hợp`);
    await expect(page.locator('sd-data-state')).not.toHaveAttribute('aria-busy', 'true');
  }
  await page.getByRole('textbox', { name: 'Tìm trong kết quả', exact: true }).fill('no matching project');
  await expect(page.getByTestId('query-count')).toHaveText('0 / 6 dự án phù hợp');
  await expect(page.locator('sd-data-state')).toContainText('Không có dự án phù hợp');
  await page.getByRole('textbox', { name: 'Tìm trong kết quả', exact: true }).fill('');
  await page.getByRole('switch', { name: 'Giả lập lỗi lần truy vấn tới', exact: true }).click();
  await page.getByRole('button', { name: 'Áp dụng bộ lọc', exact: true }).click();
  await expect(page.locator('sd-data-state [role="alert"]')).toBeVisible();
  await page.locator('sd-data-state').getByRole('button').click();
  await expect(page.locator('sd-table')).toBeVisible();
  await captureCompatibility(page, { path: 'docs/screenshots/core31-query-desktop.png', fullPage: true, animations: 'disabled' });
});

test('query results sort/select/confirm/undo and quick operator hands off a real filter', async ({ page }) => {
  await page.goto('/component/query-builder');
  const table = page.locator('sd-table');
  await table.getByRole('button', { name: 'Ngân sách (triệu)', exact: true }).click();
  await expect(
    table
      .getByRole('row')
      .filter({ hasText: /PRJ-\d/ })
      .first()
  ).toContainText('PRJ-04');
  await table.getByRole('row').filter({ hasText: 'PRJ-01' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Tạm dừng đã chọn', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Tạm dừng', exact: true }).click();
  await expect(page.getByTestId('query-count')).toHaveText('1 / 6 dự án phù hợp');
  await page.getByRole('button', { name: 'Hoàn tác tạm dừng', exact: true }).click();
  await expect(page.getByTestId('query-count')).toHaveText('2 / 6 dự án phù hợp');
  await page.getByRole('textbox', { name: 'Ngân sách (triệu)', exact: true }).fill('100');
  await page.getByRole('button', { name: 'Dùng bộ lọc nhanh', exact: true }).click();
  await page.getByRole('button', { name: 'Áp dụng bộ lọc', exact: true }).click();
  await expect(page.getByTestId('query-count')).toHaveText('2 / 6 dự án phù hợp');
  await page.getByRole('textbox', { name: 'Tìm trong kết quả', exact: true }).fill('Nova');
  await expect(table.locator('sd-highlight mark')).toHaveText('Nova');
});

test('outline loading/error/retry, cancel/confirm and required reason work with keyboard', async ({ page }) => {
  await page.goto('/component/button/outline');
  await expect(page.getByRole('button', { name: 'Chưa đủ quyền (demo)' })).toBeDisabled();
  await page.getByRole('switch', { name: 'failNext — Giả lập lỗi lần tải tới', exact: true }).click();
  const reload = page.getByRole('button', { name: 'Tải lại hồ sơ', exact: true });
  await reload.focus();
  await page.keyboard.press('Enter');
  await expect(reload).toBeDisabled();
  const screen = page.locator('app-button-outline-demo');
  await expect(screen.getByRole('alert')).toContainText('Không tải được hồ sơ');
  await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(screen.getByRole('alert')).toHaveCount(0);
  await page.getByRole('button', { name: 'Duyệt hồ sơ', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Hủy', exact: true })).toBeFocused();
  await page.getByRole('dialog').getByRole('button', { name: 'Hủy', exact: true }).press('Enter');
  await expect(page.getByTestId('outline-record-state')).toContainText('Chờ duyệt');
  // Core throttles repeated activation of one button for 300 ms.
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'Duyệt hồ sơ', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Duyệt hồ sơ', exact: true }).click();
  await expect(page.getByTestId('outline-record-state')).toContainText('Đã duyệt');
  await page.getByRole('button', { name: 'Yêu cầu bổ sung', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Lưu yêu cầu', exact: true })).toBeDisabled();
  await dialog.getByRole('textbox').fill('Bổ sung bảng dự toán.');
  await dialog.getByRole('button', { name: 'Lưu yêu cầu', exact: true }).click();
  await expect(screen.getByRole('status')).toContainText('Bổ sung bảng dự toán.');
  await captureCompatibility(page, { path: 'docs/screenshots/core31-outline-desktop.png', fullPage: true, animations: 'disabled' });
});

test('mobile contract, query cards/undo and confirm stay reachable without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/component/api-contract-builder');
  await noPageOverflow(page);
  await page.getByRole('button', { name: 'Lưu bản chụp', exact: true }).click();
  await captureCompatibility(page, { path: 'docs/screenshots/core31-contract-mobile.png', fullPage: true, animations: 'disabled' });
  await page.goto('/component/query-builder');
  await noPageOverflow(page);
  const queryScroller = page.getByRole('region', { name: 'Trình thiết kế điều kiện', exact: true });
  await queryScroller.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => queryScroller.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await expect(page.locator('sd-table')).toContainText('Nova workspace');
  const rowAction = page.locator('sd-table').getByRole('button', { name: 'Thao tác với PRJ-01 · Nova workspace', exact: true });
  const actionBounds = await rowAction.boundingBox();
  expect(actionBounds).not.toBeNull();
  expect(actionBounds!.x).toBeGreaterThanOrEqual(0);
  expect(actionBounds!.x + actionBounds!.width).toBeLessThanOrEqual(390);
  await rowAction.click();
  const rowDialog = page.getByRole('dialog', { name: 'Thao tác dòng: PRJ-01 · Nova workspace', exact: true });
  await rowDialog.getByRole('button', { name: 'Tạm dừng', exact: true }).click();
  await page.getByRole('dialog', { name: 'Tạm dừng dự án', exact: true }).getByRole('button', { name: 'Tạm dừng', exact: true }).click();
  await expect(rowDialog).not.toBeVisible();
  await page.getByRole('button', { name: 'Hoàn tác tạm dừng', exact: true }).click();
  await captureCompatibility(page, { path: 'docs/screenshots/core31-query-mobile.png', fullPage: true, animations: 'disabled' });
  await page.goto('/component/button/outline');
  await page.getByRole('button', { name: 'Duyệt hồ sơ', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await captureCompatibility(page, { path: 'docs/screenshots/core31-confirm-mobile.png', fullPage: true, animations: 'disabled' });
  await noPageOverflow(page);
  await page.getByRole('dialog').getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(page.getByTestId('outline-record-state')).toContainText('Chờ duyệt');
});
