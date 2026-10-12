import { expect, test, type Locator, type Page } from '@playwright/test';

async function propertySwitch(page: Page, name: string) {
  const control = page.getByRole('switch', { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
  await expect(control).toBeVisible();
  const geometry = await control.evaluate(element => {
    const row = element.closest('app-demo-property');
    const label = row?.querySelector('.property-label')?.getBoundingClientRect();
    const switchHost = element.closest('sd-switch');
    const bounds = switchHost?.getBoundingClientRect();
    return { labelRight: label?.right, controlLeft: bounds?.left, size: switchHost?.getAttribute('size'), aligned: !!row };
  });
  expect(geometry.aligned).toBe(true);
  await expect(control).toHaveAccessibleName(
    new RegExp(
      (await page.locator('app-demo-property').filter({ has: control }).locator('strong').first().innerText()).replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )
    )
  );
  expect(geometry.size).toBe('sm');
  expect(geometry.controlLeft!).toBeGreaterThan(geometry.labelRight!);
  return control;
}

async function insideViewport(region: Locator) {
  const bounds = await region.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, viewport: innerWidth, width: element.clientWidth, scroll: element.scrollWidth };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(-1);
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewport + 1);
  expect(bounds.scroll).toBeLessThanOrEqual(bounds.width + 1);
}

test('Button owns Outline & Confirm and the old deep link retains all examples', async ({ page }) => {
  await page.goto('/component/button');
  await expect(page.locator('app-button-demo app-button-outline-demo')).toBeVisible();
  await page.getByRole('button', { name: 'Outline & Confirm', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Outline & Confirm', exact: true })).toBeInViewport();
  await page.goto('/component/button/outline');
  await expect(page).toHaveURL(/\/component\/button$/);
  await page.reload();
  await expect(page.locator('app-button-demo app-button-outline-demo')).toBeVisible();
  await expect(page.locator('app-button-demo sd-page')).toHaveCount(1);
});

test('sidebar has one Button entry and one File Explorer component entry', async ({ page }) => {
  await page.goto('/component/button');
  const search = page.getByRole('searchbox', { name: 'Tìm kiếm', exact: true });
  await search.fill('Outline & Confirm');
  await expect(page.getByRole('link', { name: 'Outline & Confirm', exact: true })).toHaveCount(0);
  await search.fill('Button');
  await expect(page.getByRole('link', { name: 'Button', exact: true })).toHaveCount(1);
  await search.fill('File Explorer');
  const link = page.getByRole('link', { name: 'File Explorer', exact: true });
  await expect(link).toHaveCount(1);
  await link.click();
  await expect(page).toHaveURL(/\/component\/file-explorer$/);
  await expect(page.locator('app-file-explorer-demo sd-file-explorer')).toBeVisible();
});

test('legacy Button link retains other query params and fragment', async ({ page }) => {
  await page.goto('/component/button/outline?review=nghia#example');
  await expect(page).toHaveURL(/\/component\/button\?review=nghia#example$/);
  await expect(page.locator('app-button-demo app-button-outline-demo')).toBeVisible();
});

test('tab-router keeps one Button shell tab and demo state across menu navigation, Back and Forward', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('portal-config', JSON.stringify({ useTabRouter: true }));
  });
  await page.goto('/component/button');
  const shellTabs = page.locator('sd-tab-router-outlet');
  await expect(shellTabs).toBeVisible();
  await expect(shellTabs.locator('app-button-demo')).toHaveCount(1);
  await page.getByRole('switch', { name: 'disabled — Khóa các hành động', exact: true }).click();
  const search = page.getByRole('searchbox', { name: 'Tìm kiếm', exact: true });
  await search.fill('File Explorer');
  await page.getByRole('link', { name: 'File Explorer', exact: true }).click();
  await expect(page).toHaveURL(/\/component\/file-explorer$/);
  await expect(shellTabs.locator('app-file-explorer-demo')).toHaveCount(1);
  await page.goBack();
  await expect(page).toHaveURL(/\/component\/button$/);
  await expect(shellTabs.locator('app-button-demo')).toHaveCount(1);
  await expect(page.getByRole('switch', { name: 'disabled — Khóa các hành động', exact: true })).toBeChecked();
  await page.goForward();
  await expect(page).toHaveURL(/\/component\/file-explorer$/);
  await expect(shellTabs.locator('app-button-demo')).toHaveCount(1);
  await page.goBack();
  await expect(page.getByRole('switch', { name: 'disabled — Khóa các hành động', exact: true })).toBeChecked();
});

test('Explorer deep link redirects to the released component with metadata and opt-in selection', async ({ page }) => {
  await page.goto('/utility/explorer-candidate');
  await expect(page).toHaveURL(/\/component\/file-explorer$/);
  const explorer = page.locator('sd-file-explorer');
  await expect(explorer.getByRole('columnheader', { name: 'Người phụ trách', exact: true })).toBeVisible();
  await expect(explorer.getByRole('group', { name: 'Lựa chọn tệp', exact: true })).toHaveCount(0);
  await explorer.getByRole('checkbox', { name: /Brief-Nova\.txt/ }).check();
  await expect(page.getByTestId('candidate-selection')).toHaveText('1 tệp đang chọn');
  await expect(explorer.getByRole('group', { name: 'Lựa chọn tệp', exact: true })).toBeVisible();
  await (await propertySwitch(page, 'Hành động khi chọn tệp')).click();
  await expect(explorer.getByRole('checkbox')).toHaveCount(0);
  await expect(explorer.getByRole('group', { name: 'Lựa chọn tệp', exact: true })).toHaveCount(0);
  await page.goto('/utility/workspace/files');
  await expect(explorer).toBeVisible();
});

test('released folder item command executes through the mobile action drawer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/component/file-explorer');
  const folder = page
    .locator('sd-file-explorer')
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: 'Lưu trữ', exact: true }) });
  await folder.getByRole('button', { name: 'Thao tác với Lưu trữ', exact: true }).click();
  await page.getByRole('button', { name: 'Đếm tài liệu', exact: true }).click();
  await expect(page.locator('app-file-explorer-demo').getByRole('status')).toContainText('Lưu trữ có 0 tài liệu trong phiên demo.');
});

test('all four dedicated ConfirmService examples remain reachable', async ({ page }) => {
  for (const [route, selector] of [
    ['confirm', 'app-confirm-basic'],
    ['with-input', 'app-confirm-with-input'],
    ['with-radio', 'app-confirm-with-radio'],
    ['with-date', 'app-confirm-with-date'],
  ]) {
    await page.goto('/service/confirm/' + route);
    await expect(page.locator(selector + ' sd-page')).toBeVisible();
    await expect(page).toHaveURL(new RegExp('/service/confirm/' + route + '$'));
  }
});

for (const width of [1440, 390, 320]) {
  test(`property labels stay left of small switches and previews fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.goto('/component/button/outline');
    await propertySwitch(page, 'Khóa các hành động');
    await propertySwitch(page, 'Giả lập lỗi lần tải tới');
    await insideViewport(page.locator('app-button-outline-demo'));
    await page.goto('/component/file-explorer');
    await propertySwitch(page, 'Chỉ đọc (demo)');
    await propertySwitch(page, 'Hành động khi chọn tệp');
    await insideViewport(page.locator('.demo-page-body'));
  });
}
