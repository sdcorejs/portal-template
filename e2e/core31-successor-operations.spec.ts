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
async function boot(page: Page, route: string, id: string) {
  await page.goto('/component/' + route);
  await expect(page.locator('sd-layout')).toBeVisible();
  await expect(page.getByTestId(id)).toBeVisible();
}
test('successor kanban accepts a native local task move', async ({ page }) => {
  await boot(page, 'kanban', 'kanban-demo');
  await expect(page.locator('sd-kanban')).toBeVisible();
  await page.getByTestId('kanban-move').getByRole('button').click();
  await expect(page.getByTestId('kanban-summary')).toHaveAttribute('data-review-count', '2');
});
test('successor standalone tree loads service catalogue and selects nodes', async ({ page }) => {
  await boot(page, 'tree', 'tree-demo');
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(2);
  await page.locator('sd-tree [role=treeitem]').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(4);
  await page.locator('sd-tree input[type=checkbox]').first().check();
  await expect(page.getByTestId('tree-selection')).toHaveAttribute('data-count', '3');
});
test('successor org chart collapses native hierarchy and opens team detail', async ({ page }) => {
  await boot(page, 'org-chart', 'org-chart-demo');
  await expect(page.locator('sd-org-chart')).toBeVisible();
  await page.getByTestId('org-detail-ops').getByRole('button').click();
  await expect(page.getByTestId('org-selection')).toContainText('OPS');
  await page.locator('sd-org-chart button[aria-label="Collapse children"]').first().click();
  await expect(page.getByTestId('org-detail-ops')).toHaveCount(0);
});
test('successor resizable panels compare local records and save a validated note', async ({ page }) => {
  await boot(page, 'modal-resizable', 'modal-resizable-demo');
  await page.getByTestId('panel-open-a').getByRole('button').click();
  await page.getByTestId('panel-open-b').getByRole('button').click();
  await expect(page.getByTestId('panel-body-a')).toBeVisible();
  await expect(page.getByTestId('panel-body-b')).toBeVisible();
  await page.getByTestId('panel-note-a').fill('Checked local packing plan');
  await page.getByTestId('panel-save-a').getByRole('button').click();
  await expect(page.getByTestId('panel-saved-a')).toContainText('Checked local packing plan');
});

