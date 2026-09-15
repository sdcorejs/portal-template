import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';

export const utilityRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      { path: 'icons', redirectTo: 'icon' },
      { path: '', data: { permission: SD_PERMISSION_PUBLIC }, redirectTo: 'tooltip', pathMatch: 'full' },
      {
        path: 'tooltip',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/tooltip/tooltip.component').then(m => m.TooltipDemoComponent),
      },
      {
        path: 'icon',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/icon/icon.component').then(m => m.IconsDemoComponent),
      },
    ],
  },
];
