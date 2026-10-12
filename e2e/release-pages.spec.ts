import { expect, test, type Page } from '@playwright/test';
import ExcelJS from 'exceljs';
import { readFileSync } from 'node:fs';

const artifact = JSON.parse(readFileSync('docs/core31-release-artifact.json', 'utf8'));
const routes = ['kanban', 'tree', 'org-chart', 'modal-resizable', 'import-excel', 'image-editor', 'autoid-inspector'];
const menuTitles = ['Kanban', 'Tree', 'Org Chart', 'Modal Resizable', 'Import Excel', 'Image Editor', 'AutoId Inspector'];

async function expectShell(page: Page, width: number, group: string, leaf: string) {
  if (width >= 1024) {
    await expect(page.locator('sd-sidebar-v1-panel .c-title-menu-group')).toHaveText(group);
    const active = page.locator('sd-sidebar-v1-panel a[aria-current="page"]');
    await expect(active).toHaveCount(1);
    await expect(active).toHaveText(leaf);
  } else {
    await expect(page.locator('sd-sidebar-mobile-v1 .c-topbar-title')).toHaveText(group);
  }
}

async function openTreeFromMenu(page: Page, width: number) {
  if (width >= 1024) {
    await page.locator('sd-sidebar-v1-panel').getByRole('link', { name: 'Tree', exact: true }).click();
  } else {
    await page.locator('sd-sidebar-mobile-v1 .c-hamburger-btn').click();
    const overlay = page.locator('sd-sidebar-mobile-overlay');
    const tree = overlay.locator('.m-menu-item').filter({ has: page.locator('.m-item-title', { hasText: /^Tree$/ }) });
    if (!(await tree.isVisible())) {
      await overlay
        .locator('.m-card-header')
        .filter({ has: page.locator('.m-group-title', { hasText: /^Component$/ }) })
        .click();
    }
    await tree.click();
  }
  await expect(page.getByTestId('tree-demo')).toBeVisible();
  await expectShell(page, width, 'Component', 'Tree');
}

