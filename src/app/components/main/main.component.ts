import { INSTRUCTIONS, INSTRUCTION_GROUPS } from '../../../modules/instruction';
import { PAGE_EXAMPLES, ROLE_EXAMPLES } from '../../../modules/page';
import { PATTERN_GROUPS, PATTERN_PATHS } from '../../../modules/pattern/catalog/pattern-catalog';
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
  styleUrl: './main.component.scss',
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
  readonly useTabRouter = computed(
    () => this.portalConfig.useTabRouter && !this.currentUrl().startsWith('/page') && !this.currentUrl().startsWith('/pattern')
  );

  menus: SdLayoutMenu[] = [
    {
      icon: 'school',
      title: 'Instruction',
      children: INSTRUCTION_GROUPS.map(group => ({
        title: group,
        children: INSTRUCTIONS.filter(article => article.group === group).map(article => ({
          title: article.title,
          path: `/instruction/${article.path}`,
          permission: SD_PERMISSION_PUBLIC,
        })),
      })),
    },
    {
      icon: 'widgets',
      title: 'Component',
      children: [
        {
          path: '/component/button',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Button',
        },
        {
          path: '/component/avatar',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Avatar',
        },
        {
          path: '/component/badge',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Badge',
        },
        {
          path: '/component/upload-file',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Upload File',
        },
        {
          path: '/component/table',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Table',
          children: [
            { path: '/component/table/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/component/table/column', permission: SD_PERMISSION_PUBLIC, title: 'Tùy chỉnh cột' },
            { path: '/component/table/filter', permission: SD_PERMISSION_PUBLIC, title: 'Bộ lọc' },
            { path: '/component/table/index-column', permission: SD_PERMISSION_PUBLIC, title: 'Cột STT (index)' },
            { path: '/component/table/tree', permission: SD_PERMISSION_PUBLIC, title: 'Tree (cây)' },
          ],
        },
        {
          path: '/component/preview-image',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Preview Image',
        },
        {
          path: '/component/preview-pdf',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Preview PDF',
        },
        {
          path: '/component/splitter',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Splitter',
        },
        {
          path: '/component/query-bar',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Query Bar',
          children: [
            { path: '/component/query-bar/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/component/query-bar/modes', permission: SD_PERMISSION_PUBLIC, title: 'Modes & Density' },
            { path: '/component/query-bar/fields', permission: SD_PERMISSION_PUBLIC, title: '7 kind field' },
          ],
        },
        {
          path: '/component/modal',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Modal',
          children: [
            { path: '/component/modal/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/component/modal/slots', permission: SD_PERMISSION_PUBLIC, title: 'Header / Footer slots' },
            { path: '/component/modal/view-modes', permission: SD_PERMISSION_PUBLIC, title: 'View modes & Variants' },
          ],
        },
        {
          path: '/component/section',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Section',
          children: [
            { path: '/component/section/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/component/section/section-item', permission: SD_PERMISSION_PUBLIC, title: 'Kết Hợp SdSectionItem' },
            { path: '/component/section/header-slots', permission: SD_PERMISSION_PUBLIC, title: 'Tùy Chỉnh Header' },
          ],
        },
        {
          path: '/component/side-drawer',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Side Drawer',
          children: [
            { path: '/component/side-drawer/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản (Content thuần)' },
            { path: '/component/side-drawer/advanced', permission: SD_PERMISSION_PUBLIC, title: 'Mở rộng (Full Layout)' },
            { path: '/component/side-drawer/custom', permission: SD_PERMISSION_PUBLIC, title: 'Tùy biến (Custom CSS)' },
            { path: '/component/side-drawer/loading', permission: SD_PERMISSION_PUBLIC, title: 'Trạng thái Loading' },
          ],
        },
        {
          path: '/component/anchor',
          permission: SD_PERMISSION_PUBLIC,
          title: 'Anchor',
          children: [
            { path: '/component/anchor/basic', permission: SD_PERMISSION_PUBLIC, title: 'Cơ bản' },
            { path: '/component/anchor/with-section', permission: SD_PERMISSION_PUBLIC, title: 'Với sd-section' },
          ],
        },
      ],
    },
    {
      icon: 'dynamic_form',
      title: 'Form',
      children: [
        { path: '/form/input', permission: SD_PERMISSION_PUBLIC, title: 'Input' },
        { path: '/form/select', permission: SD_PERMISSION_PUBLIC, title: 'Select' },
        { path: '/form/textarea', permission: SD_PERMISSION_PUBLIC, title: 'Textarea' },
        { path: '/form/date', permission: SD_PERMISSION_PUBLIC, title: 'Date' },
        { path: '/form/datetime', permission: SD_PERMISSION_PUBLIC, title: 'Date Time' },
        { path: '/form/input-number', permission: SD_PERMISSION_PUBLIC, title: 'Input Number' },
        { path: '/form/chip', permission: SD_PERMISSION_PUBLIC, title: 'Chip' },
        { path: '/form/chip-calendar', permission: SD_PERMISSION_PUBLIC, title: 'Chip Calendar' },
        { path: '/form/radio', permission: SD_PERMISSION_PUBLIC, title: 'Radio' },
        { path: '/form/checkbox', permission: SD_PERMISSION_PUBLIC, title: 'Checkbox' },
        { path: '/form/switch', permission: SD_PERMISSION_PUBLIC, title: 'Switch' },
        { path: '/form/validation', permission: SD_PERMISSION_PUBLIC, title: 'Validation & hideInlineError' },
      ],
    },
    {
      icon: 'miscellaneous_services',
      title: 'Service',
      children: [
        {
          path: '/service/notify',
          permission: SD_PERMISSION_PUBLIC,
          title: 'NotifyService',
        },
        {
          path: '/service/confirm',
          permission: SD_PERMISSION_PUBLIC,
          title: 'ConfirmService',
          children: [
            { path: '/service/confirm/confirm', permission: SD_PERMISSION_PUBLIC, title: 'Xác nhận (.confirm)' },
            { path: '/service/confirm/with-input', permission: SD_PERMISSION_PUBLIC, title: 'Nhập văn bản (.withInput)' },
            { path: '/service/confirm/with-radio', permission: SD_PERMISSION_PUBLIC, title: 'Lựa chọn (.withRadio)' },
            { path: '/service/confirm/with-date', permission: SD_PERMISSION_PUBLIC, title: 'Chọn ngày (.withDate)' },
          ],
        },
        {
          path: '/service/loading',
          permission: SD_PERMISSION_PUBLIC,
          title: 'LoadingService',
        },
      ],
    },
    {
      icon: 'build',
      title: 'Utility',
      children: [
        { path: '/utility/tooltip', permission: SD_PERMISSION_PUBLIC, title: 'sdTooltip Directive' },
        { path: '/utility/icon', permission: SD_PERMISSION_PUBLIC, title: 'System Icons (Fill/Outline)' },
      ],
    },
    {
      icon: 'dashboard_customize',
      title: 'Pattern',
      children: Object.entries(PATTERN_GROUPS).map(([id, group]) => ({
        title: group.name,
        icon: id === 'table' ? 'table_chart' : id === 'score' ? 'analytics' : 'widgets',
        ...(id === 'header' || id === 'table'
          ? {
              children: group.variants.map(variant => ({
                title: variant[1],
                path: '/pattern/' + PATTERN_PATHS[id] + '/' + variant[0],
                permission: SD_PERMISSION_PUBLIC,
              })),
            }
          : { path: '/pattern/' + PATTERN_PATHS[id] + '/' + group.variants[0][0], permission: SD_PERMISSION_PUBLIC }),
      })),
    },
    {
      icon: 'web',
      title: 'Page',
      children: [
        {
          title: 'List',
          icon: 'view_list',
          children: [...PAGE_EXAMPLES, ...ROLE_EXAMPLES]
            .filter(x => x.group === 'list')
            .map(x => ({
              path: '/page/list/' + x.id,
              title: x.title,
              icon: x.icon,
              permission: SD_PERMISSION_PUBLIC,
            })),
        },
        {
          title: 'Detail',
          icon: 'description',
          children: PAGE_EXAMPLES.filter(x => x.group === 'detail').map(x => ({
            path: '/page/detail/' + x.id,
            title: x.title,
            icon: x.icon,
            permission: SD_PERMISSION_PUBLIC,
          })),
        },
      ],
    },
  ];
}
