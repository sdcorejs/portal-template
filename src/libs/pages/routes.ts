import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes, UrlSegment } from '@angular/router';
import { referenceUnsavedGuard } from './components/unsaved-changes.guard';
import { PAGE_EXAMPLES } from './catalog/page-examples';
export const pagesRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list/list-standard' },
  { path: 'list', pathMatch: 'full', redirectTo: 'list/list-standard' },
  { path: 'detail', pathMatch: 'full', redirectTo: 'detail/detail-overview' },
  ...PAGE_EXAMPLES.map(example => ({
    matcher: segments => {
      if (segments[0]?.path !== example.group || segments[1]?.path !== example.id) return null;
      const rest = segments.slice(2);
      if (!rest.length) return { consumed: segments };
      if (rest.length === 1 && rest[0].path === 'create') return { consumed: segments, posParams: { view: rest[0] } };
      if (rest.length === 2 && ['detail', 'update'].includes(rest[1].path))
        return { consumed: segments, posParams: { recordId: rest[0], view: new UrlSegment(rest[1].path, {}) } };
      return null;
    },
    runGuardsAndResolvers: 'always' as const,
    data: { permission: SD_PERMISSION_PUBLIC, patternId: example.id, title: example.title, icon: example.icon },
    loadComponent: () => import('./reference/page-reference.component').then(m => m.PageReferenceComponent),
    canDeactivate: [referenceUnsavedGuard],
  })),
  ...PAGE_EXAMPLES.map(example => ({ path: example.id, pathMatch: 'full' as const, redirectTo: example.group + '/' + example.id })),
];
