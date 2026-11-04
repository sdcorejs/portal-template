import { expect, test, type Locator } from '@playwright/test';
import { INSTRUCTIONS } from '../src/modules/instruction/catalog/instruction-registry';

async function expectLoaded(image: Locator) {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
}

test('instruction diagrams, zoom and screenshots load under the deployment base path', async ({ page, baseURL }) => {
  test.setTimeout(180000);
  const failedImages: string[] = [];
  page.on('response', response => {
    if (response.request().resourceType() === 'image' && response.status() >= 400) failedImages.push(response.url());
  });
  page.on('requestfailed', request => {
    if (request.resourceType() === 'image') failedImages.push(request.url());
  });
  for (const article of INSTRUCTIONS) {
    await test.step(article.title, async () => {
      await page.goto(new URL('instruction/' + article.path, baseURL!).href);
      const hero = page.locator('.hero img');
      await expectLoaded(hero);
      expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).toBe(
        new URL('assets/instructions/' + article.id + '/overview.svg', baseURL!).href
      );
      await page.locator('.image-trigger').click();
      await expectLoaded(page.getByRole('dialog').locator('img'));
      await page.keyboard.press('Escape');
      const screenshot = page.locator('.ui-evidence');
      if (await screenshot.count()) {
        await screenshot.locator('summary').click();
        const image = screenshot.locator('img');
        await image.scrollIntoViewIfNeeded();
        await expectLoaded(image);
        const imageUrl = await image.evaluate((element: HTMLImageElement) => element.currentSrc);
        expect(imageUrl.startsWith(new URL('assets/instructions/', baseURL!).href)).toBe(true);
        const href = await screenshot.locator('a').getAttribute('href');
        const response = await page.request.get(new URL(href!, baseURL!).href);
        expect(response.ok()).toBe(true);
        expect(response.headers()['content-type']).toContain('image/');
      }
    });
  }
  expect(failedImages).toEqual([]);
});

test('badge playground exposes all six public Core types and their controls', async ({ page, baseURL }, info) => {
  await page.goto(new URL('component/badge', baseURL!).href);
  const type = page.locator('app-demo-property[label="type"] sd-select');
  const preview = page.locator('.demo-section-content sd-badge');
  await expect(type).toContainText('Round');
  for (const name of ['Icon', 'Round', 'Tag', 'Solid', 'Dot', 'Pair']) {
    await type.getByRole('combobox').click();
    await expect(page.getByRole('option')).toHaveText(['Icon', 'Round', 'Tag', 'Solid', 'Dot', 'Pair']);
    if (name === 'Icon') await page.screenshot({ path: info.outputPath('badge-types.png') });
    await page.getByRole('option', { name, exact: true }).click();
    await expect(type).toContainText(name);
    // Model đổi trước khi animation đóng panel kết thúc; đợi panel cũ rời DOM rồi mới mở lại.
    await expect(page.locator('[role="listbox"]')).toHaveCount(0);
    await expect(preview).toBeVisible();
    if (name === 'Pair') {
      await expect(page.locator('app-demo-property[label="label"]')).toBeVisible();
      await expect(preview.locator('.c-badge-pair-label')).toHaveText('Trạng thái');
    } else if (name === 'Dot') {
      await page.locator('app-demo-property[label="pulse"]').getByRole('switch').click();
      await expect(preview.locator('.c-badge-dot--pulse')).toBeVisible();
    } else if (name === 'Solid') {
      await expect(preview.locator('.c-badge--solid')).toBeVisible();
    }
  }
});

test('page pattern status badges default to round across listings and drawers', async ({ page, baseURL }) => {
  for (const pattern of [
    'list-standard',
    'list-advanced-filter',
    'list-grouped-tree',
    'list-master-detail',
    'drawer-compact',
    'drawer-sections',
  ]) {
    await test.step(pattern, async () => {
      await page.goto(new URL('page/' + pattern, baseURL!).href);
      const badges = page.locator('app-demo-host sd-table sd-badge');
      await expect(badges.first()).toBeVisible();
      for (const badge of await badges.all()) {
        await expect(badge.locator('.c-badge')).toHaveCSS('border-radius', '999px');
        await expect(badge.locator('.c-badge--tag, .c-badge-icon')).toHaveCount(0);
      }
    });
  }
});
