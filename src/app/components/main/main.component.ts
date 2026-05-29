import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SdLayoutComponent, SdLayoutMenu } from '@sd-angular/core/modules';
import { SdTabRouterOutletComponent } from '@sd-angular/core/components';
@Component({
  selector: 'app-main',
  imports: [SdLayoutComponent, RouterOutlet, SdTabRouterOutletComponent],
  templateUrl: './main.component.html',
})
export class MainComponent {
  menus: SdLayoutMenu[] = [
    {
      icon: 'school',
      title: 'Instructions',
      children: [
        {
          path: '/instructions/instroduction',
          title: 'Instroduction',
        },
        {
          path: '/instructions/custom-theme',
          title: 'Tùy chỉnh Theme',
          children: [
            { path: '/instructions/custom-theme/guide', title: 'Hướng dẫn' },
            { path: '/instructions/custom-theme/tool', title: 'Công cụ' },
          ],
        },
        {
          path: '/instructions/coding-convention',
          title: 'Coding Conventions',
          children: [
            { path: '/instructions/coding-convention/scss', title: 'CSS/SCSS' },
            { path: '/instructions/coding-convention/typescript', title: 'TypeScript' },
          ],
        },
      ],
    },
    {
      icon: 'widgets',
      title: 'Components',
      children: [
        {
          path: '/components/button',
          title: 'Button',
        },
        {
          path: '/components/avatar',
          title: 'Avatar',
        },
        {
          path: '/components/badge',
          title: 'Badge',
        },
        {
          path: '/components/upload-file',
          title: 'Upload File',
        },
        {
          path: '/components/table',
          title: 'Table',
          children: [
            { path: '/components/table/basic', title: 'Cơ bản' },
            { path: '/components/table/column', title: 'Tùy chỉnh cột' },
            { path: '/components/table/filter', title: 'Bộ lọc' },
            { path: '/components/table/index-column', title: 'Cột STT (index)' },
            { path: '/components/table/tree', title: 'Tree (cây)' },
          ],
        },
        {
          path: '/components/preview-image',
          title: 'Preview Image',
        },
        {
          path: '/components/preview-pdf',
          title: 'Preview PDF',
        },
        {
          path: '/components/splitter',
          title: 'Splitter',
        },
        {
          path: '/components/query-bar',
          title: 'Query Bar',
          children: [
            { path: '/components/query-bar/basic', title: 'Cơ bản' },
            { path: '/components/query-bar/modes', title: 'Modes & Density' },
            { path: '/components/query-bar/fields', title: '7 kind field' },
          ],
        },
        {
          path: '/components/modal',
          title: 'Modal',
          children: [
            { path: '/components/modal/basic', title: 'Cơ bản' },
            { path: '/components/modal/slots', title: 'Header / Footer slots' },
            { path: '/components/modal/view-modes', title: 'View modes & Variants' },
          ],
        },
        {
          path: '/components/section',
          title: 'Section',
          children: [
            { path: '/components/section/basic', title: 'Cơ bản' },
            { path: '/components/section/section-item', title: 'Kết Hợp SdSectionItem' },
            { path: '/components/section/header-slots', title: 'Tùy Chỉnh Header' },
          ],
        },
        {
          path: '/components/side-drawer',
          title: 'Side Drawer',
          children: [
            { path: '/components/side-drawer/basic', title: 'Cơ bản (Content thuần)' },
            { path: '/components/side-drawer/advanced', title: 'Mở rộng (Full Layout)' },
            { path: '/components/side-drawer/custom', title: 'Tùy biến (Custom CSS)' },
            { path: '/components/side-drawer/loading', title: 'Trạng thái Loading' },
          ],
        },
        {
          path: '/components/anchor',
          title: 'Anchor',
          children: [
            { path: '/components/anchor/basic', title: 'Cơ bản' },
            { path: '/components/anchor/with-section', title: 'Với sd-section' },
          ],
        },
      ],
    },
    {
      icon: 'dynamic_form',
      title: 'Forms',
      children: [
        { path: '/forms/input', title: 'Input' },
        { path: '/forms/select', title: 'Select' },
        { path: '/forms/textarea', title: 'Textarea' },
        { path: '/forms/date', title: 'Date' },
        { path: '/forms/datetime', title: 'Date Time' },
        { path: '/forms/input-number', title: 'Input Number' },
        { path: '/forms/chip', title: 'Chip' },
        { path: '/forms/chip-calendar', title: 'Chip Calendar' },
        { path: '/forms/radio', title: 'Radio' },
        { path: '/forms/checkbox', title: 'Checkbox' },
        { path: '/forms/switch', title: 'Switch' },
        { path: '/forms/validation', title: 'Validation & hideInlineError' },
      ],
    },
    {
      icon: 'miscellaneous_services',
      title: 'Services',
      children: [
        {
          path: '/services/notify',
          title: 'NotifyService',
        },
        {
          path: '/services/confirm',
          title: 'ConfirmService',
          children: [
            { path: '/services/confirm/confirm', title: 'Xác nhận (.confirm)' },
            { path: '/services/confirm/with-input', title: 'Nhập văn bản (.withInput)' },
            { path: '/services/confirm/with-radio', title: 'Lựa chọn (.withRadio)' },
            { path: '/services/confirm/with-date', title: 'Chọn ngày (.withDate)' },
          ],
        },
        {
          path: '/services/loading',
          title: 'LoadingService',
        },
      ],
    },
    {
      icon: 'build',
      title: 'Utilities',
      children: [
        { path: '/utilities/tooltip', title: 'sdTooltip Directive' },
        { path: '/utilities/icons', title: 'System Icons (Fill/Outline)' },
      ],
    },
    {
      icon: 'layers',
      title: 'Patterns',
      children: [
        {
          path: '/patterns/list',
          title: 'Danh sách',
          children: [{ path: '/patterns/list/base', title: 'Cơ bản' }],
        },
      ],
    },
  ];
}