async function mobileFits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}
test('successor kanban rejects without mutation and reset cancels pending acceptance', async ({ page }) => {
  await boot(page, 'kanban', 'kanban-demo');
  await page.getByTestId('kanban-fail').getByRole('button').click();
  await page.getByTestId('kanban-move').getByRole('button').click();
  await expect(page.getByTestId('kanban-summary')).toHaveAttribute('data-status', 'rejected');
  await expect(page.getByTestId('kanban-summary')).toHaveAttribute('data-review-count', '1');
  await page.getByTestId('kanban-move').getByRole('button').click();
  await expect(page.locator('sd-kanban section').first()).toHaveAttribute('aria-busy', 'true');
  await page.getByTestId('lab-reset').getByRole('button').click();
  await page.waitForTimeout(750);
  await expect(page.getByTestId('kanban-summary')).toHaveAttribute('data-review-count', '1');
  await page.getByTestId('kanban-lock').getByRole('button').click();
  await expect(page.getByTestId('kanban-move').getByRole('button')).toBeDisabled();
  await page.getByTestId('lab-reset').getByRole('button').click();
  await page.locator('sd-kanban input[type=search]').fill('OPS-102');
  await expect(page.locator('sd-kanban')).toContainText('OPS-102');
  await expect(page.locator('sd-kanban')).not.toContainText('OPS-101');
});
test('successor tree recovers native root and lazy branch failure and locks selection', async ({ page }) => {
  await boot(page, 'tree', 'tree-demo');
  await page.getByTestId('tree-root-error').getByRole('button').click();
  await expect(page.locator('sd-tree')).toContainText(/Không tải được|Catalogue load failed/);
  await page
    .locator('sd-tree')
    .getByRole('button', { name: /Thử lại|Retry/ })
    .click();
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(2);
  await page.getByTestId('tree-child-error').getByRole('button').click();
  // A reload retains the previous roots; count alone can still match stale nodes.
  const rootLoading = page.locator('sd-tree .sd-tree__root-loading');
  await expect(rootLoading).toBeVisible();
  await expect(rootLoading).toBeHidden();
  await expect(page.locator('sd-tree [role=tree]')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(2);
  await page.locator('sd-tree [role=treeitem]').first().focus();
  await expect(page.locator('sd-tree [role=treeitem]').first()).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('tree-error')).toContainText(/Chưa tải được nhánh|Branch unavailable/);
  await page
    .locator('sd-tree')
    .getByRole('button', { name: /Tải lại mục|Retry item/ })
    .click();
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(4);
  await page.getByTestId('tree-lock').getByRole('button').click();
  await expect(page.getByTestId('tree-search')).toBeDisabled();
  await expect(page.locator('sd-tree input[type=checkbox]').first()).toBeDisabled();
  await page.waitForTimeout(550);
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(4);
  await page.getByTestId('tree-lock').getByRole('button').click();
  await page.waitForTimeout(550);
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(4);
  await page.getByTestId('lab-reset').getByRole('button').click();
  await expect(page.getByTestId('tree-selection')).toHaveAttribute('data-count', '0');
});
test('successor org chart retries errors, resets in-flight load and disables native preview', async ({ page }) => {
  await boot(page, 'org-chart', 'org-chart-demo');
  await page.getByTestId('org-error').getByRole('button').click();
  await expect(page.getByTestId('org-chart-demo').getByRole('alert')).toContainText(/Chưa tải được|unavailable/);
  await page.getByTestId('org-retry').getByRole('button').click();
  await expect(page.locator('sd-org-chart')).toBeVisible();
  await page.getByTestId('org-load').getByRole('button').click();
  await page.getByTestId('lab-reset').getByRole('button').click();
  await page.waitForTimeout(700);
  await expect(page.locator('sd-org-chart')).toBeVisible();
  await page.getByTestId('org-lock').getByRole('button').click();
  await expect(page.locator('sd-org-chart').locator('..')).toHaveAttribute('inert', '');
  await page.getByTestId('lab-reset').getByRole('button').click();
  await page.getByTestId('org-empty').getByRole('button').click();
  await expect(page.locator('sd-org-chart')).toHaveCount(0);
});
test('successor docked panels keep drafts on failed save and reset cancels pending work', async ({ page }) => {
  await boot(page, 'modal-resizable', 'modal-resizable-demo');
  await page.getByTestId('panel-open-a').getByRole('button').click();
  await expect(page.getByTestId('panel-save-a').getByRole('button')).toBeDisabled();
  await page.getByTestId('panel-note-a').fill('Local retry note');
  await page.getByTestId('panel-fail').getByRole('button').click();
  await page.getByTestId('panel-save-a').getByRole('button').click();
  await expect(page.getByTestId('panel-status')).toHaveAttribute('data-status', 'error');
  await expect(page.getByTestId('panel-note-a')).toHaveValue('Local retry note');
  await expect(page.getByTestId('panel-saved-a')).not.toContainText('Local retry note');
  await page.getByTestId('panel-save-a').getByRole('button').click();
  await page.getByTestId('lab-reset').getByRole('button').click();
  await page.waitForTimeout(750);
  await expect(page.getByTestId('panel-saved-a')).not.toContainText('Local retry note');
  await page.getByTestId('panel-open-a').getByRole('button').click();
  await page.getByTestId('panel-lock').getByRole('button').click();
  await expect(page.getByTestId('panel-note-a')).toBeDisabled();
});
for (const [route, id, english] of [
  ['kanban', 'kanban-demo', 'Operations queue'],
  ['tree', 'tree-demo', 'Service catalogue'],
  ['org-chart', 'org-chart-demo', 'Project teams'],
  ['modal-resizable', 'modal-resizable-demo', 'Project comparison'],
]) {
  test('successor ' + route + ' VI/EN and bounded desktop/mobile preview', async ({ page }) => {
    await boot(page, route, id);
    await page.getByTestId('lab-en').getByRole('button').click();
    await expect(page.locator('sd-page')).toContainText(english);
    await page.getByTestId('lab-vi').getByRole('button').click();
    if (route === 'tree') await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(2);
    if (route === 'modal-resizable') {
      await page.getByTestId('panel-open-a').getByRole('button').click();
      await page.getByTestId('panel-open-b').getByRole('button').click();
      await expect(page.getByTestId('panel-body-b')).toBeVisible();
      await page.waitForTimeout(350);
    }
    await capture(page, route + '-desktop');
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      if (route === 'modal-resizable') {
        await page.getByTestId('panel-open-a').getByRole('button').click();
        await expect(page.getByTestId('panel-body-a')).toBeVisible();
        await page.waitForTimeout(350);
        await expect(page.locator('.modal-resizable--active')).toHaveCount(1);
        const bounds = await page.locator('.modal-resizable--active').boundingBox();
        expect(bounds?.x).toBeGreaterThanOrEqual(0);
        expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width);
      }
      await mobileFits(page);
      await capture(page, route + '-' + width);
    }
  });
}

