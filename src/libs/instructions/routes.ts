import { Routes } from '@angular/router';

export const instructionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'instroduction',
        loadComponent: () => import('./instroduction/instroduction.component').then(m => m.InstroductionComponent),
      },
      { path: '', redirectTo: 'instroduction', pathMatch: 'full' },
      {
        path: 'custom-theme',
        children: [
          { path: '', redirectTo: 'guide', pathMatch: 'full' },
          {
            path: 'guide',
            loadComponent: () => import('./custom-theme/guide/guide.component').then(m => m.CustomThemeGuideComponent),
          },
          {
            path: 'tool',
            loadComponent: () => import('./custom-theme/tool/tool.component').then(m => m.CustomThemeToolComponent),
          },
        ],
      },
      {
        path: 'portal-config',
        loadComponent: () => import('./portal-config/portal-config.component').then(m => m.PortalConfigComponent),
      },
      {
        path: 'coding-convention',
        children: [
          { path: '', redirectTo: 'scss', pathMatch: 'full' },
          {
            path: 'scss',
            loadComponent: () => import('./coding-conventions/coding-conventions.component').then(m => m.CodingConventionsComponent),
          },
          {
            path: 'typescript',
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
