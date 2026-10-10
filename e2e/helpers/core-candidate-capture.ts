import type { Page } from '@playwright/test';

/** Preserve released-package evidence during local candidate compatibility runs. */
export async function captureCompatibility(page: Page, options: NonNullable<Parameters<Page['screenshot']>[0]>) {
  const mode = process.env['CORE31_COMPAT_CAPTURE'];
  if (mode === 'none') return;
  const path = mode === 'r2' ? options.path?.replace('docs/screenshots/', 'docs/screenshots/core31-r2-compat-') : options.path;
  await page.screenshot({ ...options, path });
}
