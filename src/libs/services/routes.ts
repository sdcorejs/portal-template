import { Routes } from '@angular/router';

export const servicesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'notify',
        loadComponent: () => import('./notify/notify.component').then(m => m.NotifyDemoComponent),
      },
      {
        path: 'loading',
        loadComponent: () => import('./loading/loading.component').then(m => m.LoadingDemoComponent),
      },
      {
        path: 'confirm',
        children: [
          {
            path: '',
            redirectTo: 'confirm',
            pathMatch: 'full',
          },
          {
            path: 'confirm',
            loadComponent: () => import('./confirm/confirm/confirm.component').then(m => m.ConfirmBasicComponent),
          },
          {
            path: 'with-input',
            loadComponent: () => import('./confirm/with-input/with-input.component').then(m => m.ConfirmWithInputComponent),
          },
          {
            path: 'with-radio',
            loadComponent: () => import('./confirm/with-radio/with-radio.component').then(m => m.ConfirmWithRadioComponent),
          },
          {
            path: 'with-date',
            loadComponent: () => import('./confirm/with-date/with-date.component').then(m => m.ConfirmWithDateComponent),
          },
        ],
      },
      // Add services routes here (e.g. notifyService, loadingService)
    ],
  },
];
