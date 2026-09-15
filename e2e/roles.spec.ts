import { test, expect, Page } from '@playwright/test';
const root = (layout: string) => '/page/list/roles-' + layout;
const checkbox = (page: Page, name: string) => page.getByRole('checkbox', { name, exact: true });
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const refreshIsGuarded = (page: Page) =>
  page.evaluate(() => {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  });
const grants = (page: Page, layout: string) =>
  page.evaluate(
    layout =>
      JSON.parse(sessionStorage.getItem('portal-pages:roles:v1:' + layout)!).find((r: { id: string }) => r.id === 'role-sales')
        .permissions as string[],
    layout
  );

for (const layout of ['matrix', 'tree']) {
  test(layout + ': list code link, update, save, reload and independent stores', async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(root(layout));
    const link = page.getByRole('link', { name: 'ROLE-SALES', exact: true });
    await expect(link).toHaveAttribute('href', root(layout) + '/role-sales/detail');
    await page.screenshot({ path: info.outputPath('list.png') });
    await link.click();
    await expect(page.getByRole('heading', { name: 'Chi tiết vai trò #ROLE-SALES' })).toBeVisible();
    await expect(button(page, 'Tạo mới')).toHaveCount(0);
    await expect(checkbox(page, 'Tạo · Khách hàng')).toBeDisabled();
    await button(page, 'Cập nhật').click();
    await expect(page).toHaveURL(root(layout) + '/role-sales/update');
    await expect(page.getByRole('tab', { name: 'CRM 8', exact: true })).toBeVisible();
    await expect(checkbox(page, 'Chọn tất cả quyền Khách hàng')).toBeChecked({ indeterminate: true });
    await checkbox(page, 'Giao phụ trách · Khách hàng').check();
    await checkbox(page, 'Nhập dữ liệu · Khách hàng').check();
    await expect(page.getByRole('tab', { name: 'CRM 10', exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'Bán hàng 3', exact: true }).click();
    await page.getByRole('tab', { name: 'CRM 10', exact: true }).click();
    await expect(checkbox(page, 'Giao phụ trách · Khách hàng')).toBeChecked();
    await page.getByRole('textbox', { name: 'Tên vai trò', exact: true }).fill('Kinh doanh đã cập nhật');
    await page.screenshot({ path: info.outputPath(layout + '.png') });
    await button(page, 'Lưu').click();
    await expect(button(page, 'Lưu')).toBeDisabled();
    await expect(page).toHaveURL(root(layout) + '/role-sales/detail');
    await expect(page.getByRole('status').filter({ hasText: 'Đã lưu vai trò.' })).toBeVisible();
    expect(await grants(page, layout)).toContain('CRM_CUSTOMER_G_ASSIGN');
    await page.reload();
    await expect(page.locator('.description').filter({ hasText: 'Kinh doanh đã cập nhật' })).toBeVisible();
    await page.goto(root(layout === 'matrix' ? 'tree' : 'matrix') + '/role-sales/detail');
    await expect(page.locator('app-role-record-editor p.description')).toHaveText('Nhân viên kinh doanh');
    expect(errors).toEqual([]);
  });
  test(layout + ': create validates required/duplicate code and allows zero grants', async ({ page }) => {
    await page.goto(root(layout));
    await button(page, 'Tạo mới').click();
    await expect(page).toHaveURL(root(layout) + '/create');
    await button(page, 'Lưu').click();
    await expect(page.getByRole('alert')).toContainText('bắt buộc');
    await page.getByRole('textbox', { name: 'Mã vai trò', exact: true }).fill('ROLE-SALES');
    await page.getByRole('textbox', { name: 'Tên vai trò', exact: true }).pressSequentially('Vai trò thử nghiệm', { delay: 30 });
    await button(page, 'Lưu').click();
    await expect(page.getByRole('alert')).toContainText('đã tồn tại');
    await page.getByRole('textbox', { name: 'Mã vai trò', exact: true }).fill('ROLE-NEW');
    await button(page, 'Lưu').click();
    await expect(page).toHaveURL(new RegExp('/roles-' + layout + '/role-[a-f0-9-]+/detail$'));
    await expect(page.getByRole('heading', { name: 'Chi tiết vai trò #ROLE-NEW' })).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: '0 quyền · 0 module' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Chi tiết vai trò #ROLE-NEW' })).toBeVisible();
  });
}

test('pristine create/update does not prompt; keyboard selection and cleared description stay consistent', async ({ page }) => {
  for (const suffix of ['/create', '/role-sales/update']) {
    await page.goto(root('matrix') + suffix);
    await expect(page.getByRole('textbox', { name: 'Tên vai trò', exact: true })).toBeVisible();
    await expect.poll(() => refreshIsGuarded(page)).toBe(false);
    await button(page, 'Quay lại').click();
    await expect(page).toHaveURL(root('matrix'));
  }
  await page.goto(root('matrix') + '/role-sales/update');
  const crm = page.getByRole('tab', { name: 'CRM 8', exact: true });
  await crm.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tab', { name: 'Bán hàng 3', exact: true })).toHaveAttribute('aria-selected', 'true');
  await crm.click();
  await checkbox(page, 'Giao phụ trách · Khách hàng').focus();
  await page.keyboard.press('Space');
  await expect(checkbox(page, 'Giao phụ trách · Khách hàng')).toBeChecked();
  await expect.poll(() => refreshIsGuarded(page)).toBe(true);
  await page.getByRole('textbox', { name: 'Mô tả', exact: true }).fill('');
  await button(page, 'Lưu').click();
  await expect(page).toHaveURL(root('matrix') + '/role-sales/detail');
  expect(
    await page.evaluate(
      () =>
        JSON.parse(sessionStorage.getItem('portal-pages:roles:v1:matrix')!).find((r: { id: string }) => r.id === 'role-sales').description
    )
  ).toBe('');
});

