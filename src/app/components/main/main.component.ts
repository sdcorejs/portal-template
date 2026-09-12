import { INSTRUCTIONS, INSTRUCTION_GROUPS } from '../../../modules/instructions';
import { PAGE_EXAMPLES, ROLE_EXAMPLES } from '../../../modules/pages';
import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SdLayoutComponent, SdLayoutMenu } from '@sdcorejs/angular/modules';
import { SdTabRouterOutletComponent } from '@sdcorejs/angular/components';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { loadPortalConfig } from '../../configurations';
@Component({
  selector: 'app-main',
  imports: [SdLayoutComponent, SdTabRouterOutletComponent],
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  // why: đọc localStorage tại constructor — đổi config xong user phải reload nên không cần signal phản ứng.
  private portalConfig = loadPortalConfig();
  readonly router = inject(Router);
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: this.router.getCurrentNavigation()?.finalUrl?.toString() ?? this.router.url }
  );
  // Pages owns route-scoped drafts; retain the actual RouterOutlet for CanDeactivate.
  readonly useTabRouter = computed(() => this.portalConfig.useTabRouter && !this.currentUrl().startsWith('/pages'));

  menus: SdLayoutMenu[] = [
    {
      icon: 'school',
      title: 'Instructions',
      children: INSTRUCTION_GROUPS.map(group => ({
        title: group,
        children: INSTRUCTIONS.filter(article => article.group === group).map(article => ({
          title: article.title,
          path: `/instructions/${article.path}`,
          permission: SD_PERMISSION_PUBLIC,
        })),
      })),
    },
    {
      icon: 'widgets',
      title: 'Components',
      children: [
        {
          path: '/components/button',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Button',
        },
        {
          path: '/components/avatar',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Avatar',
        },
        {
          path: '/components/badge',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Badge',
        },
        {
          path: '/components/upload-file',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Upload File',
        },
        {
          path: '/components/table',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Table',
          children: [
            { path: '/components/table/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/components/table/column', permission: SD_PERMISSION_PUBLIC, title: 'Tùy chỉnh cột' },
            { path: '/components/table/filter', permission: SD_PERMISSION_PUBLIC, title: 'Bộ lọc' },
            { path: '/components/table/index-column', permission: SD_PERMISSION_PUBLIC, title: 'Cột STT (index)' },
            { path: '/components/table/tree', permission: SD_PERMISSION_PUBLIC, title: 'Tree (cây)' },
          ],
        },
        {
          path: '/components/preview-image',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Preview Image',
        },
        {
          path: '/components/preview-pdf',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Preview PDF',
        },
        {
          path: '/components/splitter',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Splitter',
        },
        {
          path: '/components/query-bar',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Query Bar',
          children: [
            { path: '/components/query-bar/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/components/query-bar/modes', permission: SD_PERMISSION_PUBLIC, title: 'Modes & Density' },
            { path: '/components/query-bar/fields', permission: SD_PERMISSION_PUBLIC, title: '7 kind field' },
          ],
        },
        {
          path: '/components/modal',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Modal',
          children: [
            { path: '/components/modal/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/components/modal/slots', permission: SD_PERMISSION_PUBLIC, title: 'Header / Footer slots' },
            { path: '/components/modal/view-modes', permission: SD_PERMISSION_PUBLIC, title: 'View modes & Variants' },
          ],
        },
        {
          path: '/components/section',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Section',
          children: [
            { path: '/components/section/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/components/section/section-item', permission: SD_PERMISSION_PUBLIC, title: 'Kết Hợp SdSectionItem' },
            { path: '/components/section/header-slots', permission: SD_PERMISSION_PUBLIC, title: 'Tùy Chỉnh Header' },
          ],
        },
        {
          path: '/components/side-drawer',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Side Drawer',
          children: [
            { path: '/components/side-drawer/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản (Content thuần)' },
            { path: '/components/side-drawer/advanced', permission: SD_PERMISSION_PUBLIC, title: 'Mở rộng (Full Layout)' },
            { path: '/components/side-drawer/custom', permission: SD_PERMISSION_PUBLIC, title: 'Tùy biến (Custom CSS)' },
            { path: '/components/side-drawer/loading', permission: SD_PERMISSION_PUBLIC, title: 'Trạng thái Loading' },
          ],
        },
        {
          path: '/components/anchor',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Anchor',
          children: [
            { path: '/components/anchor/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/components/anchor/with-section', permission: SD_PERMISSION_PUBLIC, title: 'Với sd-section' },
          ],
        },
      ],
    },
    {
      icon: 'dynamic_form',
      title: 'Forms',
      children: [
        { path: '/forms/input', permission: SD_PERMISSION_PUBLIC, title: 'Input' },
        { path: '/forms/select', permission: SD_PERMISSION_PUBLIC, title: 'Select' },
        { path: '/forms/textarea', permission: SD_PERMISSION_PUBLIC, title: 'Textarea' },
        { path: '/forms/date', permission: SD_PERMISSION_PUBLIC, title: 'Date' },
        { path: '/forms/datetime', permission: SD_PERMISSION_PUBLIC, title: 'Date Time' },
        { path: '/forms/input-number', permission: SD_PERMISSION_PUBLIC, title: 'Input Number' },
        { path: '/forms/chip', permission: SD_PERMISSION_PUBLIC, title: 'Chip' },
        { path: '/forms/chip-calendar', permission: SD_PERMISSION_PUBLIC, title: 'Chip Calendar' },
        { path: '/forms/radio', permission: SD_PERMISSION_PUBLIC, title: 'Radio' },
        { path: '/forms/checkbox', permission: SD_PERMISSION_PUBLIC, title: 'Checkbox' },
        { path: '/forms/switch', permission: SD_PERMISSION_PUBLIC, title: 'Switch' },
        { path: '/forms/validation', permission: SD_PERMISSION_PUBLIC, title: 'Validation & hideInlineError' },
      ],
    },
    {
      icon: 'miscellaneous_services',
      title: 'Services',
      children: [
        {
          path: '/services/notify',
          permission: SD_PERMISSION_PUBLIC,
          title: 'NotifyService',
        },
        {
          path: '/services/confirm',
          permission: SD_PERMISSION_PUBLIC,
          title: 'ConfirmService',
          children: [
            { path: '/services/confirm/confirm', permission: SD_PERMISSION_PUBLIC, title: 'Xác nhận (.confirm)' },
            { path: '/services/confirm/with-input', permission: SD_PERMISSION_PUBLIC, title: 'Nhập văn bản (.withInput)' },
            { path: '/services/confirm/with-radio', permission: SD_PERMISSION_PUBLIC, title: 'Lựa chọn (.withRadio)' },
            { path: '/services/confirm/with-date', permission: SD_PERMISSION_PUBLIC, title: 'Chọn ngày (.withDate)' },
          ],
        },
        {
          path: '/services/loading',
          permission: SD_PERMISSION_PUBLIC,
          title: 'LoadingService',
        },
      ],
    },
    {
      icon: 'build',
      title: 'Utilities',
      children: [
        { path: '/utilities/tooltip', permission: SD_PERMISSION_PUBLIC, title: 'sdTooltip Directive' },
        { path: '/utilities/icons', permission: SD_PERMISSION_PUBLIC, title: 'System Icons (Fill/Outline)' },
      ],
    },
    {
      icon: 'web',
      title: 'Pages',
      children: [
        {
          title: 'List',
          icon: 'view_list',
          children: [...PAGE_EXAMPLES, ...ROLE_EXAMPLES]
            .filter(x => x.group === 'list')
            .map(x => ({
              path: '/pages/list/' + x.id,
              title: x.title,
              icon: x.icon,
              permission: SD_PERMISSION_PUBLIC,
            })),
        },
        {
          title: 'Detail',
          icon: 'description',
          children: PAGE_EXAMPLES.filter(x => x.group === 'detail').map(x => ({
            path: '/pages/detail/' + x.id,
            title: x.title,
            icon: x.icon,
            permission: SD_PERMISSION_PUBLIC,
          })),
        },
      ],
    },
  ];
}
