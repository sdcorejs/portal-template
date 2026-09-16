import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes, UrlSegment } from '@angular/router';
import { referenceUnsavedGuard } from './components/unsaved-changes.guard';
import { PAGE_EXAMPLES } from './catalog/page-examples';
import { ROLE_EXAMPLES } from './features/role/data/role.model';
export const pageRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'company' },
  { path: 'list', pathMatch: 'full', redirectTo: 'company' },
  { path: 'detail', pathMatch: 'full', redirectTo: 'customer' },
  ...[...PAGE_EXAMPLES, ...ROLE_EXAMPLES].flatMap(example =>
    [example.group + '/' + example.id, example.id].flatMap(legacy =>
      ['', '/create', '/:id/detail', '/:id/update'].map(suffix => ({
        path: legacy + suffix,
        pathMatch: 'full' as const,
        redirectTo: example.path + suffix,
      }))
    )
  ),
  ...ROLE_EXAMPLES.map(example => ({
    path: example.path,
    data: { permission: SD_PERMISSION_PUBLIC, roleLayout: example.layout },
    children: [
      {
        path: '',
        pathMatch: 'full' as const,
        loadComponent: () => import('./features/role/pages/role-list-page.component').then(m => m.RoleListPageComponent),
      },
      ...(['create', 'detail', 'update'] as const).map(mode => ({
        path: mode === 'create' ? 'create' : ':id/' + mode,
        data: { roleMode: mode },
        loadComponent: () => import('./features/role/pages/role-record-page.component').then(m => m.RoleRecordPageComponent),
        canDeactivate: [referenceUnsavedGuard],
        runGuardsAndResolvers: 'always' as const,
      })),
    ],
  })),
  ...PAGE_EXAMPLES.map(example => ({
    matcher: segments => {
      const prefix = example.path.split('/');
      if (!prefix.every((part, index) => segments[index]?.path === part)) return null;
      const rest = segments.slice(prefix.length);
      if (!rest.length) return { consumed: segments };
      if (rest.length === 1 && rest[0].path === 'create') return { consumed: segments, posParams: { view: rest[0] } };
      if (rest.length === 2 && ['detail', 'update'].includes(rest[1].path))
        return { consumed: segments, posParams: { recordId: rest[0], view: new UrlSegment(rest[1].path, {}) } };
      return null;
    },
    runGuardsAndResolvers: 'always' as const,
    data: {
      permission: SD_PERMISSION_PUBLIC,
      patternId: example.id,
      title: example.title,
      icon: example.icon,
      description: example.description,
    },
    loadComponent: () => import('./reference/page-reference.component').then(m => m.PageReferenceComponent),
    canDeactivate: [referenceUnsavedGuard],
  })),
];
