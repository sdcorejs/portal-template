import { test, expect } from '@playwright/test';
import { PAGE_EXAMPLES } from '../src/modules/page/catalog/page-examples';
import { ROLE_EXAMPLES } from '../src/modules/page/features/role/data/role.model';
for (const example of [...PAGE_EXAMPLES, ...ROLE_EXAMPLES]) {
  test(example.path + ': entity URLs and legacy links', async ({ page }) => {
    const base = '/page/' + example.path;
    await page.goto('/page/' + example.group + '/' + example.id + '?from=bookmark');
    await expect(page).toHaveURL(base + '?from=bookmark');
    const first = page.locator('sd-table a').first();
    await expect(first).toBeVisible();
    const href = await first.getAttribute('href');
    expect(href).toMatch(new RegExp('^' + base + '/[^/]+/detail$'));
    await first.click();
    await expect(page).toHaveURL(href!);
    const record = href!.slice(base.length);
    await page.goto('/page/' + example.group + '/' + example.id + record);
    await expect(page).toHaveURL(href!);
    await page.goto('/page/' + example.group + '/' + example.id + '/create');
    await expect(page).toHaveURL(base + '/create');
    await expect(
      page.getByRole('textbox', { name: 'Tên hồ sơ', exact: true }).or(page.getByRole('textbox', { name: 'Tên vai trò', exact: true }))
    ).toBeVisible();
  });
}
