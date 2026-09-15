import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';
import { SdAuthGuard, SdPermissionGuard, SdPortalGuard } from '@sdcorejs/angular/modules';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    redirectTo: 'page',
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
          ...Object.entries({
            pages: 'page',
            components: 'component',
            services: 'service',
            forms: 'form',
            instructions: 'instruction',
            utilities: 'utility',
          }).map(([path, redirectTo]) => ({ path, redirectTo })),
          {
            path: 'patterns',
            redirectTo: 'pattern',
          },
          {
            path: 'pattern',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('../modules/pattern').then(m => m.patternRoutes),
          },
          {
            path: 'layout',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@sdcorejs/angular/modules/layout').then(m => m.SdLayoutModule),
          },
          {
            path: 'page',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('../modules/page').then(m => m.pageRoutes),
          },
          {
            path: 'component',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@component').then(m => m.componentRoutes),
          },
          {
            path: 'service',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@service').then(m => m.serviceRoutes),
          },
          {
            path: 'form',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@form').then(m => m.formRoutes),
          },
          {
            path: 'instruction',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@instruction').then(m => m.instructionRoutes),
          },
          {
            path: 'utility',
            data: { permission: SD_PERMISSION_PUBLIC },
            loadChildren: () => import('@utility').then(m => m.utilityRoutes),
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
