import { expect, test } from '@playwright/test';

test('architecture guide switches trees and opens a real record example', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/instruction/architecture');
  await expect(page.getByRole('heading', { name: 'Module & Feature' })).toBeVisible();
  await page.screenshot({ path: info.outputPath('architecture-desktop.png') });
  await page.getByRole('button', { name: 'Source hiện tại', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Source hiện tại', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('pre[aria-label=\"Cây thư mục\"]')).toContainText('architecture/pages/');
  await page.getByRole('button', { name: 'Module nghiệp vụ', exact: true }).click();
  await expect(page.locator('pre[aria-label=\"Cây thư mục\"]')).toContainText('customer.service.ts');
  await page.getByRole('link', { name: 'Mở ví dụ đang chạy: khách hàng customer-1' }).click();
  await expect(page).toHaveURL(/customer-1\/detail$/);
  await expect(page.getByRole('heading', { name: /Chi tiết công ty/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test('architecture infographic remains within a mobile viewport', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/instruction/architecture');
  await expect(page.getByRole('heading', { name: 'Module & Feature' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('.hero img')).toBeVisible();
  await page.getByRole('button', { name: 'Source hiện tại', exact: true }).click();
  await expect(page.locator('pre[aria-label=\"Cây thư mục\"]')).toContainText('Storybook helpers');
  await page.screenshot({ path: info.outputPath('architecture-mobile.png') });
});