test('matrix: filtered bulk/column scope preserves hidden grants and shows missing CRUD', async ({ page }) => {
  await page.goto(root('matrix') + '/role-sales/update');
  await expect(page.getByLabel('Không áp dụng Xóa')).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Tìm chức năng hoặc quyền', exact: true });
  await search.fill('Nguồn khách hàng');
  await expect(page.locator('app-role-permission-matrix tbody tr')).toHaveCount(1);
  await checkbox(page, 'Chọn Tạo cho các chức năng đang hiển thị').check();
  await checkbox(page, 'Chọn tất cả quyền đang hiển thị').check();
  await checkbox(page, 'Chọn tất cả quyền đang hiển thị').uncheck();
  await search.fill('không tồn tại');
  await expect(page.getByText('Không có chức năng phù hợp.', { exact: false })).toBeVisible();
  await search.fill('');
  await expect(checkbox(page, 'Xem · Khách hàng')).toBeChecked();
  await expect(checkbox(page, 'Xem · Khách hàng tiềm năng')).not.toBeChecked();
  await button(page, 'Lưu').click();
  await expect(page).toHaveURL(root('matrix') + '/role-sales/detail');
  const ids = await grants(page, 'matrix');
  expect(ids).toContain('SALES_ORDER_G_VIEW');
  expect(ids).not.toContain('CRM_LEAD_G_VIEW');
});

test('tree: collapse is independent of grants; parent/child mixed selection', async ({ page }) => {
  await page.goto(root('tree') + '/role-sales/update');
  const parent = checkbox(page, 'Chọn tất cả quyền Khách hàng');
  await expect(parent).toBeChecked({ indeterminate: true });
  await button(page, 'Thu gọn Khách hàng').click();
  await expect(checkbox(page, 'Xem · Khách hàng')).toHaveCount(0);
  await expect(page.getByRole('tab', { name: 'CRM 8', exact: true })).toBeVisible();
  await parent.check();
  await button(page, 'Mở rộng Khách hàng').click();
  await expect(checkbox(page, 'Nhập dữ liệu · Khách hàng')).toBeChecked();
  await checkbox(page, 'Xóa · Khách hàng').uncheck();
  await expect(parent).toBeChecked({ indeterminate: true });
});

test('unsaved guard supports cancel, discard, save and browser Back', async ({ page }) => {
  await page.goto(root('matrix'));
  await page.getByRole('link', { name: 'ROLE-SALES', exact: true }).click();
  await button(page, 'Cập nhật').click();
  const name = page.getByRole('textbox', { name: 'Tên vai trò', exact: true });
  await name.fill('Bản nháp');
  await page.evaluate(() => history.back());
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await expect(name).toHaveValue('Bản nháp');
  await button(page, 'Quay lại').click();
  await page.getByRole('radio', { name: 'Bỏ thay đổi', exact: true }).check();
  await button(page, 'Tiếp tục').click();
  await expect(page).toHaveURL(root('matrix'));
  await page.getByRole('link', { name: 'ROLE-SALES', exact: true }).click();
  await button(page, 'Cập nhật').click();
  await name.fill('Lưu khi rời trang');
  await button(page, 'Quay lại').click();
  await page.getByRole('radio', { name: 'Lưu thay đổi', exact: true }).check();
  await button(page, 'Tiếp tục').click();
  await expect(page).toHaveURL(root('matrix'));
  await expect(page.getByText('Lưu khi rời trang', { exact: true })).toBeVisible();
});

test('storage error retains draft and dirty guard; missing ID is explicit', async ({ page }) => {
  await page.goto(root('matrix') + '/role-sales/update');
  const name = page.getByRole('textbox', { name: 'Tên vai trò', exact: true });
  await name.fill('Giữ bản nháp khi lỗi');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error('Không thể ghi dữ liệu phiên');
    };
  });
  await button(page, 'Lưu').click();
  await expect(page.getByRole('alert')).toContainText('Không thể ghi dữ liệu phiên');
  await expect(name).toHaveValue('Giữ bản nháp khi lỗi');
  await button(page, 'Quay lại').click();
  await button(page, 'Tiếp tục chỉnh sửa').click();
  await expect(name).toHaveValue('Giữ bản nháp khi lỗi');
  await page.goto(root('tree') + '/missing/update');
  await expect(page.getByText('Không tìm thấy vai trò.', { exact: false })).toBeVisible();
  await expect(button(page, 'Lưu')).toHaveCount(0);
});

for (const layout of ['matrix', 'tree'])
  test(layout + ': compact mobile layout contains overflow and preserves header actions', async ({ page }, info) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(root(layout) + '/role-sales/update');
    const save = button(page, 'Lưu');
    await expect(save).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
    const box = await save.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(391);
    await page.locator('.permission-scroll').scrollIntoViewIfNeeded();
    await expect(save).toBeInViewport();
    await page.screenshot({ path: info.outputPath(layout + '-mobile.png') });
  });
