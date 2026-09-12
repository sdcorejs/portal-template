import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';
import { SdAuthGuard, SdPermissionGuard, SdPortalGuard } from '@sdcorejs/angular/modules';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    redirectTo: 'pages',
    pathMatch: 'full',
  },
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    component: MainComponent,
    canActivate: [SdAuthGuard, SdPermissionGuard],
    canActivateChild: [SdPermissionGuard],
    children: [
      {
        path: '',
        data: { permission: SD_PERMISSION_PUBLIC },
        canActivate: [SdPortalGuard],
        children: [
          {
            path: 'layout',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@sdcorejs/angular/modules/layout').then(m => m.SdLayoutModule),
          },
          {
            path: 'pages',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('../modules/pages').then(m => m.pagesRoutes),
          },
          {
            path: 'components',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@components').then(m => m.componentsRoutes),
          },
          {
            path: 'services',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@services').then(m => m.servicesRoutes),
          },
          {
            path: 'forms',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@forms').then(m => m.formsRoutes),
          },
          {
            path: 'instructions',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@instructions').then(m => m.instructionsRoutes),
          },
          {
            path: 'utilities',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@utilities').then(m => m.utilitiesRoutes),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    data: { permission: SD_PERMISSION_PUBLIC },
    redirectTo: 'layout/not-found',
    pathMatch: 'full',
  },
];
