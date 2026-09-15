import { Routes } from '@angular/router';
import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { PATTERN_GROUPS, PATTERN_PATHS } from './catalog/pattern-catalog';
import type { PatternPageComponent } from './pattern-page.component';
export const patternRoutes: Routes = [
  { path: 'header/sidedrawer', pathMatch: 'full', redirectTo: 'header/side-drawer' },
  { path: 'table/filter', pathMatch: 'full', redirectTo: 'table/external-filter' },
  ...Object.entries({
    headers: 'header',
    tables: 'table',
    scores: 'score',
    buttons: 'button',
    forms: 'form',
    drawers: 'drawer',
    compositions: 'composition',
  }).map(([path, redirectTo]) => ({ path, redirectTo })),
  { path: '', pathMatch: 'full', redirectTo: 'header/page' },
  ...['title', 'description', 'detail', 'status', 'actions', 'editing'].map(id => ({
    path: 'header/' + id,
    pathMatch: 'full' as const,
    redirectTo: 'header/page',
  })),
  ...Object.entries(PATTERN_GROUPS).flatMap(([group, meta]) => [
    { path: PATTERN_PATHS[group], pathMatch: 'full' as const, redirectTo: PATTERN_PATHS[group] + '/' + meta.variants[0][0] },
    {
      path: PATTERN_PATHS[group] + '/:variant',
      data: { permission: SD_PERMISSION_PUBLIC, group },
      loadComponent: () => import('./pattern-page.component').then(m => m.PatternPageComponent),
      canDeactivate: [(page: PatternPageComponent) => page.draft.canLeave()],
    },
  ]),
];
