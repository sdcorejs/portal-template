import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';

export const instructionsRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      {
        path: 'instroduction',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./instroduction/instroduction.component').then(m => m.InstroductionComponent),
      },
      { path: '', data: { permission: SD_PERMISSION_PUBLIC }, redirectTo: 'instroduction', pathMatch: 'full' },
      {
        path: 'custom-theme',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          { path: '', data: { permission: SD_PERMISSION_PUBLIC }, redirectTo: 'guide', pathMatch: 'full' },
          {
            path: 'guide',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./custom-theme/guide/guide.component').then(m => m.CustomThemeGuideComponent),
          },
          {
            path: 'tool',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./custom-theme/tool/tool.component').then(m => m.CustomThemeToolComponent),
          },
        ],
      },
      {
        path: 'portal-config',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./portal-config/portal-config.component').then(m => m.PortalConfigComponent),
      },
      {
        path: 'coding-convention',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          { path: '', data: { permission: SD_PERMISSION_PUBLIC }, redirectTo: 'scss', pathMatch: 'full' },
          {
            path: 'scss',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./coding-conventions/coding-conventions.component').then(m => m.CodingConventionsComponent),
          },
          {
            path: 'typescript',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () =>
              import('./coding-conventions-typescript/coding-conventions-typescript.component').then(
                m => m.CodingConventionsTypescriptComponent
              ),
          },
        ],
      },
    ],
  },
];
