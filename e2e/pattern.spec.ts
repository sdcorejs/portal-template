import { test, expect, Page } from '@playwright/test';
import { PATTERN_GROUPS, PATTERN_PATHS } from '../src/modules/pattern/catalog/pattern-catalog';
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

test('inline operators combine numeric comparison and text filtering', async ({ page }) => {
  await open(page, 'table', 'inline-operator');
  const table = page.locator('app-pattern-results');
  await expect(table.locator('tbody a')).toHaveCount(6);
  const amount = table.locator('th').filter({ has: page.getByRole('button', { name: 'Giá trị (VND)', exact: true }) });
  await amount.getByRole('button').nth(1).click();
  await page.getByRole('menuitem', { name: 'Nhỏ hơn LESS_THAN', exact: true }).click();
  await amount.getByRole('textbox').fill('7000000');
  await amount.getByRole('textbox').press('Enter');
  await expect(table.locator('tbody a')).toHaveCount(2);
  const name = table.locator('th').filter({ has: page.getByRole('button', { name: 'Khách hàng', exact: true }) });
  await name.getByRole('textbox').fill('An Phát');
  await name.getByRole('textbox').press('Enter');
  await expect(table.locator('tbody a')).toHaveCount(1);
  await expect(table.locator('tbody a')).toHaveText('DH-1001');
});

test('table inline filters and custom header/cell templates render real Core columns', async ({ page }) => {
  await open(page, 'table', 'inline-filter');
  const demo = page.locator('app-pattern-results');
  await expect(demo.locator('tbody a')).toHaveCount(6);
  const filter = demo
    .locator('thead th')
    .filter({ has: page.getByRole('button', { name: 'Khách hàng', exact: true }) })
    .getByRole('textbox');
  await filter.fill('An Phát');
  await filter.press('Enter');
  await expect(demo.locator('tbody a')).toHaveCount(3);
  await expect(demo.getByRole('row').filter({ has: page.getByRole('link') })).toHaveText([/An Phát/, /An Phát/, /An Phát/]);
  await expect(demo.locator('tbody')).toContainText('An Phát');
  await open(page, 'table', 'custom-cells');
  await expect(demo.getByRole('columnheader').filter({ hasText: 'Đơn vị: VND' })).toBeVisible();
  await expect(demo.locator('tbody strong').first()).toHaveText('An Phát');
});

