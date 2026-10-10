import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs/promises';

const errors = new Map<Page, string[]>();
const artifactRevision = process.env['CORE31_ARTIFACT_REVISION'] ?? 'r3';
const selectorCaptureDir = `../core31-${artifactRevision}-selector-captures`;
async function verifyLocalFonts(page: Page) {
  const fonts = await page.evaluate(async () => {
    const specs = [
      '400 14px Roboto',
      'italic 400 14px Roboto',
      '500 14px Roboto',
      '600 14px Roboto',
      '400 24px "Material Icons"',
      '400 24px "Material Icons Outlined"',
      '400 24px "Material Symbols Outlined"',
    ];
    await document.fonts.ready;
    const loaded = await Promise.all(specs.map(spec => document.fonts.load(spec, 'ABC Đề nghị search')));
    return specs.map((spec, index) => ({
      spec,
      available: document.fonts.check(spec, 'ABC Đề nghị search'),
      faces: loaded[index].map(font => ({ family: font.family, status: font.status })),
    }));
  });
  expect(fonts).toHaveLength(7);
  for (const font of fonts) {
    expect(font.available, font.spec).toBe(true);
    expect(font.faces.length, font.spec).toBeGreaterThan(0);
    expect(
      font.faces.every(face => face.status === 'loaded'),
      font.spec
    ).toBe(true);
  }
  return fonts;
}
async function capture(page: Page, name: string) {
  if (process.env['CORE31_ACCEPTANCE_CAPTURE'] !== '1') return;
  await verifyLocalFonts(page);
  const failedFonts = await page.evaluate(() => [...document.fonts].filter(font => font.status === 'error').map(font => font.family));
  expect(failedFonts, 'Loaded local fonts must decode before acceptance captures').toEqual([]);
  await page.screenshot({ path: `docs/screenshots/core31-${artifactRevision}-${name}.png`, fullPage: true, animations: 'disabled' });
}
test.beforeEach(({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') messages.push(message.text());
  });
});
test.afterEach(async ({ page }, info) => {
  if (info.status !== info.expectedStatus && page.url().includes('/utility/form-navigation')) {
    // Optional Angular debug bridge is used only for read-only diagnostics, never application behavior.
    const diagnostic = await page.evaluate(() => {
      const root = document.querySelector('app-form-navigation-demo');
      const bridge = Reflect.get(window, 'ng');
      const component = root && bridge?.getComponent?.(root);
      const form = component?.form;
      return {
        debugBridgeAvailable: !!component,
        form: form
          ? {
              status: form.status,
              value: form.value,
              controls: Object.fromEntries(
                Object.entries(form.controls).map(([key, control]) => [
                  key,
                  {
                    value: Reflect.get(control as object, 'value'),
                    status: Reflect.get(control as object, 'status'),
                    errors: Reflect.get(control as object, 'errors'),
                  },
                ])
              ),
            }
          : null,
        fields: Array.from(
          document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            '[data-testid="candidate-live-render"] input,[data-testid="candidate-live-render"] textarea'
          )
        ).map(el => ({
          id: el.id,
          value: el.type === 'checkbox' ? (el as HTMLInputElement).checked : el.value,
          invalid: el.getAttribute('aria-invalid'),
          page: el.closest('[data-page-id]')?.getAttribute('data-page-id'),
          hiddenPage: !!el.closest('[hidden]'),
        })),
      };
    });
    await info.attach('form-membership.json', { body: JSON.stringify(diagnostic, null, 2), contentType: 'application/json' });
    const name = info.title.includes('linear') ? 'linear' : 'visibility';
    await fs.writeFile(`docs/core31-${artifactRevision}-form-${name}-diagnostic.json`, JSON.stringify(diagnostic, null, 2) + '\n');
    await page.screenshot({
      path: `docs/screenshots/core31-${artifactRevision}-form-${name}-blocker.png`,
      fullPage: true,
      animations: 'disabled',
    });
  }
  expect(errors.get(page)).toEqual([]);
  errors.delete(page);
});
const explorer = (page: Page) => page.locator('sd-file-explorer');
const liveForm = (page: Page) => page.getByTestId('candidate-live-render');
async function chooseNavigation(page: Page, name: string) {
  const control = page.getByRole('combobox', { name: 'Điều hướng', exact: true });
  await control.click();
  await page.getByRole('option', { name, exact: true }).click();
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.cdk-overlay-pane:has([role="listbox"])')).toHaveCount(0);
  await page.getByRole('button', { name: 'Áp dụng schema', exact: true }).click();
}
async function selectBrief(page: Page) {
  await explorer(page)
    .getByRole('checkbox', { name: /Brief-Nova\.txt/ })
    .check();
}
async function openFolder(page: Page, name: string) {
  const row = explorer(page)
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name, exact: true }) });
  await expect(row).toBeVisible();
  await row.press('Enter');
}
async function acceptMove(page: Page) {
  await page
    .getByRole('dialog', { name: 'Di chuyển tài liệu', exact: true })
    .getByRole('button', { name: 'Di chuyển', exact: true })
    .click();
}
async function insideViewport(page: Page, selector: string) {
  const bounds = await page.locator(selector).evaluate(el => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, scroll: el.scrollWidth, width: el.clientWidth, viewport: innerWidth };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(-1);
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewport + 1);
  expect(bounds.scroll).toBeLessThanOrEqual(bounds.width + 1);
}

