import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';

export const utilitiesRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      { path: '', data: { permission: SD_PERMISSION_PUBLIC }, redirectTo: 'tooltip', pathMatch: 'full' },
      {
        path: 'tooltip',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/tooltip/tooltip.component').then(m => m.TooltipDemoComponent),
      },
      {
        path: 'icons',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/icons/icons.component').then(m => m.IconsDemoComponent),
      },
    ],
  },
];