for (const width of [1440, 390, 320]) {
  test(`public Pages revision and native journeys at ${width}px`, async ({ page, request, baseURL }, info) => {
    await page.setViewportSize({ width, height: 1000 });
    const revisionResponse = await request.get(new URL('release.json', baseURL!).href);
    expect(revisionResponse.ok()).toBe(true);
    const revision = await revisionResponse.json();
    expect(revision.coreVersion).toBe(artifact.version);
    expect(revision.coreIntegrity).toBe(artifact.integrity);
    expect(revision.coreSourceCommit).toBe(artifact.sourceCommit);
    expect(revision.commit).toMatch(/^[a-f0-9]{40}$/);
    const expectedCommit = process.env['PORTAL_EXPECTED_COMMIT'] ?? process.env['GITHUB_SHA'];
    if (expectedCommit) expect(revision.commit).toBe(expectedCommit);
    const errors: string[] = [];
    const consoleErrors: { text: string; url: string }[] = [];
    const fallbackDocuments = new Set<string>();
    const knownDocumentPaths = new Set(
      [...routes.map(route => 'component/' + route), 'utility/explorer-candidate', 'utility/form-navigation'].map(
        route => new URL(route, baseURL!).pathname
      )
    );
    const missingAssets: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push({ text: message.text(), url: message.location().url });
    });
    page.on('response', response => {
      if (
        response.status() === 404 &&
        response.request().resourceType() === 'document' &&
        response.headers()['content-type']?.startsWith('text/html') &&
        knownDocumentPaths.has(new URL(response.url()).pathname)
      ) {
        // GitHub Pages serves the built 404.html for valid deep routes; runtime/assets must still succeed.
        fallbackDocuments.add(response.url());
      }
      if (response.status() >= 400 && response.request().resourceType() !== 'document') missingAssets.push(response.url());
    });
    page.on('requestfailed', request => missingAssets.push(request.url()));

    for (const [index, route] of routes.entries()) {
      const routeUrl = new URL('component/' + route + (index === 0 ? '?pagesSmoke=1#board' : ''), baseURL!).href;
      await page.goto(routeUrl, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('sd-layout')).toBeVisible();
      await expect(page.getByTestId(route === 'modal-resizable' ? 'modal-resizable-demo' : route + '-demo')).toBeVisible();
      await expectShell(page, width, 'Component', menuTitles[index]);
      await expect(page).toHaveURL(routeUrl);
      if (index === 0) {
        const historyLength = await page.evaluate(() => history.length);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expectShell(page, width, 'Component', 'Kanban');
        await expect(page).toHaveURL(routeUrl);
        expect(await page.evaluate(() => history.length)).toBe(historyLength);
        await openTreeFromMenu(page, width);
        await expect(page).toHaveURL(new URL('component/tree', baseURL!).href);
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await expect(page.getByTestId('kanban-demo')).toBeVisible();
        await expectShell(page, width, 'Component', 'Kanban');
        await expect(page).toHaveURL(routeUrl);
      }
      if (route === 'kanban') {
        await page.getByTestId('kanban-move').getByRole('button').click();
        await expect(page.getByTestId('kanban-summary')).toHaveAttribute('data-review-count', '2');
      } else if (route === 'tree') {
        await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(2);
        await page.locator('sd-tree [role=treeitem]').first().focus();
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('sd-tree [role=treeitem]')).toHaveCount(4);
      } else if (route === 'org-chart') {
        await page.getByTestId('org-detail-ops').getByRole('button').click();
        await expect(page.getByTestId('org-selection')).toContainText('OPS');
      } else if (route === 'modal-resizable') {
        await page.getByTestId('panel-open-a').getByRole('button').click();
        await page.getByTestId('panel-note-a').fill('Public Pages local note');
        await page.getByTestId('panel-save-a').getByRole('button').click();
        await expect(page.getByTestId('panel-saved-a')).toContainText('Public Pages local note');
      } else if (route === 'import-excel') {
        await page.getByTestId('import-open').getByRole('button').click();
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('assets');
        sheet.addRows([
          ['code', 'name', 'quantity', 'site'],
          ['Asset code', 'Asset name', 'Quantity', 'Site'],
          ['AST-201', 'Harbor scanner', 4, 'HARBOR'],
        ]);
        const chooser = page.waitForEvent('filechooser');
        await page.locator('.sd-import-workspace [data-import-action="choose"] button').click();
        await (
          await chooser
        ).setFiles({
          name: 'harbor-assets.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: Buffer.from(await workbook.xlsx.writeBuffer()),
        });
        await page.locator('.sd-import-workspace [data-import-action="accept"]').getByRole('button').click();
        await expect(page.getByTestId('import-accepted-count')).toHaveAttribute('data-count', '1');
      } else if (route === 'image-editor') {
        await page.getByTestId('image-load').getByRole('button').click();
        await expect(page.getByTestId('image-status')).toHaveAttribute('data-status', 'ready');
        await page.getByTestId('image-export').getByRole('button').click();
        await expect(page.getByTestId('image-result-preview')).toBeVisible();
        await page.getByTestId('image-result-preview').scrollIntoViewIfNeeded();
      } else {
        await page.getByTestId('autoid-scan').getByRole('button').click();
        await expect(page.getByTestId('autoid-audit')).toContainText(/3 (?:elements|phần tử)/);
      }
      const fonts = await page.evaluate(async () => {
        await document.fonts.ready;
        const specs = [
          '400 14px Roboto',
          'italic 400 14px Roboto',
          '500 14px Roboto',
          '600 14px Roboto',
          '400 24px "Material Icons"',
          '400 24px "Material Icons Outlined"',
          '400 24px "Material Symbols Outlined"',
        ];
        const loaded = await Promise.all(specs.map(spec => document.fonts.load(spec, 'Harbor Đề nghị')));
        return {
          faces: loaded.map((faces, index) => ({
            spec: specs[index],
            count: faces.length,
            loaded: faces.every(face => face.status === 'loaded'),
            available: document.fonts.check(specs[index], 'Harbor Đề nghị'),
          })),
          errors: [...document.fonts].filter(face => face.status === 'error').length,
        };
      });
      for (const face of fonts.faces) {
        expect(face.count, face.spec).toBeGreaterThan(0);
        expect(face.loaded, face.spec).toBe(true);
        expect(face.available, face.spec).toBe(true);
      }
      expect(fonts.errors).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: info.outputPath(route + '.png'), fullPage: true, animations: 'disabled' });
    }
    await page.goto('utility/explorer-candidate');
    await expect(page.locator('sd-file-explorer')).toBeVisible();
    await expectShell(page, width, 'Component', 'File Explorer');
    await page
      .locator('sd-file-explorer')
      .getByRole('checkbox', { name: /Brief-Nova\.txt/ })
      .check();
    await expect(page.getByTestId('candidate-selection')).toContainText('1');
    await page.screenshot({ path: info.outputPath('explorer.png'), fullPage: true, animations: 'disabled' });
    await page.goto('utility/form-navigation');
    await expectShell(page, width, 'Utility', 'Form — Tabs & Steps');
    const applySchema = page.getByRole('button', { name: 'Áp dụng schema', exact: true });
    await expect(applySchema).toBeDisabled();
    const navigation = page.getByRole('combobox', { name: 'Điều hướng', exact: true });
    await navigation.click();
    await page.getByRole('option', { name: 'Tabs', exact: true }).click();
    await expect(navigation).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('candidate-schema-state')).toContainText('Bản nháp có thay đổi chưa áp dụng');
    await expect(page.getByTestId('candidate-schema-state')).toContainText('Render: steps');
    await expect(applySchema).toBeEnabled();
    await applySchema.click();
    await expect(page.getByTestId('candidate-schema-state')).toContainText('Builder và Render dùng cùng schema');
    await expect(page.getByTestId('candidate-schema-state')).toContainText('Render: tabs');
    await expect(page.getByTestId('candidate-live-render').locator('sd-tab-group')).toBeVisible();
    await expect(page.getByTestId('candidate-live-render')).toBeVisible();
    const renderedInput = page.getByTestId('candidate-live-render').locator('input').first();
    await expect(renderedInput).toBeVisible();
    await renderedInput.scrollIntoViewIfNeeded();
    await expect(renderedInput).toBeInViewport();
    await page.screenshot({ path: info.outputPath('form-navigation.png'), fullPage: true, animations: 'disabled' });
    expect(errors).toEqual([]);
    expect(
      consoleErrors.filter(
        message =>
          !(
            /^Failed to load resource: the server responded with a status of 404(?: \((?:Not Found)?\))?$/.test(message.text) &&
            fallbackDocuments.has(message.url.split('#', 1)[0])
          )
      )
    ).toEqual([]);
    expect(missingAssets).toEqual([]);
    await info.attach('public-revision.json', { body: JSON.stringify(revision), contentType: 'application/json' });
  });
}
