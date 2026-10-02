import { expect, test } from '@playwright/test';

const browserErrors = new Map<unknown, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
});
test.afterEach(({ page }) => {
  expect(browserErrors.get(page)).toEqual([]);
  browserErrors.delete(page);
});

test('workspace entry and real table states, filters, sort, detail and approval', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/utility/workspace/queue');
  await expect(page.locator('app-workspace-queue')).toBeVisible();
  await expect(page.getByRole('button', { name: 'REQ-0001', exact: true })).toBeVisible();
  await page.locator('sd-card').filter({ hasText: 'Chờ duyệt' }).click();
  await expect(page.getByRole('button', { name: 'REQ-0002', exact: true })).not.toBeVisible();
  await page.locator('sd-card').filter({ hasText: 'Tất cả' }).click();
  const search = page.getByPlaceholder('Tìm mã hoặc tên dự án, rồi Enter');
  await search.fill('REQ-0004');
  await search.press('Enter');
  await expect(page.getByRole('button', { name: 'REQ-0004', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'REQ-0001', exact: true })).not.toBeVisible();
  await search.fill('');
  await search.press('Enter');
  await page.getByRole('button', { name: 'Giả lập lỗi', exact: true }).click();
  await expect(page.locator('sd-data-state [role="alert"]')).toBeVisible();
  await page.locator('sd-data-state').getByRole('button').click();
  await expect(page.getByRole('button', { name: 'REQ-0001', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'REQ-0001', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Duyệt hồ sơ', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Duyệt hồ sơ', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Duyệt hồ sơ', exact: true })).toBeDisabled();
  await page.getByRole('dialog', { name: 'Hồ sơ đề nghị' }).getByRole('button', { name: 'Đóng', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Hồ sơ đề nghị' })).not.toBeVisible();
  await page.getByRole('button', { name: 'Hoạt động', exact: true }).click();
  await expect(page.locator('sd-audit-diff')).toContainText('Đã duyệt');
  await page.screenshot({ path: 'docs/screenshots/workspace-activity-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('same published schema validates, submits with error recovery, then appears in queue', async ({ page }) => {
  await page.goto('/utility/workspace/request');
  await page.getByRole('button', { name: 'Tiếp tục: Tài liệu', exact: true }).click();
  await expect(page.locator('app-workspace-request [role="alert"]')).toContainText('kiểm tra');
  await page.getByRole('button', { name: 'Điền dữ liệu mẫu', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Tên dự án', exact: true })).toHaveValue('Không gian làm việc Nova');
  const project = page.getByRole('textbox', { name: 'Tên dự án', exact: true });
  await project.fill('');
  // Core buttons throttle repeated activation for 300 ms; exercise real keyboard editing between attempts.
  await project.pressSequentially('Dự án E2E Nova', { delay: 30 });
  await page.getByRole('checkbox', { name: 'Cần xử lý gấp', exact: true }).check();
  const reason = page.getByRole('textbox', { name: 'Lý do cần xử lý gấp', exact: true });
  await expect(reason).toBeVisible();
  await page.getByRole('button', { name: 'Tiếp tục: Tài liệu', exact: true }).click();
  await expect(reason).toHaveAttribute('aria-invalid', 'true');
  await reason.pressSequentially('Cần bàn giao trước sự kiện.', { delay: 25 });
  await page.getByRole('button', { name: 'Tiếp tục: Tài liệu', exact: true }).click();
  await expect(page.locator('sd-upload-file')).toBeVisible();
  const chooserPromise = page.waitForEvent('filechooser');
  await page.locator('sd-upload-file').getByRole('button', { name: 'Tải file', exact: true }).click();
  await (await chooserPromise).setFiles({ name: 'brief-nova.txt', mimeType: 'text/plain', buffer: Buffer.from('Fictional Nova brief') });
  await page.getByRole('button', { name: 'Kiểm tra trước khi gửi', exact: true }).click();
  await expect(page.locator('app-workspace-request')).toContainText('brief-nova.txt');
  await page.getByRole('switch', { name: 'Giả lập lỗi lần gửi tiếp theo', exact: true }).click();
  await page.getByRole('button', { name: 'Gửi đề nghị', exact: true }).last().click();
  await expect(page.locator('app-workspace-request [role="alert"]')).toContainText('Mô phỏng gửi thất bại');
  await page.getByRole('button', { name: 'Gửi đề nghị', exact: true }).last().click();
  await expect(page.locator('app-workspace-request')).toContainText('REQ-0025');
  await page.getByRole('button', { name: 'Mở hàng chờ', exact: true }).click();
  await expect(page.getByRole('button', { name: 'REQ-0025', exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/workspace-queue-desktop.png', fullPage: true });
});

test('file explorer has folders, empty state, preview, upload and retry', async ({ page }) => {
  await page.goto('/utility/workspace/files');
  await expect(page.locator('sd-file-explorer')).toContainText('Hướng dẫn demo.txt');
  const explorer = page.locator('sd-file-explorer');
  await explorer
    .locator('input[type="file"]')
    .setInputFiles({ name: 'workspace-note.txt', mimeType: 'text/plain', buffer: Buffer.from('Local fictional note') });
  await expect(explorer.locator('[data-item-id]').filter({ hasText: 'workspace-note.txt' })).toBeVisible();
  await explorer.getByRole('button', { name: 'Thư mục mới', exact: true }).click();
  const folderDialog = explorer.getByRole('dialog');
  await folderDialog.getByRole('textbox', { name: 'Tên thư mục', exact: true }).fill('Bản nháp E2E');
  await folderDialog.getByRole('button', { name: 'Tạo', exact: true }).click();
  await expect(explorer.locator('[data-item-id]').filter({ hasText: 'Bản nháp E2E' })).toBeVisible();
  const fileSearch = explorer.getByRole('searchbox');
  await fileSearch.fill('workspace-note');
  await expect(explorer.locator('[data-item-id="readme"]')).not.toBeVisible();
  await fileSearch.fill('');
  await page.screenshot({ path: 'docs/screenshots/workspace-files-desktop.png', fullPage: true });
  await explorer.locator('[data-item-id="readme"]').click();
  await expect(explorer.getByRole('dialog')).toContainText('Không có bản xem trước');
  const downloadPromise = page.waitForEvent('download');
  await explorer.getByRole('dialog').getByRole('button', { name: 'Tải xuống', exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('Hướng dẫn demo.txt');
  await explorer.getByRole('dialog').getByRole('button', { name: 'Đóng', exact: true }).click();
  await explorer.locator('[data-item-id="reference"]').click();
  await expect(explorer.locator('[data-item-id="concept"]')).toBeVisible();
  await explorer.locator('[data-item-id="concept"]').click();
  await expect(explorer.getByRole('dialog').locator('img')).toBeVisible();
  await explorer.getByRole('dialog').evaluate(async element => {
    await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => undefined)));
  });
  await page.screenshot({ path: 'docs/screenshots/workspace-files-preview-desktop.png', fullPage: true });
  await explorer.getByRole('dialog').getByRole('button', { name: 'Đóng', exact: true }).click();
  await explorer.getByRole('button', { name: 'Dạng lưới', exact: true }).click();
  await explorer.locator('[data-item-id="empty-folder"]').click();
  await expect(explorer.locator('sd-data-state')).toBeVisible();
  await page.getByRole('switch', { name: 'Chế độ chỉ đọc', exact: true }).click();
  await expect(explorer.locator('input[type="file"]')).toHaveCount(0);
  await expect(explorer.locator('sd-data-state')).toContainText('Thư mục trống');
  await page.screenshot({ path: 'docs/screenshots/workspace-files-empty-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Giả lập lỗi đọc', exact: true }).click();
  await expect(page.locator('sd-file-explorer')).toContainText('Mô phỏng lỗi đọc thư mục');
  await page.locator('sd-file-explorer').locator('sd-data-state').getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(page.locator('sd-file-explorer sd-data-state')).toContainText('Thư mục trống');
});

test('form designer supports a real edit, publishing and renderer handoff', async ({ page }) => {
  await page.goto('/utility/workspace/designer');
  await expect(page.locator('sd-form-builder')).toBeVisible();
  await page.locator('[data-fb-item="project"] [data-fb-card]').click();
  await page.getByRole('textbox', { name: 'Nhãn hiển thị', exact: true }).fill('Tên dự án thử nghiệm');
  await page.getByRole('textbox', { name: 'Nhãn hiển thị', exact: true }).press('Tab');
  await expect(page.getByRole('button', { name: 'Áp dụng biểu mẫu', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Áp dụng biểu mẫu', exact: true }).click();
  await page.screenshot({ path: 'docs/screenshots/workspace-designer-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Thử nhập liệu', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Tên dự án thử nghiệm', exact: true })).toBeVisible();
});

test('export can cancel, recover and download the actual session snapshot', async ({ page }) => {
  await page.goto('/utility/workspace/activity');
  await expect(page.getByRole('button', { name: 'Tải JSON', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Chuẩn bị bản xuất', exact: true }).click();
  await page.locator('sd-job-progress').getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(page.locator('sd-job-progress')).toContainText('Đã hủy');
  await page.getByRole('switch', { name: 'Giả lập lỗi xuất dữ liệu', exact: true }).click();
  await page.locator('sd-job-progress').getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(page.locator('sd-job-progress')).toContainText('Thất bại');
  await page.getByRole('switch', { name: 'Giả lập lỗi xuất dữ liệu', exact: true }).click();
  await page.locator('sd-job-progress').getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(page.locator('sd-job-progress')).toContainText('Hoàn tất');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải JSON', exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('workspace-requests.json');
  await page.screenshot({ path: 'docs/screenshots/workspace-export-desktop.png', fullPage: true });
});

test('table sorts, approves a selected pending row and resets the shared session', async ({ page }) => {
  await page.goto('/utility/workspace/queue');
  const table = page.locator('sd-table');
  const codeHeader = table.getByRole('columnheader', { name: 'Mã đề nghị', exact: true });
  await codeHeader.click();
  await codeHeader.click();
  await expect(table.getByRole('button', { name: /^REQ-/ }).first()).toHaveText('REQ-0024');
  const row = table.getByRole('row').filter({ hasText: 'REQ-0022' });
  await row.getByRole('checkbox').check();
  await table.getByRole('button', { name: 'Duyệt đã chọn', exact: true }).click();
  await expect(row).toContainText('Đã duyệt');
  await page.getByRole('button', { name: 'Reset workspace', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Khôi phục', exact: true }).click();
  await expect(page.locator('sd-card').filter({ hasText: 'Chờ duyệt' })).toContainText('8');
});

test('mobile renders compact file browser, stacked form and table cards', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/utility/workspace/queue');
  await expect(page.locator('app-workspace-queue')).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/workspace-queue-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'REQ-0001', exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'docs/screenshots/workspace-table-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Kho tài liệu', exact: true }).click();
  await expect(page.locator('sd-file-explorer')).toContainText('Hướng dẫn demo.txt');
  await page.screenshot({ path: 'docs/screenshots/workspace-files-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Gửi đề nghị', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Tên dự án', exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/workspace-request-mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
});
