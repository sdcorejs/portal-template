import { test, expect, Page } from '@playwright/test';
import { PATTERN_GROUPS } from '../src/modules/patterns/catalog/pattern-catalog';
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
async function open(page: Page, group: string, variant: string) {
  await page.goto('/patterns/' + group + '/' + variant);
  await expect(page.locator('app-pattern-page .preview-title h2')).toHaveText(
    PATTERN_GROUPS[group].variants.find(v => v[0] === variant)![1]
  );
  await expect(page.locator('.preview-stage app-pattern-' + group)).toBeVisible();
}
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
test('icon filter is keyboard accessible and source is real Angular', async ({ page }) => {
  await open(page, 'scores', 'icon-filter');
  const card = page.locator('app-pattern-scorecards button').filter({ hasText: 'Chờ xử lý' });
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('app-pattern-scores [role="status"]')).toContainText('8 / 24');
  await expect(page.locator('app-pattern-scores tbody tr')).toHaveCount(4);
  expect((await page.locator('app-pattern-scores tbody .badge').allTextContents()).every(x => x === 'Chờ xử lý')).toBe(true);
  await page.keyboard.press('Space');
  await expect(page.locator('app-pattern-scores [role="status"]')).toContainText('24 / 24');
  await button(page, 'Source thực tế').click();
  await expect(page.locator('.source-file')).not.toHaveCount(0);
  await page.locator('.source-file summary').filter({ hasText: 'scores.component.ts' }).click();
  await expect(page.locator('.source-file pre:visible')).toContainText('export class ScoresComponent');
  await button(page, 'Xem trước').click();
  await expect(page.locator('app-pattern-scores [role="status"]')).toContainText('24 / 24');
});
test('listing AND search/filter, detail, error retry and queue drill-down', async ({ page }) => {
  await open(page, 'compositions', 'listing');
  await page.locator('app-pattern-scorecards button').filter({ hasText: 'Chờ xử lý' }).click();
  await page.getByRole('searchbox').fill('an phat');
  await page.getByRole('combobox', { name: /^Khu vực/ }).selectOption('Miền Bắc');
  await expect(page.locator('app-pattern-compositions > [role="status"]').first()).toContainText('1 kết quả phù hợp');
  await page.locator('app-pattern-results button.record-link').filter({ hasText: 'DH-1001' }).click();
  await expect(page.getByRole('heading', { name: 'DH-1001 · An Phát' })).toBeVisible();
  await button(page, 'Đóng').last().click();
  await expect(page.getByRole('searchbox')).toHaveValue('an phat');
  await page.getByLabel('Trạng thái demo').selectOption('error');
  await button(page, 'Thử lại').click();
  await expect(page.getByRole('searchbox')).toHaveValue('an phat');
  await button(page, 'Xóa bộ lọc').click();
  await button(page, 'Hàng đợi').click();
  await button(page, 'Đưa vào xử lý').first().click();
  await expect(page.getByRole('status').filter({ hasText: 'Đã cập nhật 1 đơn hàng.' })).toBeVisible();
  await button(page, 'Tổng quan').click();
  await button(page, 'Chờ xử lý · 7 đơn →').click();
  await expect(page.locator('app-pattern-compositions > [role="status"]').first()).toContainText('7 kết quả phù hợp');
});
test('drawer validates, guards dirty close, preserves failures and updates detail', async ({ page }) => {
  await open(page, 'drawers', 'create');
  await button(page, 'Tạo liên hệ').click();
  const editor = page.locator('app-pattern-form-editor');
  await expect(editor.getByRole('textbox', { name: 'Họ và tên', exact: true })).toBeVisible();
  // Core SdButton intentionally throttles repeat clicks for 300 ms.
  const save = () => page.getByRole('dialog').getByRole('button', { name: 'Tạo liên hệ', exact: true }).click({ delay: 350 });
  await save();
  await expect(editor.getByRole('status')).toContainText('Kiểm tra');
  await page.getByRole('textbox', { name: 'Họ và tên', exact: true }).fill('Liên hệ mới');
  await page.keyboard.press('Escape');
  await expect(page.getByText('Thông tin chưa được lưu', { exact: true })).toBeVisible();
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('invalid-email');
  await save();
  await expect(editor.getByRole('status')).toContainText('Kiểm tra');
  await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('new@example.test');
  await page.getByRole('checkbox', { name: 'Mô phỏng lỗi lưu' }).check();
  await save();
  await expect(editor.getByRole('status')).toContainText('Không thể lưu');
  await expect(page.getByRole('textbox', { name: 'Họ và tên', exact: true })).toHaveValue('Liên hệ mới');
  await page.getByRole('checkbox', { name: 'Mô phỏng lỗi lưu' }).uncheck();
  await save();
  await expect(page.getByRole('status').filter({ hasText: 'Đã lưu liên hệ Liên hệ mới.' })).toBeVisible();
  await expect(page.locator('app-pattern-drawers app-pattern-contact-facts').first()).toContainText('Liên hệ mới');
});

