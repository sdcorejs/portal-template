import { Routes } from '@angular/router';
import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { PATTERN_GROUPS } from './catalog/pattern-catalog';
import type { PatternPageComponent } from './pattern-page.component';
export const patternsRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'headers/title' },
  ...Object.entries(PATTERN_GROUPS).flatMap(([group, meta]) => [
    { path: group, pathMatch: 'full' as const, redirectTo: group + '/' + meta.variants[0][0] },
    {
      path: group + '/:variant',
      data: { permission: SD_PERMISSION_PUBLIC, group },
      loadComponent: () => import('./pattern-page.component').then(m => m.PatternPageComponent),
      canDeactivate: [(page: PatternPageComponent) => page.draft.canLeave()],
    },
  ]),
];