test('candidate local font assets all decode before visual QA', async ({ page }, info) => {
  await page.goto('/utility/form-navigation');
  await expect(liveForm(page).locator('sd-form-render')).toBeVisible();
  const fonts = await verifyLocalFonts(page);
  await info.attach('local-fonts.json', { body: JSON.stringify(fonts, null, 2), contentType: 'application/json' });
  await fs.writeFile(`docs/core31-${artifactRevision}-font-load.json`, JSON.stringify(fonts, null, 2) + '\n');
});

test('Explorer typed columns, eligibility, selection/confirm and itemLeft projection', async ({ page }) => {
  await page.goto('/utility/explorer-candidate');
  const table = explorer(page).getByRole('table');
  await expect(table.getByRole('columnheader', { name: 'Người phụ trách', exact: true })).toBeVisible();
  const brief = table.getByRole('row').filter({ hasText: 'Brief-Nova.txt' });
  await expect(brief).toContainText('Linh (demo)');
  await expect(explorer(page).getByRole('checkbox', { name: /Locked-notes\.txt/ })).toBeDisabled();
  await expect(explorer(page).getByRole('group', { name: 'Lựa chọn tệp', exact: true })).toHaveCount(0);
  await selectBrief(page);
  const band = explorer(page).getByRole('group', { name: 'Lựa chọn tệp', exact: true });
  await expect(band).toBeVisible();
  await expect(band.getByRole('button', { name: 'Đánh dấu đã xem', exact: true })).toBeVisible();
  await expect(band.getByRole('button', { name: 'Chuyển vào Lưu trữ', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Đánh dấu đã xem', exact: true }).click();
  await page.getByRole('dialog', { name: 'Xem tài liệu', exact: true }).getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(brief).toContainText('Chưa xem');
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'Đánh dấu đã xem', exact: true }).click();
  await page.getByRole('dialog', { name: 'Xem tài liệu', exact: true }).getByRole('button', { name: 'Đánh dấu', exact: true }).click();
  await expect(brief).toContainText('Đã xem');
  await brief.getByRole('button', { name: 'Thao tác với Brief-Nova.txt', exact: true }).click();
  await page.getByRole('button', { name: 'Thông tin metadata', exact: true }).click();
  await expect(page.getByTestId('candidate-metadata')).toContainText('Người phụ trách');
  await page.getByRole('switch', { name: 'Hiện nhãn metadata tùy chỉnh', exact: true }).click();
  await expect(page.getByTestId('candidate-metadata')).not.toContainText('Người phụ trách');
  await expect(page.getByTestId('candidate-metadata')).not.toContainText('Nhãn dự phòng');
  // Row commands can scroll the horizontal metadata grid. Restore the name column for the evidence frame.
  await table.getByRole('columnheader', { name: 'Tên', exact: true }).scrollIntoViewIfNeeded();
  await capture(page, 'explorer-desktop');
});

test('Explorer native move picker preserves metadata and consumer cancellation leaves storage intact', async ({ page }) => {
  await page.goto('/utility/explorer-candidate');
  // Explicit selector.actions are caller-owned; the deliberate native picker remains on each row.
  const row = explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' });
  await row.getByRole('button', { name: 'Di chuyển đến…', exact: true }).click();
  const picker = explorer(page).getByRole('dialog');
  await picker.getByRole('treeitem', { name: 'Lưu trữ', exact: true }).click();
  await capture(page, 'move-picker-desktop');
  await picker.getByRole('button', { name: /Di chuyển|Chuyển/ }).click();
  await page.getByRole('dialog', { name: 'Di chuyển tài liệu', exact: true }).getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Di chuyển tài liệu', exact: true })).toBeHidden();
  await expect(page.getByTestId('candidate-move-counters')).toHaveText('0 lần thử · 0 mutation đã lưu');
  await expect(picker).toBeVisible();
  await picker.getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(picker).toBeHidden();
  await selectBrief(page);
  await page.getByRole('button', { name: 'Chuyển vào Lưu trữ', exact: true }).click();
  await acceptMove(page);
  await expect(page.getByTestId('candidate-move-counters')).toHaveText('1 lần thử · 1 mutation đã lưu');
  await expect(explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' })).toHaveCount(0);
  await openFolder(page, 'Lưu trữ');
  await expect(explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' })).toContainText('Linh (demo)');
});

test('Explorer failed mutation retries safely and accepted move refresh does not replay mutation', async ({ page }) => {
  await page.goto('/utility/explorer-candidate');
  await page.getByRole('switch', { name: 'Giả lập lỗi di chuyển lần tới', exact: true }).click();
  await selectBrief(page);
  await page.getByRole('button', { name: 'Chuyển vào Lưu trữ', exact: true }).click();
  await acceptMove(page);
  await expect(page.getByTestId('candidate-move-counters')).toHaveText('1 lần thử · 0 mutation đã lưu');
  await expect(explorer(page)).toContainText('Giả lập lỗi di chuyển');
  await page.getByRole('switch', { name: 'Lỗi refresh sau khi đã di chuyển', exact: true }).click();
  await page.getByRole('button', { name: 'Chuyển vào Lưu trữ', exact: true }).click();
  await acceptMove(page);
  await expect(page.getByTestId('candidate-move-counters')).toHaveText('2 lần thử · 1 mutation đã lưu');
  await page.getByRole('button', { name: 'Khôi phục đọc danh sách', exact: true }).click();
  await expect(page.getByTestId('candidate-move-counters')).toHaveText('2 lần thử · 1 mutation đã lưu');
  await expect(explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' })).toHaveCount(0);
});

test('Explorer local upload/search, read failure and empty folder are recoverable', async ({ page }) => {
  await page.goto('/utility/explorer-candidate');
  await explorer(page)
    .locator('input[type="file"]')
    .setInputFiles({ name: 'local-demo.txt', mimeType: 'text/plain', buffer: Buffer.from('Fictional local demo') });
  await expect(explorer(page).getByRole('row').filter({ hasText: 'local-demo.txt' })).toContainText('Bạn (demo)');
  await explorer(page).getByRole('searchbox').fill('local-demo');
  await expect(explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' })).toHaveCount(0);
  await explorer(page).getByRole('searchbox').fill('');
  await page.getByRole('button', { name: 'Giả lập lỗi đọc', exact: true }).click();
  await expect(explorer(page)).toContainText('Demo chưa đọc được danh sách');
  await page.getByRole('button', { name: 'Khôi phục đọc danh sách', exact: true }).click();
  await expect(explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' })).toBeVisible();
  await openFolder(page, 'Thư mục trống');
  await expect(
    explorer(page)
      .getByRole('row')
      .filter({ hasText: /\.txt|\.json/ })
  ).toHaveCount(0);
});

test('Explorer no-actions config hides all selection affordances and re-enabling restores selection', async ({ page }) => {
  await page.goto('/utility/explorer-candidate');
  const toggle = page.getByRole('switch', { name: 'Hành động khi chọn tệp', exact: true });
  await toggle.click();
  await expect(explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' })).toBeVisible();
  await expect(explorer(page).getByRole('checkbox')).toHaveCount(0);
  await expect(explorer(page).getByRole('group', { name: 'Lựa chọn tệp', exact: true })).toHaveCount(0);
  if (process.env['CORE31_ACCEPTANCE_CAPTURE'] === '1') {
    await verifyLocalFonts(page);
    await fs.mkdir(selectorCaptureDir, { recursive: true });
    await page.screenshot({
      path: `${selectorCaptureDir}/core31-${artifactRevision}-no-actions-hidden-desktop.png`,
      fullPage: true,
      animations: 'disabled',
    });
  }
  await toggle.click();
  await selectBrief(page);
  await expect(explorer(page).getByRole('group', { name: 'Lựa chọn tệp', exact: true })).toBeVisible();
  await expect(page.getByTestId('candidate-selection')).toHaveText('1 tệp đang chọn');
});

test.describe('Explorer touch selector', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('Explorer mobile selection buttons use actual small controls and remain actionable', async ({ page }) => {
    await page.goto('/utility/explorer-candidate');
    await selectBrief(page);
    const band = explorer(page).getByRole('group', { name: 'Lựa chọn tệp', exact: true });
    await expect(band).toBeVisible();
    const buttons = ['Đánh dấu đã xem', 'Chuyển vào Lưu trữ'].map(name => band.getByRole('button', { name, exact: true }));
    const measurements: { height: number; classes: string; declared: string | null | undefined }[] = [];
    for (const button of buttons) {
      await expect(button).toBeVisible();
      const size = await button.evaluate(el => ({
        height: el.getBoundingClientRect().height,
        classes: el.className,
        declared: el.closest('sd-button')?.getAttribute('data-size'),
      }));
      expect(size.classes).toContain('c-sm');
      expect(size.height).toBeGreaterThanOrEqual(28);
      expect(size.height).toBeLessThanOrEqual(36);
      measurements.push(size);
    }
    await band.scrollIntoViewIfNeeded();
    await insideViewport(page, '.demo-page-body');
    if (process.env['CORE31_ACCEPTANCE_CAPTURE'] === '1') {
      await verifyLocalFonts(page);
      await fs.mkdir(selectorCaptureDir, { recursive: true });
      await fs.writeFile(
        `${selectorCaptureDir}/core31-${artifactRevision}-selector-size.json`,
        JSON.stringify(measurements, null, 2) + '\n'
      );
      await page.screenshot({
        path: `${selectorCaptureDir}/core31-${artifactRevision}-selector-sm-mobile.png`,
        fullPage: true,
        animations: 'disabled',
      });
    }
    await band.getByRole('button', { name: 'Đánh dấu đã xem', exact: true }).click();
    await page.getByRole('dialog', { name: 'Xem tài liệu', exact: true }).getByRole('button', { name: 'Hủy', exact: true }).click();
    await expect(explorer(page).getByRole('row').filter({ hasText: 'Brief-Nova.txt' })).toContainText('Chưa xem');
  });
});

test('Form linear navigation gates model jumps and validates unvisited pages', async ({ page }) => {
  await page.goto('/utility/form-navigation');
  await page.getByRole('button', { name: 'Đến Xác nhận qua model', exact: true }).click();
  await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: details');
  const firstStep = liveForm(page).locator('mat-step-header').first();
  await firstStep.focus();
  await page.keyboard.press('ArrowRight');
  await expect(liveForm(page).locator('mat-step-header').nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: details');
  await liveForm(page).getByRole('textbox', { name: 'Tên dự án', exact: true }).fill('Nova');
  await liveForm(page).getByRole('textbox', { name: 'Ngân sách (triệu)', exact: true }).fill('80');
  await page.getByRole('button', { name: 'Kiểm tra toàn bộ trang', exact: true }).click();
  await expect(page.getByTestId('candidate-form-errors')).toBeVisible();
  await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: approval');
  await expect(liveForm(page).getByRole('textbox', { name: 'Người phê duyệt', exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Điền mẫu mọi trang', exact: true }).click();
  await expect(liveForm(page).getByRole('textbox', { name: 'Người phê duyệt', exact: true })).toHaveValue('Linh (demo)');
  // Exercise native input followed by an external model jump, the r2 regression boundary.
  await liveForm(page).getByRole('textbox', { name: 'Người phê duyệt', exact: true }).fill('Mai (demo)');
  await page.getByRole('button', { name: 'Đến Xác nhận qua model', exact: true }).click();
  await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: review');
  await page.getByRole('button', { name: 'Gửi demo', exact: true }).click();
  await expect(page.getByTestId('candidate-submitted')).toContainText('Nova workspace');
  await expect(page.getByTestId('candidate-submitted')).toContainText('Mai (demo)');
  await capture(page, 'steps-desktop');
});

test('Form tabs use manual keyboard activation and hidden legal page keeps values without blocking validation', async ({ page }) => {
  await page.goto('/utility/form-navigation');
  await chooseNavigation(page, 'Tabs');
  const form = liveForm(page),
    info = form.getByRole('tab', { name: 'Thông tin', exact: true });
  await info.focus();
  await page.keyboard.press('ArrowRight');
  await expect(form.getByRole('tab', { name: 'Phê duyệt', exact: true })).toBeFocused();
  await expect(info).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: approval');
  await page.getByRole('button', { name: 'Điền mẫu mọi trang', exact: true }).click();
  await info.click();
  await form.getByRole('checkbox', { name: 'Cần rà soát pháp lý', exact: true }).check();
  await form.getByRole('tab', { name: 'Pháp lý', exact: true }).click();
  await expect(form.getByRole('textbox', { name: 'Kết quả rà soát', exact: true })).toHaveValue('Đã rà soát bản mẫu hư cấu.');
  await form.getByRole('textbox', { name: 'Kết quả rà soát', exact: true }).fill('');
  await info.click();
  await form.getByRole('checkbox', { name: 'Cần rà soát pháp lý', exact: true }).uncheck();
  await expect(form.getByRole('tab', { name: 'Pháp lý', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Kiểm tra toàn bộ trang', exact: true }).click();
  await expect(page.getByTestId('candidate-form-errors')).toHaveCount(0);
  await form.getByRole('checkbox', { name: 'Cần rà soát pháp lý', exact: true }).check();
  await expect(form.getByRole('tab', { name: 'Pháp lý', exact: true })).toBeVisible();
  // SdButton intentionally suppresses repeat activation for 300 ms.
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'Kiểm tra toàn bộ trang', exact: true }).click();
  await expect(page.getByTestId('candidate-form-errors')).toBeVisible();
  const legalField = form.getByRole('textbox', { name: 'Kết quả rà soát', exact: true });
  await expect(legalField).toHaveAttribute('aria-invalid', 'true');
  await legalField.fill('Đã xác nhận lại trong phiên demo.');
  await info.click();
  await form.getByRole('checkbox', { name: 'Cần rà soát pháp lý', exact: true }).uncheck();
  await form.getByRole('checkbox', { name: 'Cần rà soát pháp lý', exact: true }).check();
  await form.getByRole('tab', { name: 'Pháp lý', exact: true }).click();
  await expect(legalField).toHaveValue('Đã xác nhận lại trong phiên demo.');
  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'Kiểm tra toàn bộ trang', exact: true }).click();
  await expect(page.getByTestId('candidate-form-errors')).toHaveCount(0);
  await capture(page, 'tabs-desktop');
});

test('Form Builder edit hands off the same schema and submit retry/view mode preserve the draft', async ({ page }, info) => {
  await page.goto('/utility/form-navigation');
  await page.getByRole('button', { name: 'Mở Form Builder', exact: true }).click();
  const builder = page.locator('sd-form-builder');
  await expect(builder).toBeVisible();
  await expect(builder.locator('[data-builder-page]')).toHaveCount(4);
  await builder.locator('[data-page-action="add"]').click();
  await expect(builder.locator('[data-builder-page]')).toHaveCount(5);
  const newPageId = await builder.locator('[data-builder-page]').last().getAttribute('data-builder-page');
  await builder.locator('[data-builder-page]').last().focus();
  await page.keyboard.press('Control+z');
  await expect(builder.locator('[data-builder-page]')).toHaveCount(4);
  await builder.locator('[data-builder-page]').first().focus();
  await page.keyboard.press('Control+Shift+z');
  await expect(builder.locator('[data-builder-page]')).toHaveCount(5);
  await builder.locator(`[data-builder-page="${newPageId}"]`).click();
  await builder.locator('[data-page-action="up"]').click();
  await builder.locator('[data-builder-page]').first().click();
  await capture(page, 'builder-desktop');
  // Copy the schema emitted by real page CRUD to Render, including its extra page.
  await chooseNavigation(page, 'Tabs');
  await expect(page.getByTestId('candidate-schema-state')).toContainText('Builder và Render dùng cùng schema');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất schema đang áp dụng', exact: true }).click();
  const download = await downloadEvent,
    destination = info.outputPath('schema.json');
  await download.saveAs(destination);
  const schema = JSON.parse(await fs.readFile(destination, 'utf8'));
  expect(schema.navigation).toEqual({ type: 'tabs' });
  expect(schema.pages).toHaveLength(5);
  expect(schema.pages[3].id).toBe(newPageId);
  await page.getByRole('button', { name: 'Điền mẫu mọi trang', exact: true }).click();
  await page.getByRole('switch', { name: 'Giả lập lỗi gửi lần tới', exact: true }).click();
  await page.getByRole('button', { name: 'Gửi demo', exact: true }).click();
  await expect(page.getByTestId('candidate-form-errors')).toContainText('Giả lập lỗi gửi');
  await page.getByRole('button', { name: 'Gửi demo', exact: true }).click();
  await expect(page.getByTestId('candidate-submitted')).toContainText('Nova workspace');
  await page.getByRole('switch', { name: 'Chỉ xem dữ liệu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Gửi demo', exact: true })).toBeDisabled();
});

test('candidate Explorer and Form stay inside mobile shell and consumer confirm fits', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/utility/explorer-candidate');
  await insideViewport(page, '.demo-page-body');
  await selectBrief(page);
  await page.getByRole('button', { name: 'Chuyển vào Lưu trữ', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Di chuyển tài liệu', exact: true })).toBeVisible();
  await capture(page, 'explorer-mobile');
  await page.getByRole('dialog', { name: 'Di chuyển tài liệu', exact: true }).getByRole('button', { name: 'Hủy', exact: true }).click();
  await page.goto('/utility/form-navigation');
  await insideViewport(page, '.demo-page-body');
  await chooseNavigation(page, 'Tabs');
  await expect(liveForm(page).getByRole('tab', { name: 'Thông tin', exact: true })).toBeVisible();
  await liveForm(page).scrollIntoViewIfNeeded();
  await capture(page, 'form-mobile');
});

test.describe('Form responsive touch consumer', () => {
  test.use({ hasTouch: true, isMobile: true });
  test('Form mobile native navigation retains values, reports warnings and uses medium controls', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/utility/form-navigation');
    await insideViewport(page, '.demo-page-body');
    await page.getByRole('button', { name: 'Điền mẫu mọi trang', exact: true }).click();
    await page.getByRole('button', { name: 'Đến Xác nhận qua model', exact: true }).click();
    await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: review');
    await expect(liveForm(page).locator('sd-stepper')).toBeVisible();
    await page.getByRole('button', { name: 'Kiểm tra toàn bộ trang', exact: true }).click();
    await expect(page.getByTestId('candidate-form-errors')).toHaveCount(0);
    await expect(page.locator('sd-inform[warning]')).toBeVisible();
    await liveForm(page).scrollIntoViewIfNeeded();
    await capture(page, 'form-touch-390');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: review');
    await liveForm(page).locator('mat-step-header').first().click();
    await expect(liveForm(page).getByRole('textbox', { name: 'Tên dự án', exact: true })).toHaveValue('Nova workspace');
    await page.setViewportSize({ width: 320, height: 844 });
    await chooseNavigation(page, 'Tabs');
    await insideViewport(page, '.demo-page-body');
    await expect(liveForm(page).locator('sd-tab-group')).toBeVisible();
    const reset = page.getByRole('button', { name: 'Khôi phục form demo', exact: true });
    const box = await reset.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40);
    await liveForm(page).scrollIntoViewIfNeeded();
    await capture(page, 'form-touch-320');
  });
});
