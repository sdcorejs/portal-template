import { expect, test, type Locator, type Page } from '@playwright/test';

function row(page: Page, name: string) {
  return page
    .locator('sd-file-explorer')
    .getByRole('row')
    .filter({ has: page.getByText(name, { exact: true }) });
}

async function expectTooltip(page: Page, label: string) {
  // why: Material ẩn overlay khỏi AT; nút icon đã có accessible name từ tooltip.
  const surface = page.locator('.mat-mdc-tooltip-show .mat-mdc-tooltip-surface:visible').filter({ hasText: label });
  // why: Tab qua các lệnh cùng tên ở cây/dòng để lại overlay đang đóng trong lúc animation kết thúc.
  await expect(surface).toHaveCount(1);
  await expect(surface).toBeVisible();
}

async function iconAction(action: Locator, name: string) {
  await expect(action).toHaveAccessibleName(name);
  await expect(action.locator('sd-icon')).toBeVisible();
  await expect(action.locator('.c-title:visible').filter({ hasText: /\S/ })).toHaveCount(0);
  await expect(action).not.toHaveAttribute('title');
  await expect(action).toHaveClass(/c-square/);
}

async function keyboardFocus(page: Page, action: Locator) {
  await action.scrollIntoViewIfNeeded();
  // why: MatTooltip opens on keyboard focus, so use a real Tab rather than programmatic focus.
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  for (let index = 0; index < 100; index++) {
    await page.keyboard.press('Tab');
    if (await action.evaluate(element => element === document.activeElement)) return;
  }
  throw new Error('Item action must be reachable by keyboard');
}

for (const language of ['vi', 'en']) {
  test(`desktop item actions use native tooltips and retain callbacks in ${language}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.addInitScript(locale => localStorage.setItem('portal-config', JSON.stringify({ language: locale })), language);
    await page.goto('/component/file-explorer');
    const file = row(page, 'Brief-Nova.txt');
    const metadata = file.getByRole('button', { name: 'Thông tin metadata', exact: true });
    await iconAction(metadata, 'Thông tin metadata');
    await metadata.hover();
    await expectTooltip(page, 'Thông tin metadata');
    await page.mouse.move(1, 1);
    await keyboardFocus(page, metadata);
    await expectTooltip(page, 'Thông tin metadata');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('candidate-metadata')).toContainText('Brief-Nova.txt');

    const review = file.getByRole('button', { name: 'Đánh dấu tệp đã xem', exact: true });
    await iconAction(review, 'Đánh dấu tệp đã xem');
    await review.click();
    const confirm = page.getByRole('dialog');
    await expect(confirm).toBeVisible();
    await confirm.getByRole('button', { name: 'Đánh dấu', exact: true }).click();
    await expect(file).toContainText('Đã xem');
    const locked = row(page, 'Locked-notes.txt');
    await expect(locked.getByRole('button', { name: 'Đánh dấu tệp đã xem', exact: true })).toBeDisabled();

    const folder = row(page, 'Lưu trữ');
    const count = folder.getByRole('button', { name: 'Đếm tài liệu', exact: true });
    await iconAction(count, 'Đếm tài liệu');
    await keyboardFocus(page, count);
    await expectTooltip(page, 'Đếm tài liệu');
    await page.keyboard.press('Enter');
    await expect(page.locator('app-file-explorer-demo').getByRole('status')).toContainText('Lưu trữ có 0 tài liệu');

    const move = file.getByRole('button', { name: language === 'vi' ? 'Di chuyển đến…' : 'Move to…', exact: true });
    await keyboardFocus(page, move);
    await expectTooltip(page, language === 'vi' ? 'Di chuyển đến…: Brief-Nova.txt' : 'Move to…: Brief-Nova.txt');
    await page
      .locator('sd-file-explorer')
      .getByRole('checkbox', { name: /Brief-Nova\.txt/ })
      .check();
    const selector = page.locator('sd-file-explorer .selection[role="group"]');
    await expect(selector.getByRole('button', { name: 'Đánh dấu đã xem', exact: true }).locator('.c-title:visible')).toHaveText(
      'Đánh dấu đã xem'
    );
    await page
      .locator('sd-file-explorer')
      .getByRole('button', { name: language === 'vi' ? 'Dạng lưới' : 'Grid view', exact: true })
      .click();
    const card = page.locator('sd-file-explorer .card').filter({ has: page.getByText('Brief-Nova.txt', { exact: true }) });
    await iconAction(card.getByRole('button', { name: 'Thông tin metadata', exact: true }), 'Thông tin metadata');
    expect(errors).toEqual([]);
  });
}

for (const width of [390, 320]) {
  test.describe(`mobile item commands ${width}`, () => {
    test.use({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });
    test('native drawer retains icon, label and file/folder callbacks', async ({ page }) => {
      await page.goto('/component/file-explorer');
      await row(page, 'Brief-Nova.txt').getByRole('button', { name: 'Thao tác với Brief-Nova.txt', exact: true }).click();
      const drawer = page.locator('.sd-file-explorer-command-drawer');
      const metadata = drawer.getByRole('button', { name: 'Thông tin metadata', exact: true });
      await expect(metadata.locator('.command-label')).toHaveText('Thông tin metadata');
      await expect(metadata.locator('sd-icon')).toBeVisible();
      await metadata.click();
      await expect(page.getByTestId('candidate-metadata')).toContainText('Brief-Nova.txt');
      await expect(drawer).not.toBeVisible();
      await row(page, 'Lưu trữ').getByRole('button', { name: 'Thao tác với Lưu trữ', exact: true }).click();
      const count = drawer.getByRole('button', { name: 'Đếm tài liệu', exact: true });
      await expect(count.locator('.command-label')).toHaveText('Đếm tài liệu');
      await expect(count.locator('sd-icon')).toBeVisible();
      await count.click();
      await expect(page.locator('app-file-explorer-demo').getByRole('status')).toContainText('Lưu trữ có 0 tài liệu');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    });
  });
}
