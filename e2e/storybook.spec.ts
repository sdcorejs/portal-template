import { test, expect } from '@playwright/test';
import { DEMO_INVENTORY } from '../src/libs/shared/demo-inventory';
test('[case-ac-002 case-ac-003 case-ac-012] CASE-STORYBOOK: components/forms/services are indexed and interactive', async ({
  page,
  request,
}) => {
  const response = await request.get('http://localhost:6006/index.json');
  expect(response.ok()).toBe(true);
  const index = await response.json();
  const stories = Object.values(index.entries) as { id: string; title: string; type: string }[];
  for (const group of ['Components/', 'Forms/', 'Services/']) expect(stories.some(s => s.title.startsWith(group))).toBe(true);
  const input = stories.find(s => s.title === 'Forms/input' && s.type === 'story');
  expect(input).toBeTruthy();
  await page.goto('http://localhost:6006/iframe.html?id=' + input!.id + '&viewMode=story');
  await expect(page.locator('sd-input').first()).toBeVisible();
});

test('[case-ac-002 case-ac-003 case-ac-012] CASE-STORYBOOK-ALL: every indexed story renders a usable example', async ({
  page,
  request,
}) => {
  test.setTimeout(600000);
  const response = await request.get('http://localhost:6006/index.json');
  const index = await response.json();
  const entries = Object.values(index.entries) as { id: string; title: string; type: string }[];
  const stories = entries.filter(s => s.type === 'story');
  expect(stories.length).toBeGreaterThanOrEqual(50);
  for (const demo of DEMO_INVENTORY)
    expect(
      stories.some(s => s.title === demo.title),
      demo.title
    ).toBe(true);
  for (const story of stories) {
    await test.step(story.id, async () => {
      const errors: string[] = [];
      const capture = (e: Error) => errors.push(e.message);
      page.on('pageerror', capture);
      await page.goto('http://localhost:6006/iframe.html?id=' + story.id + '&viewMode=story', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('#storybook-root')).not.toBeEmpty();
      await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
      await expect.poll(async () => await page.locator('#storybook-root').innerText()).toMatch(/\S{3}/);
      expect(errors).toEqual([]);
      page.off('pageerror', capture);
    });
  }
});
