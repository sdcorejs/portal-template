import { expect, Page } from '@playwright/test';
export async function openPattern(page: Page, id: string) {
  await page.goto('/page/' + id, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('app-demo-host')).toBeVisible();
}
export async function selectCore(page: Page, label: string, option: string) {
  // Click the field surface: an empty compact select places its label over the trigger.
  await page.getByRole('combobox', { name: label, exact: true }).locator('xpath=ancestor::mat-form-field').click();
  await page.getByRole('option', { name: option, exact: true }).click();
}
