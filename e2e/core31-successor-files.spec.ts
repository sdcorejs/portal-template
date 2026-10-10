import { capture } from './core31-successor-capture';
import { expect, test, type Page } from '@playwright/test';

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
});
test.afterEach(({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});
import ExcelJS from 'exceljs';
import fs from 'node:fs/promises';

// Local-only fixtures: no backend, credentials, remote upload or generator host.
async function workbook(rows: unknown[][]): Promise<Buffer> {
  const book = new ExcelJS.Workbook();
  const sheet = book.addWorksheet('assets');
  sheet.addRow(['code', 'name', 'quantity', 'site']);
  sheet.addRow(['Asset code', 'Asset name', 'Quantity', 'Site']);
  rows.forEach(row => sheet.addRow(row));
  return Buffer.from(await book.xlsx.writeBuffer());
}

async function chooseWorkbook(page: Page, buffer: Buffer, first: boolean) {
  const chooser = page.waitForEvent('filechooser');
  const choose = first
    ? page.locator('.sd-import-workspace [data-import-action="choose"] button')
    : page.locator('.sd-import-workspace .sd-import-file sd-button button');
  await choose.click();
  await (
    await chooser
  ).setFiles({ name: 'harbor-assets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer });
}

async function noPageOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

test('successor import excel validates a native local workbook and accepts only corrected assets', async ({ page }) => {
  await page.goto('/component/import-excel');
  await expect(page.locator('sd-layout')).toBeVisible();
  await expect(page.getByTestId('import-excel-demo')).toBeVisible();
  const open = page.getByTestId('import-open').getByRole('button');
  await open.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.sd-import-workspace [data-import-action="choose"]')).toBeVisible();
  await chooseWorkbook(
    page,
    await workbook([
      ['AST-201', 'Harbor scanner', 4, 'HARBOR'],
      ['AST-202', 'Receiving tablet', -1, 'HARBOR'],
    ]),
    true
  );
  await expect(page.locator('[data-import-filter="ERROR"]')).toContainText('1');
  const accept = page.locator('.sd-import-workspace [data-import-action="accept"]').getByRole('button');
  await expect(accept).toBeDisabled();
  await chooseWorkbook(
    page,
    await workbook([
      ['AST-201', 'Harbor scanner', 4, 'HARBOR'],
      ['AST-202', 'Receiving tablet', 26, 'HARBOR'],
    ]),
    false
  );
  await expect(page.locator('[data-import-filter="ERROR"]')).toContainText('0');
  await expect(page.locator('[data-import-filter="WARNING"]')).toContainText('1');
  await expect(accept).toBeEnabled();
  await capture(page, 'import-excel-preview-desktop');
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await noPageOverflow(page);
    await capture(page, 'import-excel-preview-' + width);
  }
  await accept.click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByTestId('import-accepted-count')).toHaveAttribute('data-count', '2');
  await expect(page.getByTestId('import-accepted-records')).toContainText('AST-202');
  await page.setViewportSize({ width: 320, height: 900 });
  await noPageOverflow(page);
});

test('successor image editor retries source failure and exports native crop rotation and history', async ({ page }, info) => {
  await page.goto('/component/image-editor');
  await expect(page.locator('sd-layout')).toBeVisible();
  await expect(page.getByTestId('image-editor-demo')).toBeVisible();
  await expect(page.getByTestId('image-export').getByRole('button')).toBeDisabled();
  await page.getByTestId('image-invalid').getByRole('button').click();
  await expect(page.locator('[data-autoid="components-image-editor-successor-image-error"]')).toBeVisible();
  await page.getByTestId('image-load').getByRole('button').click();
  await expect(page.getByTestId('image-status')).toHaveAttribute('data-status', 'ready');
  const nativeButton = (suffix: string) =>
    page.locator(`[data-autoid="components-image-editor-successor-image-${suffix}"]`).getByRole('button');
  await nativeButton('rotate-right').click();
  await nativeButton('undo').click();
  await nativeButton('redo').click();
  await expect(page.getByTestId('image-edits')).toContainText('"rotate": 90');
  for (const field of ['width', 'height']) {
    const input = page.locator(`[data-autoid="components-image-editor-successor-image-crop-${field}"] input`);
    await input.fill('300');
    await input.press('Enter');
  }
  await page.getByTestId('image-export').getByRole('button').click();
  await expect(page.getByTestId('image-result')).toHaveAttribute('data-width', '300');
  await expect(page.getByTestId('image-result')).toHaveAttribute('data-height', '300');
  await expect(page.getByTestId('image-result-preview')).toBeVisible();
  await page.getByTestId('image-result-preview').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('image-result-preview')).toBeInViewport();
  await capture(page, 'image-result-desktop');
  const downloadEvent = page.waitForEvent('download');
  await page.getByTestId('image-download').getByRole('button').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('harbor-asset.png');
  const file = info.outputPath('harbor-asset.png');
  await download.saveAs(file);
  const bytes = await fs.readFile(file);
  expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  await page.setViewportSize({ width: 390, height: 900 });
  await noPageOverflow(page);
  await page.getByTestId('image-result-preview').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('image-result-preview')).toBeInViewport();
  await capture(page, 'image-result-390');
  await page.setViewportSize({ width: 320, height: 900 });
  await noPageOverflow(page);
  await page.getByTestId('image-result-preview').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('image-result-preview')).toBeInViewport();
  await capture(page, 'image-result-320');
});

