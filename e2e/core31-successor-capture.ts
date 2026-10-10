import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { expect, type Page } from '@playwright/test';
export async function capture(page: Page, name: string): Promise<void> {
  if (process.env['CORE31_ACCEPTANCE_CAPTURE'] !== '1') return;
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return await Promise.all(
      [
        '400 14px Roboto',
        'italic 400 14px Roboto',
        '500 14px Roboto',
        '600 14px Roboto',
        '400 24px "Material Icons"',
        '400 24px "Material Icons Outlined"',
        '400 24px "Material Symbols Outlined"',
      ].map(async spec => {
        const faces = await document.fonts.load(spec, 'Harbor Đề nghị');
        return {
          spec,
          count: faces.length,
          loaded: faces.every(face => face.status === 'loaded'),
          available: document.fonts.check(spec, 'Harbor Đề nghị'),
        };
      })
    );
  });
  for (const font of fonts) {
    expect(font.count, font.spec).toBeGreaterThan(0);
    expect(font.loaded, font.spec).toBe(true);
    expect(font.available, font.spec).toBe(true);
  }
  expect(await page.evaluate(() => [...document.fonts].filter(face => face.status === 'error').length)).toBe(0);
  const path = 'docs/screenshots/core31-successor-' + name + '.png';
  await page.screenshot({ path, fullPage: true, animations: 'disabled' });
  await writeFile(
    path + '.readiness.json',
    JSON.stringify(
      {
        fonts,
        viewport: page.viewportSize(),
        url: page.url(),
        screenshotSha256: createHash('sha256')
          .update(await readFile(path))
          .digest('hex'),
        fontErrors: 0,
      },
      null,
      2
    ) + '\n'
  );
}