test('successor reset regression restores tree filter and org expansion and cancels empty queue load', async ({ page }) => {
  await boot(page, 'tree', 'tree-demo');
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(2);
  await page.getByTestId('tree-search').fill('no-match');
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(0);
  await page.getByTestId('lab-reset').getByRole('button').click();
  await expect(page.getByTestId('tree-search')).toHaveValue('');
  await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(2);
  await boot(page, 'org-chart', 'org-chart-demo');
  await page.locator('sd-org-chart button[aria-label="Collapse children"]').first().click();
  await expect(page.getByTestId('org-detail-ops')).toHaveCount(0);
  await page.getByTestId('lab-reset').getByRole('button').click();
  await expect(page.getByTestId('org-detail-ops')).toBeVisible();
  await boot(page, 'kanban', 'kanban-demo');
  await page.getByTestId('kanban-load-error').getByRole('button').click();
  await expect(page.locator('sd-kanban section').first()).toHaveAttribute('aria-busy', 'true');
  await page.getByTestId('kanban-empty').getByRole('button').click();
  await expect(page.locator('sd-kanban section').first()).toHaveAttribute('aria-busy', 'false');
  await page.waitForTimeout(750);
  await expect(page.locator('sd-kanban section').first()).toHaveAttribute('aria-busy', 'false');
});

test('successor kanban native keyboard move preserves focus and reset clears search', async ({ page }) => {
  await boot(page, 'kanban', 'kanban-demo');
  const handle = page.locator('[data-kanban-handle="string-OPS-101"]');
  await handle.focus();
  await page.keyboard.press('Alt+ArrowRight');
  await expect(page.getByTestId('kanban-summary')).toHaveAttribute('data-review-count', '2');
  await expect(handle).toBeFocused();
  await page.locator('sd-kanban input[type=search]').fill('no-match');
  await page.getByTestId('lab-reset').getByRole('button').click();
  await expect(page.locator('sd-kanban input[type=search]')).toHaveValue('');
  await expect(page.locator('sd-kanban')).toContainText('OPS-101');
});

test('successor docked panel survives height-only viewport resize with its draft and save', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await boot(page, 'modal-resizable', 'modal-resizable-demo');
  await page.getByTestId('panel-open-a').getByRole('button').click();
  await page.getByTestId('panel-note-a').fill('Draft during viewport height change');
  await page.setViewportSize({ width: 390, height: 700 });
  await page.waitForTimeout(350);
  await expect(page.getByTestId('panel-body-a')).toBeVisible();
  await expect(page.getByTestId('panel-note-a')).toHaveValue('Draft during viewport height change');
  await page.getByTestId('panel-save-a').getByRole('button').click();
  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForTimeout(350);
  await expect(page.getByTestId('panel-body-a')).toBeVisible();
  await expect(page.getByTestId('panel-saved-a')).toContainText('Draft during viewport height change');
});
