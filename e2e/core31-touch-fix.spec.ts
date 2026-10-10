import { expect, test, type Locator, type Page } from '@playwright/test';
import fs from 'node:fs/promises';

const localEvidenceDir = process.env['CORE31_TOUCH_EVIDENCE_DIR'] ?? '../core31-touch-fix-local-evidence';

async function loadedFonts(page: Page) {
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
    const faces = await Promise.all(specs.map(spec => document.fonts.load(spec, 'ABC Đề nghị search')));
    return specs.map((spec, index) => ({
      spec,
      available: document.fonts.check(spec),
      faces: faces[index].map(face => ({ family: face.family, status: face.status })),
    }));
  });
  expect(fonts).toHaveLength(7);
  expect(fonts.every(font => font.available && font.faces.length > 0 && font.faces.every(face => face.status === 'loaded'))).toBe(true);
  return fonts;
}

async function touchGeometry(page: Page, button: Locator) {
  await button.scrollIntoViewIfNeeded();
  const geometry = await button.evaluate(el => {
    const visual = el.getBoundingClientRect(),
      touch = el.querySelector('.mat-mdc-button-touch-target')?.getBoundingClientRect();
    const x = visual.left + visual.width / 2;
    const points = [
      { edge: 'above', x, y: visual.top - 4 },
      { edge: 'below', x, y: visual.bottom + 4 },
    ];
    return {
      visualHeight: visual.height,
      touchHeight: touch?.height ?? 0,
      classes: el.className,
      points: points.map(point => ({
        ...point,
        owned: document.elementFromPoint(point.x, point.y)?.closest('button') === el,
        inViewport: point.x >= 0 && point.x < innerWidth && point.y >= 0 && point.y < innerHeight,
      })),
    };
  });
  expect(geometry.classes).toContain('c-sm');
  expect(geometry.visualHeight).toBe(32);
  expect(geometry.touchHeight).toBeGreaterThanOrEqual(48);
  expect(geometry.points.every(point => point.owned && point.inViewport)).toBe(true);
  return geometry;
}

async function localEvidence(page: Page, name: string, receipt: object) {
  const fonts = await loadedFonts(page);
  await fs.mkdir(localEvidenceDir, { recursive: true });
  await fs.writeFile(`${localEvidenceDir}/${name}.json`, JSON.stringify({ ...receipt, fonts }, null, 2) + '\n');
  await page.screenshot({ path: `${localEvidenceDir}/${name}.png`, fullPage: true, animations: 'disabled' });
}

for (const width of [320, 390]) {
  test.describe(`touch containment ${width}`, () => {
    test.use({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });
    test('per-item Move owns taps above and below the visual button', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto('/utility/explorer-candidate');
      await loadedFonts(page);
      const explorer = page.locator('sd-file-explorer');
      const row = explorer.getByRole('row').filter({ hasText: 'Brief-Nova.txt' });
      const move = row.getByRole('button', { name: 'Di chuyển đến…', exact: true });
      const first = await touchGeometry(page, move);
      await localEvidence(page, `item-move-${width}`, { width, first });
      for (const edge of ['above', 'below']) {
        const geometry = await touchGeometry(page, move),
          point = geometry.points.find(point => point.edge === edge)!;
        await page.touchscreen.tap(point.x, point.y);
        const picker = explorer.getByRole('dialog');
        await expect(picker).toBeVisible();
        await picker.getByRole('button', { name: 'Hủy', exact: true }).click();
        await expect(picker).toBeHidden();
        await page.waitForTimeout(350);
      }
      await expect(page.getByTestId('candidate-move-counters')).toHaveText('0 lần thử · 0 mutation đã lưu');
      expect(errors).toEqual([]);
    });
    test('native Form footer owns taps outside its visual box and navigates', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto('/utility/form-navigation');
      await loadedFonts(page);
      await page.getByRole('button', { name: 'Điền mẫu mọi trang', exact: true }).click();
      const form = page.getByTestId('candidate-live-render'),
        next = form.getByRole('button', { name: 'Tiếp', exact: true });
      await expect(next).toBeEnabled();
      const first = await touchGeometry(page, next);
      await localEvidence(page, `form-footer-${width}`, { width, first });
      for (const edge of ['above', 'below']) {
        const geometry = await touchGeometry(page, next),
          point = geometry.points.find(point => point.edge === edge)!;
        await page.touchscreen.tap(point.x, point.y);
        await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: approval');
        await form.locator('mat-step-header').first().click();
        await expect(page.getByTestId('candidate-active-page')).toHaveText('Trang đang mở: details');
        await expect(form.getByRole('textbox', { name: 'Tên dự án', exact: true })).toHaveValue('Nova workspace');
        await page.waitForTimeout(350);
      }
      expect(errors).toEqual([]);
    });
  });
}
