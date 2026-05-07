import { Routes } from '@angular/router';

export const patternsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        children: [
          {
            path: '',
            redirectTo: 'base',
            pathMatch: 'full',
          },
          {
            path: 'base',
            loadComponent: () => import('./list/base/base.component').then(m => m.ListBaseComponent),
          },
        ],
      },
      {
        path: 'page-builder',
        loadComponent: () => import('./page-builder/page-builder.component').then(m => m.PageBuilderComponent),
      },
    ],
  },
];
