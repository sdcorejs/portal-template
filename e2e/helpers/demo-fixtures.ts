import { expect, Page } from '@playwright/test';
export async function openPattern(page: Page, id: string) {
  await page.goto('/page/' + id, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('app-demo-host')).toBeVisible();
}
export async function openRecord(page: Page, id: string) {
  await openPattern(page, id);
  const record = page.locator('app-demo-host sd-table a').first();
  await expect(record).toBeVisible();
  await record.click();
  await expect(page).toHaveURL(/\/[^/]+\/detail$/);
}
export async function expectRecordSaving(page: Page) {
  await expect(page.getByRole('status', { name: 'Loading', exact: true })).toBeVisible();
  await expect(page.locator('app-page-reference .business-page')).toHaveAttribute('inert', '');
}
export async function discardUnsavedChanges(page: Page) {
  const confirmation = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Thay đổi chưa lưu', exact: true }) });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole('button', { name: 'Bỏ qua', exact: true }).click();
  await expect(confirmation).toBeHidden();
}
export async function selectCore(page: Page, label: string, option: string) {
  // Click the field surface: an empty compact select places its label over the trigger.
  await page.getByRole('combobox', { name: label, exact: true }).locator('xpath=ancestor::mat-form-field').click();
  await page.getByRole('option', { name: option, exact: true }).click();
}