test('successor autoid inspector audits only its fixture and exports local diagnostics', async ({ page }, info) => {
  const outgoing: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST') outgoing.push(request.url());
  });
  await page.goto('/component/autoid-inspector');
  await expect(page.locator('sd-layout')).toBeVisible();
  await expect(page.getByTestId('autoid-inspector-demo')).toBeVisible();
  await page.getByTestId('autoid-broken').getByRole('button').click();
  await page.getByTestId('autoid-scan').getByRole('button').click();
  await expect(page.getByTestId('autoid-audit')).toHaveAttribute('data-duplicate-count', '1');
  await expect(page.getByTestId('autoid-audit')).toHaveAttribute('data-missing-count', '1');
  await page.getByTestId('autoid-highlight').getByRole('button').click();
  await expect(page.getByTestId('autoid-highlight')).toHaveAttribute('data-active', 'true');
  const downloadEvent = page.waitForEvent('download');
  await page.getByTestId('autoid-export').getByRole('button').click();
  const download = await downloadEvent;
  const file = info.outputPath('autoid-audit.json');
  await download.saveAs(file);
  const audit = JSON.parse(await fs.readFile(file, 'utf8'));
  expect(JSON.stringify(audit)).toContain('asset-code');
  expect(JSON.stringify(audit)).not.toContain('import-open');
  await expect(page.getByTestId('autoid-local-only')).toBeVisible();
  await page.getByTestId('autoid-clean').getByRole('button').click();
  await page.getByTestId('autoid-scan').getByRole('button').click();
  await expect(page.getByTestId('autoid-audit')).toHaveAttribute('data-duplicate-count', '0');
  await expect(page.getByTestId('autoid-audit')).toHaveAttribute('data-missing-count', '0');
  await page.setViewportSize({ width: 320, height: 900 });
  await noPageOverflow(page);
  expect(outgoing).toEqual([]);
});

test('successor import excel keeps local assets across locale changes and handles empty and read-only states', async ({ page }) => {
  await page.goto('/component/import-excel');
  await expect(page.locator('sd-layout')).toBeVisible();
  await expect(page.getByTestId('import-excel-demo')).toBeVisible();
  await page.getByTestId('lab-en').getByRole('button').click();
  await expect(page.getByText('Import Excel · Harbor assets', { exact: true })).toBeVisible();
  await page.getByTestId('import-open').getByRole('button').click();
  await chooseWorkbook(page, await workbook([]), true);
  await expect(page.getByText('File has no data', { exact: true })).toBeVisible();
  await expect(page.locator('.sd-import-workspace [data-import-action="choose"]')).toBeVisible();
  await chooseWorkbook(page, await workbook([['AST-203', 'Dock terminal', 2, 'RIDGE']]), true);
  await expect(page.locator('[data-import-filter="SUCCESS"]')).toContainText('1');
  await page.locator('.sd-import-workspace [data-import-action="accept"]').getByRole('button').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByTestId('import-accepted-count')).toHaveAttribute('data-count', '1');
  await page.getByTestId('lab-vi').getByRole('button').click();
  await expect(page.getByText('Nhập Excel · Tài sản Harbor', { exact: true })).toBeVisible();
  await expect(page.getByTestId('import-accepted-records')).toContainText('AST-203');
  await capture(page, 'import-excel-desktop');
  await page.getByTestId('import-readonly').getByRole('button').click();
  await expect(page.getByTestId('import-open').getByRole('button')).toBeDisabled();
  await page.getByTestId('lab-reset').getByRole('button').click();
  await expect(page.getByTestId('import-open').getByRole('button')).toBeEnabled();
  await expect(page.getByTestId('import-accepted-count')).toHaveAttribute('data-count', '0');
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await noPageOverflow(page);
    await capture(page, `import-excel-${width}`);
  }
});

