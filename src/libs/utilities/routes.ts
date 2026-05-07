import { Routes } from '@angular/router';

export const utilitiesRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'tooltip', pathMatch: 'full' },
      {
        path: 'tooltip',
        loadComponent: () => import('./tooltip/tooltip.component').then(m => m.TooltipDemoComponent),
      },
      {
        path: 'icons',
        loadComponent: () => import('./icons/icons.component').then(m => m.IconsDemoComponent),
      },
    ],
  },
];
