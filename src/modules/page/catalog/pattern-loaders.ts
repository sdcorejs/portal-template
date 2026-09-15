import type { Type } from '@angular/core';
export const PATTERN_LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  'roles-matrix': () => import('../features/role/pages/role-list-page.component').then(m => m.RoleListPageComponent),
  'roles-tree': () => import('../features/role/pages/role-list-page.component').then(m => m.RoleListPageComponent),
  'list-standard': () => import('../features/list-standard/list-standard.component').then(m => m.ListStandardComponent),
  'list-advanced-filter': () =>
    import('../features/list-advanced-filter/list-advanced-filter.component').then(m => m.ListAdvancedFilterComponent),
  'list-grouped-tree': () => import('../features/list-grouped-tree/list-grouped-tree.component').then(m => m.ListGroupedTreeComponent),
  'list-master-detail': () => import('../features/list-master-detail/list-master-detail.component').then(m => m.ListMasterDetailComponent),
  'detail-overview': () => import('../features/detail-overview/detail-overview.component').then(m => m.DetailOverviewComponent),
  'detail-tabbed': () => import('../features/detail-tabbed/detail-tabbed.component').then(m => m.DetailTabbedComponent),
  'detail-related-records': () =>
    import('../features/detail-related-records/detail-related-records.component').then(m => m.DetailRelatedRecordsComponent),
  'form-simple': () => import('../features/form-simple/form-simple.component').then(m => m.FormSimpleComponent),
  'form-sections': () => import('../features/form-sections/form-sections.component').then(m => m.FormSectionsComponent),
  'form-line-items': () => import('../features/form-line-items/form-line-items.component').then(m => m.FormLineItemsComponent),
  'drawer-compact': () => import('../features/drawer-compact/drawer-compact.component').then(m => m.DrawerCompactComponent),
  'drawer-sections': () => import('../features/drawer-sections/drawer-sections.component').then(m => m.DrawerSectionsComponent),
};