test('successor image editor preserves native edits across languages and honors export lock and reset', async ({ page }) => {
  await page.goto('/component/image-editor');
  await expect(page.locator('sd-layout')).toBeVisible();
  await expect(page.getByTestId('image-editor-demo')).toBeVisible();
  await page.getByTestId('image-load').getByRole('button').click();
  await expect(page.getByTestId('image-status')).toHaveAttribute('data-status', 'ready');
  await page.locator('[data-autoid="components-image-editor-successor-image-rotate-right"]').getByRole('button').click();
  await page.getByTestId('lab-en').getByRole('button').click();
  await expect(page.getByText('Image editor · Harbor asset', { exact: true })).toBeVisible();
  await expect(page.getByTestId('image-edits')).toContainText('"rotate": 90');
  await page.getByTestId('image-lock').getByRole('button').click();
  await expect(page.getByTestId('image-export').getByRole('button')).toBeDisabled();
  await expect(page.locator('[data-autoid="components-image-editor-successor-image-rotate-left"]').getByRole('button')).toBeEnabled();
  // Native SdButton intentionally throttles repeated clicks for 300ms.
  await page.waitForTimeout(350);
  await page.getByTestId('image-lock').getByRole('button').click();
  await expect(page.getByTestId('image-export').getByRole('button')).toBeEnabled();
  await capture(page, 'image-editor-desktop');
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await noPageOverflow(page);
    await capture(page, `image-editor-${width}`);
  }
  await page.getByTestId('lab-reset').getByRole('button').click();
  await expect(page.getByTestId('image-status')).toHaveAttribute('data-status', 'empty');
  await expect(page.getByTestId('image-result')).toHaveCount(0);
  await expect(page.getByTestId('image-export').getByRole('button')).toBeDisabled();
  await expect(page.locator('[data-autoid="components-image-editor-successor-image-rotate-right"]').getByRole('button')).toBeDisabled();
});

test('successor autoid inspector supports locale empty disable keyboard and native local panel', async ({ page }) => {
  await page.goto('/component/autoid-inspector');
  await expect(page.locator('sd-layout')).toBeVisible();
  await expect(page.getByTestId('autoid-inspector-demo')).toBeVisible();
  await page.getByTestId('lab-en').getByRole('button').click();
  await expect(page.getByText('AutoId inspector · Harbor assets', { exact: true })).toBeVisible();
  const scan = page.getByTestId('autoid-scan').getByRole('button');
  await scan.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('autoid-audit')).toContainText('3 elements');
  await page.getByTestId('autoid-disable').getByRole('button').click();
  await expect(scan).toBeDisabled();
  await expect(page.getByTestId('autoid-export').getByRole('button')).toBeDisabled();
  // Honor the native SdButton 300ms repeat-click contract.
  await page.waitForTimeout(350);
  await page.getByTestId('autoid-disable').getByRole('button').click();
  await page.getByTestId('autoid-empty').getByRole('button').click();
  await scan.click();
  await expect(page.getByTestId('autoid-audit')).toContainText('0 elements');
  await expect(page.getByTestId('autoid-export').getByRole('button')).toBeDisabled();
  await page.getByTestId('lab-reset').getByRole('button').click();
  await page.waitForTimeout(350);
  await scan.click();
  await page.getByTestId('autoid-native').getByRole('button').click();
  const panel = page.locator('[data-autoid="sd-autoid-inspector-panel"]');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-missing-count', '0');
  await expect(panel).toHaveAttribute('data-duplicate-count', '0');
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await capture(page, 'autoid-inspector-desktop');
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await noPageOverflow(page);
    await capture(page, `autoid-inspector-${width}`);
  }
});

test('successor image editor occupies a bounded region above apply controls and result cards', async ({ page }) => {
  await page.goto('/component/image-editor');
  await expect(page.locator('sd-layout')).toBeVisible();
  await page.getByTestId('image-load').getByRole('button').click();
  await expect(page.getByTestId('image-status')).toHaveAttribute('data-status', 'ready');
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const editor = await page.locator('sd-image-editor').boundingBox();
    const apply = await page.getByTestId('image-export').boundingBox();
    const card = await page.locator('.image-workspace > section').boundingBox();
    const next = await page.locator('.image-workspace > .lab-grid').boundingBox();
    expect(editor).not.toBeNull();
    expect(apply).not.toBeNull();
    expect(card).not.toBeNull();
    expect(next).not.toBeNull();
    expect(apply!.y, 'apply control follows the full native editor').toBeGreaterThanOrEqual(editor!.y + editor!.height);
    expect(card!.y + card!.height, 'card encloses native editor and apply control').toBeGreaterThanOrEqual(apply!.y + apply!.height);
    expect(next!.y, 'result cards follow editor card without overlap').toBeGreaterThanOrEqual(card!.y + card!.height);
    await page.getByTestId('image-export').getByRole('button').click({ trial: true });
    await noPageOverflow(page);
  }
});
