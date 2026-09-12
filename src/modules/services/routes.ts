import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';

export const servicesRoutes: Routes = [
  {
    path: 'unsaved-changes',
    data: { permission: SD_PERMISSION_PUBLIC },
    loadComponent: () => import('./features/unsaved-changes/unsaved-changes.component').then(m => m.UnsavedChangesComponent),
  },
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      {
        path: 'notify',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/notify/notify.component').then(m => m.NotifyDemoComponent),
      },
      {
        path: 'loading',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/loading/loading.component').then(m => m.LoadingDemoComponent),
      },
      {
        path: 'confirm',
        data: { permission: SD_PERMISSION_PUBLIC },
        children: [
          {
            path: '',
            data: { permission: SD_PERMISSION_PUBLIC },
            redirectTo: 'confirm',
            pathMatch: 'full',
          },
          {
            path: 'confirm',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/confirm/confirm/confirm.component').then(m => m.ConfirmBasicComponent),
          },
          {
            path: 'with-input',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/confirm/with-input/with-input.component').then(m => m.ConfirmWithInputComponent),
          },
          {
            path: 'with-radio',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/confirm/with-radio/with-radio.component').then(m => m.ConfirmWithRadioComponent),
          },
          {
            path: 'with-date',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadComponent: () => import('./features/confirm/with-date/with-date.component').then(m => m.ConfirmWithDateComponent),
          },
        ],
      },
      // Add services routes here (e.g. notifyService, loadingService)
    ],
  },
];
