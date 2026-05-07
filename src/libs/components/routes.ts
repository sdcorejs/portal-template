import { Routes } from '@angular/router';

export const componentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'button',
        loadComponent: () => import('./button/button.component').then(m => m.ButtonDemoComponent),
      },
      {
        path: 'avatar',
        loadComponent: () => import('./avatar/avatar.component').then(m => m.AvatarDemoComponent),
      },
      {
        path: 'badge',
        loadComponent: () => import('./badge/badge.component').then(m => m.BadgeDemoComponent),
      },
      {
        path: 'upload-file',
        loadComponent: () => import('./upload-file/upload-file.component').then(m => m.UploadFileDemoComponent),
      },
      {
        path: 'side-drawer',
        children: [
          {
            path: '',
            redirectTo: 'basic',
            pathMatch: 'full'
          },
          {
            path: 'basic',
            loadComponent: () => import('./side-drawer/basic/basic.component').then(m => m.SideDrawerBasicComponent),
          },
          {
            path: 'advanced',
            loadComponent: () => import('./side-drawer/advanced/advanced.component').then(m => m.SideDrawerAdvancedComponent),
          },
          {
            path: 'custom',
            loadComponent: () => import('./side-drawer/custom/custom.component').then(m => m.SideDrawerCustomComponent),
          },
          {
            path: 'loading',
            loadComponent: () => import('./side-drawer/loading/loading.component').then(m => m.SideDrawerLoadingComponent),
          }
        ]
      },
      {
        path: 'table',
        children: [
          {
            path: '',
            redirectTo: 'basic',
            pathMatch: 'full',
          },
          {
            path: 'basic',
            loadComponent: () => import('./table/basic/basic.component').then(m => m.TableBasicComponent),
          },
          {
            path: 'filter',
            loadComponent: () => import('./table/filter/filter.component').then(m => m.TableFilterComponent),
          },
        ],
      },
      {
        path: 'section',
        children: [
          {
            path: '',
            redirectTo: 'basic',
            pathMatch: 'full',
          },
          {
            path: 'basic',
            loadComponent: () => import('./section/basic/basic.component').then(m => m.SectionBasicComponent),
          },
          {
            path: 'section-item',
            loadComponent: () => import('./section/section-item/section-item.component').then(m => m.SectionItemDemoComponent),
          },
          {
            path: 'header-slots',
            loadComponent: () => import('./section/header-slots/header-slots.component').then(m => m.SectionHeaderSlotsComponent),
          },
        ],
      },
      {
        path: 'anchor-v2',
        children: [
          {
            path: '',
            redirectTo: 'basic',
            pathMatch: 'full',
          },
          {
            path: 'basic',
            loadComponent: () => import('./anchor-v2/basic/basic.component').then(m => m.AnchorV2BasicComponent),
          },
          {
            path: 'with-section',
            loadComponent: () => import('./anchor-v2/with-section/with-section.component').then(m => m.AnchorV2WithSectionComponent),
          },
        ],
      },
      // Add other components routes here
    ],
  },
];
