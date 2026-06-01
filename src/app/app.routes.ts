import { Routes } from '@angular/router';
import { SdAuthGuard, SdPermissionGuard, SdPortalGuard } from '@sdcorejs/angular/modules';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'layout/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [SdAuthGuard, SdPermissionGuard],
    canActivateChild: [SdPermissionGuard],
    children: [
      {
        path: '',
        canActivate: [SdPortalGuard],
        children: [
          {
            path: 'layout',
            loadChildren: () => import('@sdcorejs/angular/modules/layout').then(m => m.SdLayoutModule),
          },
          {
            path: 'components',
            loadChildren: () => import('@components').then(m => m.componentsRoutes),
          },
          {
            path: 'services',
            loadChildren: () => import('@services').then(m => m.servicesRoutes),
          },
          {
            path: 'forms',
            loadChildren: () => import('@forms').then(m => m.formsRoutes),
          },
          {
            path: 'patterns',
            loadChildren: () => import('@patterns').then(m => m.patternsRoutes),
          },
          {
            path: 'instructions',
            loadChildren: () => import('@instructions').then(m => m.instructionsRoutes),
          },
          {
            path: 'utilities',
            loadChildren: () => import('@utilities').then(m => m.utilitiesRoutes),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'layout/not-found',
    pathMatch: 'full',
  },
];