test('pristine create/update drawers close without a discard dialog and restore focus', async ({ page }) => {
  for (const variant of ['create', 'update']) {
    await open(page, 'drawers', variant);
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
  await open(page, 'tables', 'selection');
  const table = page.locator('app-pattern-results');
  await expect(table.locator('button.record-link').first()).toHaveText('DH-1001');
  for (let index = 0; index < 3; index++) {
    await table.locator('.mat-mdc-paginator-navigation-next').click();
    await expect(table.locator('button.record-link').first()).toHaveText('DH-' + (1001 + 6 * (index + 1)));
  }
  await table.getByRole('checkbox').last().check();
  await expect(table.getByRole('checkbox').last()).toBeChecked();
  await table.locator('mat-paginator .mat-mdc-paginator-touch-target').click();
  await page.getByRole('option', { name: '12', exact: true }).click();
  await expect(table.locator('button.record-link').first()).toHaveText('DH-1001');
  await expect(table.locator('button.record-link')).toHaveCount(12);
  await expect(table.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  await table.locator('.mat-mdc-paginator-navigation-next').click();
  await expect(table.locator('button.record-link').first()).toHaveText('DH-1013');
  await table.getByRole('checkbox').last().check();
  await table.getByRole('columnheader', { name: 'Mã đơn', exact: true }).click();
  await expect(table.locator('button.record-link').first()).toHaveText('DH-1001');
  await expect(table.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  await table.getByRole('checkbox').nth(1).check();
  await expect(table.getByRole('checkbox').first()).toHaveJSProperty('indeterminate', true);
  await button(page, 'Duyệt đơn hàng').click();
  await expect(page.getByRole('status').filter({ hasText: 'Đã cập nhật 1 đơn hàng.' })).toBeVisible();
  await expect(table.getByRole('row').filter({ hasText: 'DH-1001' })).toContainText('Đang xử lý');
});

test('clearing an optional region is dirty and saves the cleared value', async ({ page }) => {
  await open(page, 'drawers', 'update');
  await button(page, 'Chỉnh sửa liên hệ').click();
  await page.locator('sd-select[name="region"]').getByRole('button', { name: 'Xóa', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByText('Thông tin chưa được lưu', { exact: true })).toBeVisible();
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await button(page, 'Lưu thay đổi').click();
  await expect(page.locator('app-pattern-form-editor')).toHaveCount(0);
  await expect(page.locator('app-pattern-contact-facts dd').nth(3)).toHaveText('Chưa cung cấp');
});
test('form lines compute totals and route guard protects drafts', async ({ page }) => {
  await open(page, 'forms', 'lines');
  await page.getByRole('textbox', { name: 'Tên đơn hàng', exact: true }).fill('Đơn kiểm tra');
  await page.getByRole('textbox', { name: 'Sản phẩm', exact: false }).fill('Máy in');
  await page.getByRole('spinbutton', { name: 'Số lượng', exact: false }).fill('3');
  await page.getByRole('spinbutton', { name: 'Đơn giá', exact: false }).fill('25000');
  await expect(page.locator('app-pattern-form-editor')).toContainText('75.000 ₫');
  await page.locator('.variants a').filter({ hasText: 'Một cột ngắn' }).click();
  await expect(page.getByText('Thông tin chưa được lưu', { exact: true })).toBeVisible();
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await expect(page).toHaveURL(/\/forms\/lines$/);
  await button(page, 'Tạo đơn hàng').click();
  await expect(page.getByRole('status').filter({ hasText: 'Đã lưu dữ liệu mẫu trong phiên.' })).toBeVisible();
  await page.locator('.variants a').filter({ hasText: 'Một cột ngắn' }).click();
  await expect(page).toHaveURL(/\/forms\/simple$/);
});