test('table children commands execute row and selection actions', async ({ page }) => {
  await open(page, 'table', 'children');
  const demo = page.locator('app-pattern-results');
  const row = (code: string) => demo.getByRole('row').filter({ has: page.getByRole('link', { name: code, exact: true }) });
  await row('DH-1001').getByRole('button', { name: 'Xử lý đơn hàng', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Duyệt đơn hàng', exact: true }).click();
  await expect(row('DH-1001')).toContainText('Đang xử lý');
  await row('DH-1001').getByRole('checkbox').check();
  await demo.getByRole('button', { name: 'Xử lý các đơn đã chọn', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Hoàn tất đơn hàng', exact: true }).click();
  await expect(row('DH-1001')).toContainText('Hoàn tất');
  await expect(row('DH-1002')).toContainText('Đang xử lý');
});

test('inline table preserves edits through add/delete and distinguishes FE and BE errors', async ({ page }) => {
  await open(page, 'table', 'inline-edit');
  const demo = page.locator('app-pattern-inline-table');
  const name = (id: number) => demo.locator(`sd-input[name="name"][data-line-id="${id}"] input`);
  await name(1).fill('Máy in mới');
  await demo.locator('th sd-button[tooltip="Thêm dòng"] button').click();
  await expect(name(3)).toBeVisible();
  await expect(name(1)).toHaveValue('Máy in mới');
  await demo.getByRole('button', { name: 'Xoá dòng', exact: true }).last().click();
  await expect(name(3)).toHaveCount(0);
  await expect(name(1)).toHaveValue('Máy in mới');
  await name(2).fill('');
  const save = () => demo.getByRole('button', { name: 'Lưu', exact: true }).click({ delay: 350 });
  await save();
  await expect(demo.locator('sd-inform .c-warning')).toBeVisible();
  await name(2).fill('Máy in mới');
  await save();
  await expect(demo.locator('sd-inform .c-error')).toBeVisible();
  await name(2).fill('Màn hình mới');
  await save();
  await expect(demo.locator('sd-inform')).toContainText('Đã lưu 2 dòng hàng');
  await demo.screenshot({ path: 'test-results/inline-edit.png' });
});

test('compact inline table adds rows from command header even when empty', async ({ page }) => {
  await open(page, 'table', 'inline-command-header');
  const demo = page.locator('app-pattern-inline-table');
  await demo.getByRole('button', { name: 'Xoá dòng', exact: true }).last().click({ delay: 350 });
  await demo.getByRole('button', { name: 'Xoá dòng', exact: true }).last().click({ delay: 350 });
  const add = demo.locator('th sd-button[tooltip="Thêm dòng"] button');
  await add.click();
  await expect(demo.locator('sd-input[name="name"][data-line-id="3"] input')).toBeVisible();
  await demo.screenshot({ path: 'test-results/inline-command-header.png' });
});

test('grouped actions use Core popover with keyboard and execute a command', async ({ page }) => {
  await open(page, 'button', 'grouped');
  const trigger = page.locator('app-pattern-button').getByRole('button', { name: 'Tác vụ', exact: true });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Duyệt', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/action-popover.png' });
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.press('ArrowDown');
  await page.getByRole('menuitem', { name: 'Duyệt', exact: true }).click();
  await expect(page.locator('app-pattern-button').getByRole('status')).toContainText('Duyệt');
});

test('three section drawer shows two FE warnings and BE error then saves', async ({ page }) => {
  await open(page, 'drawer', 'section-errors');
  const opener = button(page, 'Tạo liên hệ');
  const title = page.getByRole('heading', { name: 'Danh sách liên hệ', exact: true });
  const titleBox = (await title.boundingBox())!;
  const buttonBox = (await opener.boundingBox())!;
  expect(buttonBox.x).toBeGreaterThan(titleBox.x + titleBox.width);
  expect(Math.abs(buttonBox.y + buttonBox.height / 2 - titleBox.y - titleBox.height / 2)).toBeLessThan(2);
  await opener.click();
  const dialog = page.getByRole('dialog');
  const editor = dialog.locator('app-pattern-form-editor');
  await expect(editor.locator('sd-section')).toHaveCount(3);
  const save = () => dialog.getByRole('button', { name: 'Tạo liên hệ', exact: true }).click({ delay: 350 });
  await save();
  await expect(editor.locator('sd-section sd-inform')).toHaveCount(2);
  await expect(editor.locator('sd-inform[color="warning"]')).toHaveCount(2);
  await dialog.screenshot({ path: 'test-results/drawer-three-section-warnings.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  await dialog.screenshot({ path: 'test-results/drawer-three-section-mobile.png' });
  await editor.getByRole('textbox', { name: 'Họ và tên', exact: true }).fill('Liên hệ mẫu mới');
  await expect(editor.locator('sd-section sd-inform')).toHaveCount(1);
  await editor.getByRole('textbox', { name: 'Email', exact: true }).fill('minhanh@example.test');
  await save();
  await expect(editor.locator('sd-section sd-inform')).toHaveCount(0);
  await expect(editor.locator('sd-inform')).toContainText('Email đã được sử dụng');
  await expect(editor.locator('sd-inform .c-error')).toBeVisible();
  await expect(page.locator('toast')).toHaveCount(0);
  await editor.getByRole('textbox', { name: 'Email', exact: true }).fill('new-section@example.test');
  await save();
  await expect(dialog).toBeHidden();
});

test('button conventions: common CRUD, entity CRUD and light business actions', async ({ page }) => {
  await open(page, 'button', 'crud');
  const demo = page.locator('app-pattern-button');
  await expect(page.getByText('Ghép thành page', { exact: true })).toHaveCount(0);
  for (const label of ['Tạo mới', 'Chỉnh sửa', 'Lưu']) {
    await expect(demo.getByRole('button', { name: label, exact: true })).toHaveClass(/c-fill/);
    await expect(demo.getByRole('button', { name: label, exact: true })).toHaveClass(/mat-primary/);
  }
  await expect(demo.getByRole('button', { name: 'Xoá', exact: true })).toHaveClass(/mat-error/);
  await expect(demo.getByRole('link', { name: 'LH-1024', exact: true })).toHaveAttribute('href', '/pattern/drawer/detail');
  await demo.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('Đã lưu thay đổi.');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/button-crud.png' });
  await open(page, 'button', 'crud-entity');
  for (const label of ['Tạo liên hệ', 'Chỉnh sửa liên hệ', 'Lưu liên hệ']) {
    await expect(demo.getByRole('button', { name: label, exact: true })).toHaveClass(/c-fill/);
    await expect(demo.getByRole('button', { name: label, exact: true })).toHaveClass(/mat-primary/);
  }
  await open(page, 'button', 'workflow');
  await expect(demo.locator('sd-section')).toHaveCount(3);
  await expect(demo.locator('button.c-light')).toHaveCount(18);
  await demo.locator('sd-section').first().getByRole('button', { name: 'Duyệt', exact: true }).click();
  await expect(demo.getByRole('status')).toContainText('Đã thực hiện tác vụ mẫu: Duyệt.');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/button-workflow.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('Core table related lines calculate footer totals', async ({ page }) => {
  await open(page, 'table', 'related');
  const table = page.locator('app-pattern-table sd-table');
  await expect(table.getByRole('row').filter({ hasText: 'Máy in' })).toContainText('6.000.000');
  const footer = table.getByRole('row').filter({ hasText: 'Tổng cộng' });
  await expect(footer).toContainText('10');
  await expect(footer).toContainText('15.500.000');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/table-related-core.png' });
});

test('Core table states load, empty, error retry and unmatched search', async ({ page }) => {
  await open(page, 'table', 'states');
  const demo = page.locator('app-pattern-table');
  const table = demo.locator('sd-table');
  await expect(table.locator('.c-loading')).toBeVisible();
  await expect(table.getByRole('row').filter({ hasText: 'DH-1001' })).toBeVisible();
  await demo.getByRole('button', { name: 'Chưa có dữ liệu', exact: true }).click();
  await expect(table.getByText('Chưa có đơn hàng', { exact: true })).toBeVisible();
  await expect(table.locator('.c-loading')).toBeHidden();
  await expect(table.getByRole('row').filter({ hasText: 'DH-1001' })).toHaveCount(0);
  await page.locator('.preview-stage').screenshot({ path: 'test-results/table-empty-core.png' });
  await demo.getByRole('button', { name: 'Lỗi rồi thử lại', exact: true }).click();
  await expect(table.getByText('Không thể tải đơn hàng', { exact: true })).toBeVisible();
  await page.locator('.preview-stage').screenshot({ path: 'test-results/table-error-core.png' });
  await table.getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(table.getByRole('row').filter({ hasText: 'DH-1001' })).toBeVisible();
  const search = table.getByPlaceholder('Tìm mã hoặc tên khách hàng');
  await search.fill('khong-ton-tai');
  await search.press('Enter');
  await expect(table.getByText('Không có kết quả phù hợp', { exact: true })).toBeVisible();
  await expect(table.locator('.c-loading')).toBeHidden();
  await expect(table.getByRole('row').filter({ hasText: 'DH-1001' })).toHaveCount(0);
  await page.locator('.preview-stage').screenshot({ path: 'test-results/table-no-results-core.png' });
  await search.fill('DH-1002');
  await search.press('Enter');
  await expect(table.getByRole('row').filter({ hasText: 'DH-1002' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test('tree showcase: hierarchy, leaf selection and row commands', async ({ page }) => {
  page.setDefaultTimeout(15000);
  await open(page, 'table', 'tree');
  const demo = page.locator('app-pattern-tree-table');
  const row = (code: string) => demo.getByRole('row').filter({ hasText: code });
  await expect(row('VP-PRINT')).toContainText('Danh mục');
  await expect(row('SP-001')).toContainText('HP LaserJet Pro');
  await expect(row('NH-VP').getByRole('checkbox')).toBeDisabled();
  const toggle = row('NH-VP').locator('.sd-tree-toggle-btn');
  await toggle.click();
  await expect(row('SP-001')).toHaveCount(0);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(row('SP-001')).toBeVisible();
  await row('SP-001').getByRole('checkbox').check();
  await row('SP-003').getByRole('checkbox').check();
  await expect(demo.getByRole('button', { name: 'Tạm ngừng sản phẩm đã chọn', exact: true })).toBeInViewport();
  await page.locator('.preview-stage').screenshot({ path: 'test-results/tree-showcase-selection.png' });
  await demo.getByRole('button', { name: 'Tạm ngừng sản phẩm đã chọn', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('Đã tạm ngừng 2 sản phẩm.');
  await expect(row('SP-001')).toContainText('Tạm ngừng');
  await expect(row('SP-003')).toContainText('Tạm ngừng');
  await expect(row('SP-002')).toContainText('Đang bán');
  await row('SP-001').getByRole('button', { name: 'Mở bán', exact: true }).click();
  await expect(row('SP-001')).toContainText('Đang bán');
  await row('SP-001').getByRole('button', { name: 'Xem chi tiết', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Thiết bị văn phòng / In ấn / HP LaserJet Pro');
  await page.getByRole('dialog').locator('sd-button').getByRole('button', { name: 'Đóng', exact: true }).click();
  await demo.getByRole('checkbox', { name: 'Hiện selection', exact: true }).uncheck();
  await expect(row('SP-001')).toBeVisible();
  await expect(row('SP-001').getByRole('checkbox')).toHaveCount(0);
  await demo.getByRole('checkbox', { name: 'Hiện command', exact: true }).uncheck();
  await expect(row('SP-001')).toBeVisible();
  await expect(row('SP-001').getByRole('button', { name: 'Xem chi tiết', exact: true })).toHaveCount(0);
  await demo.getByRole('checkbox', { name: 'Hiện selection', exact: true }).check();
  await expect(row('SP-001').getByRole('checkbox')).toBeVisible();
  await demo.getByRole('checkbox', { name: 'Hiện command', exact: true }).check();
  await expect(row('SP-001').getByRole('button', { name: 'Xem chi tiết', exact: true })).toBeVisible();
  await page.locator('.preview-stage').screenshot({ path: 'test-results/tree-showcase-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(demo).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.locator('.preview-stage').screenshot({ path: 'test-results/tree-showcase-mobile.png' });
});

test('tree showcase: select all excludes parents and collapsed products', async ({ page }) => {
  await open(page, 'table', 'tree');
  const demo = page.locator('app-pattern-tree-table');
  const row = (code: string) => demo.getByRole('row').filter({ hasText: code });
  await row('NH-VP').locator('.sd-tree-toggle-btn').click();
  await demo.getByRole('columnheader').getByRole('checkbox').check();
  await expect(demo.locator('tbody input[type="checkbox"]:checked')).toHaveCount(2);
  await demo.getByRole('button', { name: 'Tạm ngừng sản phẩm đã chọn', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('Đã tạm ngừng 2 sản phẩm.');
  await expect(row('SP-005')).toContainText('Tạm ngừng');
  await expect(row('SP-006')).toContainText('Tạm ngừng');
  await expect(demo.locator('tbody input[type="checkbox"]:checked')).toHaveCount(0);
  await expect(row('SP-001')).toHaveCount(0);
  await row('NH-VP').locator('.sd-tree-toggle-btn').click();
  await expect(row('SP-001')).toContainText('Đang bán');
  await expect(row('NH-VP')).toContainText('30');
});
test('Pattern design: primary actions and review captures', async ({ page }) => {
  await open(page, 'tab-group', 'form');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/tab-group-design.png' });
  await open(page, 'stepper', 'draft');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/stepper-design.png' });
  const next = page.locator('app-pattern-stepper').getByRole('button', { name: 'Tiếp tục', exact: true });
  await expect(next).toHaveClass(/c-fill/);
  await expect(next).toHaveClass(/mat-primary/);
  await expect(page.locator('app-pattern-stepper').getByRole('button', { name: 'Lưu nháp', exact: true })).toHaveClass(/c-light/);
  await open(page, 'tab-group', 'form');
  const save = page.locator('app-pattern-tab-group').getByRole('button', { name: 'Lưu', exact: true });
  await expect(save).toHaveClass(/c-fill/);
  await expect(save).toHaveClass(/mat-primary/);
  await page.setViewportSize({ width: 390, height: 900 });
  await open(page, 'stepper', 'basic');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/stepper-design-mobile.png' });
  await open(page, 'tab-group', 'many');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/tab-group-design-mobile.png' });
});
test('Tab Group: counts, form retention, loading retry and guarded close', async ({ page }) => {
  await open(page, 'tab-group', 'counts');
  const demo = page.locator('app-pattern-tab-group');
  await expect(demo.getByRole('tab', { name: /Chờ xử lý/ })).toContainText('8');
  await demo.getByRole('button', { name: 'Hoàn tất một đơn chờ xử lý' }).click();
  await expect(demo.getByRole('tab', { name: /Chờ xử lý/ })).toContainText('7');
  await open(page, 'tab-group', 'form');
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Khách hàng thử');
  await demo.getByRole('tab', { name: /Liên hệ/ }).click();
  await demo.getByRole('textbox', { name: 'Email' }).fill('invalid');
  await demo.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(demo.getByRole('tab', { name: /Liên hệ/ })).toHaveAttribute('aria-selected', 'true');
  await demo.getByRole('tab', { name: /Thông tin chung/ }).click();
  await expect(demo.getByRole('textbox', { name: 'Tên khách hàng' })).toHaveValue('Khách hàng thử');
  await open(page, 'tab-group', 'loading');
  await demo.getByRole('button', { name: 'Không có dữ liệu', exact: true }).click();
  await expect(demo.locator('sd-data-state')).toContainText('Chưa có dữ liệu trong nhóm này');
  await demo.getByRole('button', { name: 'Mô phỏng lỗi' }).click();
  await expect(demo.getByRole('status')).toContainText('Đang tải');
  await expect(demo.locator('sd-data-state')).toContainText('Không tải được dữ liệu');
  await page.locator('.preview-stage').screenshot({ path: 'test-results/tab-data-state.png' });
  await demo.getByRole('button', { name: 'Thử lại' }).click();
  await expect(demo.locator('sd-section')).toContainText('Công ty An Phát');
  await open(page, 'tab-group', 'closable');
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Bản nháp');
  page.once('dialog', dialog => dialog.dismiss());
  await demo
    .getByRole('tab', { name: /CUS-001/ })
    .locator('button')
    .click();
  await expect(demo.getByRole('tab', { name: /CUS-001/ })).toBeVisible();
  await demo.getByRole('tab', { name: /CUS-002/ }).click();
  await expect(demo.getByRole('textbox', { name: 'Tên khách hàng' })).toHaveValue('Công ty Minh Long');
  page.once('dialog', dialog => dialog.accept());
  await demo
    .getByRole('tab', { name: /CUS-001/ })
    .locator('button')
    .click();
  await expect(demo.getByRole('tab', { name: /CUS-001/ })).toHaveCount(0);
});

test('Stepper: validation, review, edit, save and draft restoration', async ({ page }) => {
  await open(page, 'stepper', 'draft');
  const demo = page.locator('app-pattern-stepper');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(demo.getByRole('textbox', { name: 'Tên khách hàng' })).toBeVisible();
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Công ty kiểm thử');
  // Core buttons throttle repeated activation for 300 ms.
  await page.waitForTimeout(350);
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await demo.getByRole('textbox', { name: 'Email', exact: true }).fill('qa@example.test');
  await demo.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await page.reload();
  await demo.getByRole('button', { name: 'Khôi phục bản nháp' }).click();
  await expect(demo.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue('qa@example.test');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(demo).toContainText('Công ty kiểm thử');
  await demo.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await page.reload();
  await demo.getByRole('button', { name: 'Khôi phục bản nháp' }).click();
  await expect(demo.getByRole('button', { name: 'Lưu', exact: true })).toBeVisible();
  await demo.getByRole('button', { name: 'Sửa Thông tin', exact: true }).click();
  await expect(demo.getByRole('textbox', { name: 'Tên khách hàng' })).toHaveValue('Công ty kiểm thử');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(demo.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click({ delay: 350 });
  await demo.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(demo).toContainText('Đã lưu thành công');
});

test('Stepper: duplicate code check and table selection', async ({ page }) => {
  await open(page, 'stepper', 'async');
  const demo = page.locator('app-pattern-stepper');
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Khách hàng');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await demo.getByRole('textbox', { name: /Mã hồ sơ/ }).fill('CUS-001');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Tiếp tục', exact: true })).toBeEnabled();
  await expect(demo.getByRole('textbox', { name: /Mã hồ sơ/ })).toBeVisible();
  await demo.getByRole('textbox', { name: /Mã hồ sơ/ }).fill('CUS-999');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Lưu', exact: true })).toBeVisible();
  await open(page, 'stepper', 'selection');
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Khách hàng');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await demo.locator('sd-table').getByRole('checkbox').nth(1).check();
  await expect(demo.locator('sd-table').getByRole('checkbox').nth(1)).toBeChecked();
  await expect(demo.locator('sd-table').getByRole('checkbox').first()).toHaveJSProperty('indeterminate', true);
  await expect(demo.getByText('Đã chọn 0 đơn hàng', { exact: true })).toHaveCount(0);
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click({ delay: 350 });
  await expect(demo).toContainText('DH-1001');
});
async function open(page: Page, group: string, variant: string) {
  await page.goto('/pattern/' + PATTERN_PATHS[group] + '/' + variant);
  await expect(page.locator('app-pattern-page .preview-title h2')).toHaveText(
    PATTERN_GROUPS[group].variants.find(v => v[0] === variant)![1]
  );
  await expect(page.locator('.preview-stage app-pattern-' + group)).toBeVisible();
}
test('Stepper: optional steps, business branch and repeated rows', async ({ page }) => {
  const demo = page.locator('app-pattern-stepper');
  await open(page, 'stepper', 'optional');
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Khách hàng');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await demo.getByRole('button', { name: 'Bỏ qua', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Lưu', exact: true })).toBeVisible();
  await open(page, 'stepper', 'branch');
  await demo.getByRole('button', { name: 'Doanh nghiệp', exact: true }).click();
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Doanh nghiệp');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(demo.getByRole('textbox', { name: 'Mã số thuế' })).toBeVisible();
  await open(page, 'stepper', 'lines');
  await demo.getByRole('textbox', { name: 'Tên khách hàng' }).fill('Khách hàng');
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await demo.locator('th sd-button[tooltip="Thêm dịch vụ"] button').click();
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  const services = demo.locator('sd-table sd-input input');
  await expect(services).toHaveCount(2);
  await services.nth(1).fill('Lắp đặt');
  await demo.locator('th sd-button[tooltip="Thêm dịch vụ"] button').click({ delay: 350 });
  await expect(services).toHaveCount(3);
  await expect(services.nth(1)).toHaveValue('Lắp đặt');
  await demo.getByRole('button', { name: 'Xoá dòng', exact: true }).last().click();
  await expect(services).toHaveCount(2);
  await page.waitForTimeout(350);
  await demo.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Lưu', exact: true })).toBeVisible();
  await expect(demo).toContainText('Lắp đặt');
});
for (const [group, meta] of Object.entries(PATTERN_GROUPS)) {
  test(group + ': every variant renders and fits mobile', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) errors.push(message.text());
    });
    for (const variant of meta.variants) {
      await open(page, group, variant[0]);
      for (const width of [768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await expect
          .poll(() => page.locator('.preview-stage').evaluate(el => el.scrollWidth <= el.clientWidth + 1), {
            message: group + '/' + variant[0] + ' at ' + width,
          })
          .toBe(true);
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    expect(errors).toEqual([]);
  });
}
test('Page header stays fixed while only page content scrolls', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 500 });
    await open(page, 'header', 'page');
    await page.getByRole('link', { name: 'Tác vụ', exact: true }).click();
    const header = page.locator('app-pattern-page > sd-page > .c-page-header');
    const content = page.locator('app-pattern-page > sd-page > .c-page-wrapper');
    const outlet = page.locator('.tab-router__disabled-outlet');
    await expect.poll(() => outlet.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
    const top = (await header.boundingBox())!.y;
    await content.evaluate(el => (el.scrollTop = el.scrollHeight));
    await expect.poll(() => content.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    expect((await header.boundingBox())!.y).toBeCloseTo(top, 1);
    expect(await outlet.evaluate(el => el.scrollTop)).toBe(0);
  }
});
test('Detail drawer edits the selected order and updates its list', async ({ page }) => {
  await open(page, 'table', 'standard');
  await page.getByRole('link', { name: 'DH-1001', exact: true }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).not.toHaveClass(/bg-white/);
  await drawer.getByRole('button', { name: 'Chỉnh sửa', exact: true }).click();
  await drawer.getByRole('textbox', { name: 'Khách hàng', exact: true }).fill('An Phát cập nhật');
  await drawer.getByRole('button', { name: 'Lưu', exact: true }).click();
  await expect(drawer.locator('dl')).toContainText('An Phát cập nhật');
  await drawer.locator('sd-button[title="Đóng"] button').click();
  await expect(page.locator('app-pattern-results')).toContainText('An Phát cập nhật');
});
test('Pattern menu exposes Table and legacy URLs redirect to singular paths', async ({ page }) => {
  await page.goto('/pattern/headers/page');
  await expect(page).toHaveURL(/\/pattern\/header\/page$/);
  await page.getByRole('button', { name: 'Table', exact: true }).click();
  await page.getByRole('link', { name: 'Tra cứu cơ bản', exact: true }).click();
  await expect(page).toHaveURL(/\/pattern\/table\/standard$/);
  await expect(page.locator('app-pattern-table a[href]:visible')).toHaveCount(6);
});

test('Table: Core filters are exclusive, functional, and fit the viewport', async ({ page }) => {
  for (const variant of ['quick-search', 'external-filter']) {
    await open(page, 'table', variant);
    const table = page.locator('app-pattern-results sd-table');
    await expect(page.locator('app-pattern-query')).toHaveCount(0);
    if (variant === 'quick-search') {
      await expect(table.getByRole('textbox', { name: 'Khách hàng', exact: true })).toHaveCount(0);
      await table.getByPlaceholder('Tìm mã hoặc tên').fill('DH-1001');
      await table.getByPlaceholder('Tìm mã hoặc tên').press('Enter');
    } else {
      await expect(table.getByPlaceholder('Tìm mã hoặc tên')).toHaveCount(0);
      await table.getByRole('textbox', { name: 'Khách hàng', exact: true }).fill('An Phát');
      await table.getByRole('textbox', { name: 'Khách hàng', exact: true }).press('Enter');
    }
    await expect(table.locator('a[href]')).toHaveCount(variant === 'quick-search' ? 1 : 3);
    await expect(table.locator('a[href]').first()).toHaveText('DH-1001');
    if (variant === 'quick-search') {
      await table.getByPlaceholder('Tìm mã hoặc tên').fill('');
      await table.getByPlaceholder('Tìm mã hoặc tên').press('Enter');
    } else {
      await table.getByRole('textbox', { name: 'Khách hàng', exact: true }).fill('');
      await table.getByRole('textbox', { name: 'Khách hàng', exact: true }).press('Enter');
    }
    await expect(table.locator('a[href]')).toHaveCount(6);
    await expect(table.locator('mat-paginator')).toBeVisible();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 800 });
      for (const selector of ['.tab-router__disabled-outlet', 'app-pattern-page > sd-page > .c-page-wrapper', '.preview-stage']) {
        await expect.poll(() => page.locator(selector).evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      const preview = (await page.locator('.preview-stage').boundingBox())!;
      const paginator = (await table.locator('mat-paginator').boundingBox())!;
      expect(paginator.y + paginator.height).toBeLessThanOrEqual(preview.y + preview.height);
      expect(paginator.y + paginator.height).toBeLessThanOrEqual(800);
    }
  }
});
test('Header/Footer: five paired variants and prioritized actions', async ({ page }) => {
  await open(page, 'header', 'page');
  const demo = page.locator('app-pattern-header');
  const variants = page.getByRole('navigation', { name: 'Biến thể Page Header' });
  await expect(variants.getByRole('link')).toHaveCount(5);
  for (const title of ['Cơ bản', 'Nâng cao', 'Tác vụ', 'Tác vụ nhỏ gọn', 'Tác vụ có gom nhóm']) {
    await variants.getByRole('link', { name: title, exact: true }).click();
    await expect(demo.getByRole('article')).toHaveCount(2);
    await expect(demo.getByRole('article', { name: 'Header Danh sách' }).locator('sd-badge')).toHaveCount(0);
  }
  const detail = demo.getByRole('article', { name: 'Header Chi tiết' });
  const list = demo.getByRole('article', { name: 'Header Danh sách' });
  await expect(list.locator('sd-button[prefixIcon="more_vert"]')).toHaveCount(0);
  await expect(list.getByRole('button', { name: 'Import', exact: true })).toBeVisible();
  await detail.locator('sd-button[prefixIcon="more_vert"]').click();
  await expect(page.getByRole('menu').locator('sd-icon')).toHaveCount(2);
  await page.getByRole('menuitem', { name: 'Duyệt', exact: true }).click();
  await expect(detail.getByRole('status')).toContainText('Đã thực hiện');
  await variants.getByRole('link', { name: 'Tác vụ', exact: true }).click();
  await expect(detail.locator('sd-button[title="Chỉnh sửa"]')).toHaveAttribute('type', 'fill');
  await expect(detail.getByRole('button', { name: 'Duyệt', exact: true })).toHaveClass(/mat-success/);
  await expect(detail.getByRole('button', { name: 'Từ chối', exact: true })).toHaveClass(/mat-warning/);
  expect((await detail.getByRole('button', { name: 'Chỉnh sửa', exact: true }).boundingBox())!.x).toBeGreaterThan(
    (await detail.getByRole('button', { name: 'Duyệt', exact: true }).boundingBox())!.x
  );
  await variants.getByRole('link', { name: 'Tác vụ nhỏ gọn', exact: true }).click();
  await expect(detail.locator('button.c-square')).toHaveCount(3);
  await detail.getByRole('button', { name: 'Chỉnh sửa', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Lưu', exact: true })).toBeVisible();
});
test('Header/Footer: drawer actions are in footer and section actions stay in header', async ({ page }, info) => {
  await open(page, 'header', 'side-drawer');
  await page.locator('app-pattern-header').getByRole('button', { name: 'Mở tạo mới', exact: true }).click();
  const drawer = page.getByRole('dialog');
  const save = drawer.getByRole('button', { name: 'Lưu', exact: true });
  await expect(save).toBeVisible();
  await expect(drawer).not.toHaveClass(/bg-white/);
  expect((await save.boundingBox())!.x).toBeGreaterThan((await drawer.locator('sd-button[title="Đóng"] button').boundingBox())!.x);
  expect((await save.boundingBox())!.y).toBeGreaterThan(800);
  await save.click();
  await expect(page.locator('toast[data-type="warning"]').last()).toContainText('Nhập khách hàng');
  await drawer.getByRole('textbox', { name: 'Khách hàng', exact: true }).fill('Công ty mẫu');
  await drawer.getByRole('textbox', { name: 'Khu vực', exact: true }).fill('Miền Nam');
  await drawer.getByRole('textbox', { name: 'Giá trị đơn hàng (VND)', exact: true }).fill('2500000');
  await save.click();
  await expect(drawer.locator('sd-section-item').first()).toContainText('Công ty mẫu');
  await expect(drawer.getByRole('status')).toHaveText('Đã lưu dữ liệu mẫu.');
  await drawer.getByRole('button', { name: 'Chỉnh sửa', exact: true }).click();
  await expect(drawer.getByRole('textbox', { name: 'Khách hàng', exact: true })).toHaveValue('Công ty mẫu');
  await drawer.getByRole('textbox', { name: 'Khách hàng', exact: true }).fill('Công ty đã cập nhật');
  await save.click();
  await expect(drawer.locator('sd-section-item').first()).toContainText('Công ty đã cập nhật');
  await page.screenshot({ path: info.outputPath('drawer-footer.png') });
  await drawer.locator('sd-button[title="Đóng"] button').click();
  await expect(drawer).not.toBeVisible();
  await open(page, 'header', 'section');
  const demo = page.locator('app-pattern-header');
  await expect(demo.locator('[sdHeaderLeft] sd-button')).toHaveCount(0);
  await expect(demo.locator('[sdHeaderRight] sd-button[type="fill"][color="primary"]')).toHaveCount(2);
  await expect(demo.locator('[sdFooterRight], [sdFooterLeft]')).toHaveCount(0);
  await demo.getByRole('button', { name: 'Thêm liên hệ', exact: true }).click();
  await expect(demo.getByRole('status').first()).toContainText('Đã thực hiện');
  await page.screenshot({ path: info.outputPath('section-header.png') });
});

test('Side Drawer table keeps outer content and pagination within its viewport', async ({ page }) => {
  for (const width of [1440, 900, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await open(page, 'header', 'side-drawer');
    await page.getByRole('button', { name: 'Chọn dữ liệu', exact: true }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer.locator('sd-table')).toContainText('DH-1001');
    await expect.poll(() => drawer.locator('sd-table').evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
    const content = drawer.locator('.sd-side-drawer-content');
    await expect
      .poll(() => content.evaluate(el => ({ height: el.clientHeight, scroll: el.scrollHeight })))
      .toEqual(await content.evaluate(el => ({ height: el.clientHeight, scroll: el.clientHeight })));
    const bounds = (await content.boundingBox())!;
    const pagination = (await drawer.locator('mat-paginator').boundingBox())!;
    expect(pagination.y + pagination.height).toBeLessThanOrEqual(bounds.y + bounds.height);
  }
});

test('Side Drawer: grouped header actions and table selection', async ({ page }) => {
  await open(page, 'header', 'side-drawer');
  const demo = page.locator('app-pattern-header');
  await demo.getByRole('button', { name: 'Gom tác vụ', exact: true }).click();
  const drawer = page.getByRole('dialog');
  await drawer.locator('[sdHeaderRight] sd-button').click();
  await page.getByRole('menuitem', { name: 'Duyệt', exact: true }).click();
  await expect(drawer.locator('sd-badge')).toContainText('Đã duyệt');
  await drawer.locator('sd-button[title="Đóng"] button').click();
  await demo.getByRole('button', { name: 'Chọn dữ liệu', exact: true }).click();
  const confirm = drawer.getByRole('button', { name: 'Xác nhận lựa chọn', exact: true });
  await expect(confirm).toBeDisabled();
  await drawer.getByRole('checkbox').nth(1).check();
  await expect(drawer.locator('[sdFooterLeft]')).toContainText('Đã chọn 1');
  await confirm.click();
  await expect(drawer).not.toBeVisible();
  await expect(demo.locator('sd-section').filter({ hasText: 'Đơn hàng đã chọn' })).toContainText('DH-1001');
  await demo.getByRole('button', { name: 'Chọn dữ liệu', exact: true }).click();
  await expect(confirm).toBeDisabled();
  await drawer.locator('sd-button[title="Đóng"] button').click();
  await demo.getByRole('button', { name: 'Xem bảng', exact: true }).click();
  await expect(drawer.getByRole('checkbox')).toHaveCount(0);
  await expect(drawer.locator('sd-table')).toContainText('DH-1001');
});

test('Score card icons use Core foreground colors on matching light backgrounds', async ({ page }) => {
  await open(page, 'score', 'icon-tile');
  const icons = page.locator('app-pattern-scorecards sd-icon');
  const colors = [
    ['rgb(41, 98, 255)', 'rgb(231, 233, 255)'],
    ['rgb(76, 175, 80)', 'rgb(219, 239, 220)'],
    ['rgb(255, 150, 0)', 'rgb(255, 234, 204)'],
  ];
  for (let i = 0; i < colors.length; i++) {
    await expect(icons.nth(i).locator('mat-icon, svg').first()).toHaveCSS('color', colors[i][0]);
    await expect(icons.nth(i).locator('..')).toHaveCSS('background-color', colors[i][1]);
  }
  await page.locator('app-pattern-scorecards').screenshot({ path: 'test-results/scorecard-review.png' });
});

test('Score card icons retain their drawing area with a tile background', async ({ page }) => {
  for (const variant of ['icon-tile', 'icon-inline']) {
    await open(page, 'score', variant);
    const icons = page.locator('app-pattern-scorecards sd-icon');
    await expect(icons).toHaveCount(3);
    for (const icon of await icons.all()) {
      const drawing = icon.locator('mat-icon, svg').first();
      await expect(drawing).toBeVisible();
      const bounds = await drawing.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(20);
      expect(bounds!.height).toBeGreaterThanOrEqual(20);
    }
  }
});

test('icon filter is keyboard accessible and source is real Angular', async ({ page }) => {
  await open(page, 'score', 'icon-filter');
  const card = page.locator('app-pattern-scorecards sd-card').filter({ hasText: 'Chờ xử lý' });
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('app-pattern-score [role="status"]')).toContainText('8 / 24');
  await expect(page.locator('app-pattern-score tbody tr')).toHaveCount(4);
  expect((await page.locator('app-pattern-score tbody .badge').allTextContents()).every(x => x === 'Chờ xử lý')).toBe(true);
  // Core cards throttle repeated activation for 300 ms.
  await page.waitForTimeout(350);
  await page.keyboard.press('Space');
  await expect(page.locator('app-pattern-score [role="status"]')).toContainText('24 / 24');
  await page.getByRole('tab', { name: 'Mã nguồn', exact: true }).click();
  await expect(page.locator('.source-file')).not.toHaveCount(0);
  await page.locator('.source-file summary').filter({ hasText: 'score.component.ts' }).click();
  await expect(page.locator('.source-file sd-code-editor:visible')).toContainText('export class ScoreComponent');
  await page.getByRole('tab', { name: 'Xem trước', exact: true }).click();
  await expect(page.locator('app-pattern-score [role="status"]')).toContainText('24 / 24');
});
test('listing AND search/filter, detail, error retry and queue drill-down', async ({ page }) => {
  await open(page, 'composition', 'listing');
  await page.locator('app-pattern-scorecards sd-card').filter({ hasText: 'Chờ xử lý' }).click();
  await page.getByRole('searchbox', { name: 'Tìm nhanh', exact: true }).fill('an phat');
  await page.getByRole('combobox', { name: /^Khu vực/ }).selectOption('Miền Bắc');
  await expect(page.locator('app-pattern-composition > [role="status"]').first()).toContainText('1 kết quả phù hợp');
  await page.locator('app-pattern-results a[href]').filter({ hasText: 'DH-1001' }).click();
  await expect(page.getByRole('heading', { name: 'DH-1001 · An Phát' })).toBeVisible();
  await button(page, 'Đóng').last().click();
  await expect(page.getByRole('searchbox', { name: 'Tìm nhanh', exact: true })).toHaveValue('an phat');
  await page.getByLabel('Trạng thái demo').selectOption('error');
  await button(page, 'Thử lại').click();
  await expect(page.getByRole('searchbox', { name: 'Tìm nhanh', exact: true })).toHaveValue('an phat');
  await button(page, 'Xóa bộ lọc').click();
  await button(page, 'Hàng đợi').click();
  await button(page, 'Đưa vào xử lý').first().click();
  await expect(page.getByRole('status').filter({ hasText: 'Đã cập nhật 1 đơn hàng.' })).toBeVisible();
  await button(page, 'Tổng quan').click();
  await button(page, 'Chờ xử lý · 7 đơn →').click();
  await expect(page.locator('app-pattern-composition > [role="status"]').first()).toContainText('7 kết quả phù hợp');
});
test('drawer validates with notify, guards dirty close and updates detail', async ({ page }) => {
  await open(page, 'drawer', 'create');
  await button(page, 'Tạo liên hệ').click();
  const editor = page.locator('app-pattern-form-editor');
  await expect(editor.getByRole('textbox', { name: 'Họ và tên', exact: true })).toBeVisible();
  await expect(editor.locator('sd-section .sd-section-header')).toHaveCount(0);
  await expect(page.getByText('* Trường bắt buộc', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: 'Mô phỏng lỗi lưu' })).toHaveCount(0);
  // Core SdButton intentionally throttles repeat clicks for 300 ms.
  const save = () => page.getByRole('dialog').getByRole('button', { name: 'Tạo liên hệ', exact: true }).click({ delay: 350 });
  await save();
  await expect(page.locator('toast[data-type="warning"]').filter({ hasText: 'Kiểm tra' }).last()).toBeVisible();
  await expect(editor.getByRole('status')).toHaveCount(0);
  await page.getByRole('textbox', { name: 'Họ và tên', exact: true }).fill('Liên hệ mới');
  await page.keyboard.press('Escape');
  await expect(page.getByText('Thông tin chưa được lưu', { exact: true })).toBeVisible();
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('invalid-email');
  await save();
  await expect(page.locator('toast[data-type="warning"]').filter({ hasText: 'Kiểm tra' }).last()).toBeVisible();
  await expect(editor.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('minhanh@example.test');
  await save();
  await expect(page.locator('toast[data-type="error"]').filter({ hasText: 'Email đã được sử dụng' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('new@example.test');
  await save();
  await expect(page.getByRole('status').filter({ hasText: 'Đã lưu liên hệ Liên hệ mới.' })).toBeVisible();
  await expect(page.locator('app-pattern-drawer app-pattern-contact-facts').first()).toContainText('Liên hệ mới');
});

test('drawer inform errors stay above the white section and valid save closes it', async ({ page }) => {
  await open(page, 'drawer', 'create-inform');
  await button(page, 'Tạo liên hệ').click();
  const dialog = page.getByRole('dialog');
  const editor = dialog.locator('app-pattern-form-editor');
  await dialog.getByRole('button', { name: 'Tạo liên hệ', exact: true }).click({ delay: 350 });
  await expect(editor.locator('sd-inform')).toContainText('Chưa thể lưu thông tin');
  await expect(page.locator('toast[data-type="error"]')).toHaveCount(0);
  const banner = (await editor.locator('sd-inform').boundingBox())!;
  const section = (await editor.locator('sd-section').boundingBox())!;
  expect(banner.y + banner.height).toBeLessThanOrEqual(section.y);
  await expect(editor.locator('.sd-section')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(editor.locator('.sd-section-header')).toHaveCount(0);
  await editor.getByRole('textbox', { name: 'Họ và tên', exact: true }).fill('Liên hệ Inform');
  await editor.getByRole('textbox', { name: 'Email', exact: true }).fill('email-sai');
  await dialog.getByRole('button', { name: 'Tạo liên hệ', exact: true }).click({ delay: 350 });
  await expect(editor.locator('sd-inform')).toBeVisible();
  await expect(editor.getByRole('textbox', { name: 'Họ và tên', exact: true })).toHaveValue('Liên hệ Inform');
  await dialog.screenshot({ path: 'test-results/drawer-inform.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(editor.locator('sd-inform')).toBeInViewport();
  await dialog.screenshot({ path: 'test-results/drawer-inform-mobile.png' });
  await editor.getByRole('textbox', { name: 'Email', exact: true }).fill('inform@example.test');
  await dialog.getByRole('button', { name: 'Tạo liên hệ', exact: true }).click({ delay: 350 });
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('status').filter({ hasText: 'Đã lưu liên hệ Liên hệ Inform.' })).toBeVisible();
});

test('pristine create/update drawers close without a discard dialog and restore focus', async ({ page }) => {
  for (const variant of ['create', 'update']) {
    await open(page, 'drawer', variant);
    const opener = button(page, variant === 'create' ? 'Tạo liên hệ' : 'Chỉnh sửa liên hệ');
    await opener.click();
    await expect(page.locator('app-pattern-form-editor')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('app-pattern-form-editor')).toHaveCount(0);
    await expect(page.getByText('Thông tin chưa được lưu', { exact: true })).toHaveCount(0);
    await expect(opener).toBeFocused();
  }
});

test('table page size and sort reset page and selection; bulk updates selected rows', async ({ page }) => {
  await open(page, 'table', 'selection');
  const table = page.locator('app-pattern-results');
  await expect(table.locator('a[href]').first()).toHaveText('DH-1001');
  for (let index = 0; index < 3; index++) {
    await table.locator('.mat-mdc-paginator-navigation-next').click();
    await expect(table.locator('a[href]').first()).toHaveText('DH-' + (1001 + 6 * (index + 1)));
  }
  await table.getByRole('checkbox').last().check();
  await expect(table.getByRole('checkbox').last()).toBeChecked();
  await table.locator('mat-paginator .mat-mdc-paginator-touch-target').click();
  await page.getByRole('option', { name: '12', exact: true }).click();
  await expect(table.locator('a[href]').first()).toHaveText('DH-1001');
  await expect(table.locator('a[href]')).toHaveCount(12);
  await expect(table.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  await table.locator('.mat-mdc-paginator-navigation-next').click();
  await expect(table.locator('a[href]').first()).toHaveText('DH-1013');
  await table.getByRole('checkbox').last().check();
  await table.getByRole('columnheader', { name: 'Mã đơn', exact: true }).click();
  await expect(table.locator('a[href]').first()).toHaveText('DH-1001');
  await expect(table.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  await table.getByRole('checkbox').nth(1).check();
  await expect(table.getByRole('checkbox').first()).toHaveJSProperty('indeterminate', true);
  await button(page, 'Duyệt đơn hàng').click();
  await expect(page.getByRole('status').filter({ hasText: 'Đã cập nhật 1 đơn hàng.' })).toBeVisible();
  await expect(table.getByRole('row').filter({ hasText: 'DH-1001' })).toContainText('Đang xử lý');
});

test('clearing an optional region is dirty and saves the cleared value', async ({ page }) => {
  await open(page, 'drawer', 'update');
  await button(page, 'Chỉnh sửa liên hệ').click();
  await page.locator('sd-select[name="region"]').getByRole('button', { name: 'Xóa', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Đóng', exact: true }).click();
  await expect(page.getByText('Thông tin chưa được lưu', { exact: true })).toBeVisible();
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await button(page, 'Lưu thay đổi').click();
  await expect(page.locator('app-pattern-form-editor')).toHaveCount(0);
  await expect(page.locator('app-pattern-contact-facts sd-section-item[label="Khu vực"]')).toContainText('Chưa cung cấp');
});
test('form lines compute totals and route guard protects drafts', async ({ page }) => {
  await open(page, 'form', 'lines');
  await page.getByRole('textbox', { name: 'Tên đơn hàng', exact: true }).fill('Đơn kiểm tra');
  await page.locator('sd-input-number[name="quantity"][data-line-id="1"] input').fill('3');
  await page.locator('sd-input-number[name="price"][data-line-id="1"] input').fill('25000');
  await expect(page.locator('app-pattern-inline-table sd-table')).toContainText('75.000 ₫');
  await page.locator('.variants a').filter({ hasText: 'Một cột ngắn' }).click();
  await expect(page.getByText('Thông tin chưa được lưu', { exact: true })).toBeVisible();
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await expect(page).toHaveURL(/\/form\/lines$/);
  await button(page, 'Lưu').click();
  await expect(page.locator('app-pattern-inline-table sd-inform')).toContainText('Đã lưu 2 dòng hàng');
  await page.locator('.variants a').filter({ hasText: 'Một cột ngắn' }).click();
  await expect(page).toHaveURL(/\/form\/simple$/);
});
