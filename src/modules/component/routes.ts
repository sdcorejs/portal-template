import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';

export const componentRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      {
        path: 'button',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/button/button.component').then(m => m.ButtonDemoComponent),
      },
      {
        path: 'avatar',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/avatar/avatar.component').then(m => m.AvatarDemoComponent),
      },
      {
        path: 'badge',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/badge/badge.component').then(m => m.BadgeDemoComponent),
      },
      {
        path: 'upload-file',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/upload-file/upload-file.component').then(m => m.UploadFileDemoComponent),
      },
      {
        path: 'side-drawer',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          {
            path: '',
            data: { permission: SD_PERMISSION_PUBLIC },
            redirectTo: 'basic',
            pathMatch: 'full',
          },
          {
            path: 'basic',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/side-drawer/basic/basic.component').then(m => m.SideDrawerBasicComponent),
          },
          {
            path: 'advanced',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/side-drawer/advanced/advanced.component').then(m => m.SideDrawerAdvancedComponent),
          },
          {
            path: 'custom',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/side-drawer/custom/custom.component').then(m => m.SideDrawerCustomComponent),
          },
          {
            path: 'loading',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/side-drawer/loading/loading.component').then(m => m.SideDrawerLoadingComponent),
          },
        ],
      },
      {
        path: 'table',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          {
            path: '',
            data: { permission: SD_PERMISSION_PUBLIC },
            redirectTo: 'basic',
            pathMatch: 'full',
          },
          {
            path: 'basic',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/table/basic/basic.component').then(m => m.TableBasicComponent),
          },
          {
            path: 'column',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/table/column/column.component').then(m => m.TableColumnComponent),
          },
          {
            path: 'filter',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/table/filter/filter.component').then(m => m.TableFilterComponent),
          },
          {
            path: 'index-column',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/table/index-column/index-column.component').then(m => m.TableIndexColumnComponent),
          },
          {
            path: 'tree',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/table/tree/tree.component').then(m => m.TableTreeComponent),
          },
        ],
      },
      {
        path: 'preview-image',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/preview-image/preview-image.component').then(m => m.PreviewImageDemoComponent),
      },
      {
        path: 'preview-pdf',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/preview-pdf/preview-pdf.component').then(m => m.PreviewPdfDemoComponent),
      },
      {
        path: 'splitter',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/splitter/splitter.component').then(m => m.SplitterDemoComponent),
      },
      {
        path: 'query-bar',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          { path: '', data: { permission: SD_PERMISSION_PUBLIC }, redirectTo: 'basic', pathMatch: 'full' },
          {
            path: 'basic',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/query-bar/basic/basic.component').then(m => m.QueryBarBasicComponent),
          },
          {
            path: 'modes',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/query-bar/modes/modes.component').then(m => m.QueryBarModesComponent),
          },
          {
            path: 'fields',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/query-bar/fields/fields.component').then(m => m.QueryBarFieldsComponent),
          },
        ],
      },
      {
        path: 'modal',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          { path: '', data: { permission: SD_PERMISSION_PUBLIC }, redirectTo: 'basic', pathMatch: 'full' },
          {
            path: 'basic',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/modal/basic/basic.component').then(m => m.ModalBasicComponent),
          },
          {
            path: 'slots',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/modal/slots/slots.component').then(m => m.ModalSlotsComponent),
          },
          {
            path: 'view-modes',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/modal/view-modes/view-modes.component').then(m => m.ModalViewModesComponent),
          },
        ],
      },
      {
        path: 'section',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          {
            path: '',
            data: { permission: SD_PERMISSION_PUBLIC },
            redirectTo: 'basic',
            pathMatch: 'full',
          },
          {
            path: 'basic',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/section/basic/basic.component').then(m => m.SectionBasicComponent),
          },
          {
            path: 'section-item',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/section/section-item/section-item.component').then(m => m.SectionItemDemoComponent),
          },
          {
            path: 'header-slots',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/section/header-slots/header-slots.component').then(m => m.SectionHeaderSlotsComponent),
          },
        ],
      },
      {
        path: 'anchor',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          {
            path: '',
            data: { permission: SD_PERMISSION_PUBLIC },
            redirectTo: 'basic',
            pathMatch: 'full',
          },
          {
            path: 'basic',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/anchor/basic/basic.component').then(m => m.AnchorBasicComponent),
          },
          {
            path: 'with-section',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/anchor/with-section/with-section.component').then(m => m.AnchorWithSectionComponent),
          },
        ],
      },
      // Add other components routes here
    ],
  },
];
