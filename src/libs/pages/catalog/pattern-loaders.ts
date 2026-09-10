import type { Type } from '@angular/core';
export const PATTERN_LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  'list-standard': () => import('../patterns/list-standard/list-standard.component').then(m => m.ListStandardComponent),
  'list-advanced-filter': () =>
    import('../patterns/list-advanced-filter/list-advanced-filter.component').then(m => m.ListAdvancedFilterComponent),
  'list-grouped-tree': () => import('../patterns/list-grouped-tree/list-grouped-tree.component').then(m => m.ListGroupedTreeComponent),
  'list-master-detail': () => import('../patterns/list-master-detail/list-master-detail.component').then(m => m.ListMasterDetailComponent),
  'detail-overview': () => import('../patterns/detail-overview/detail-overview.component').then(m => m.DetailOverviewComponent),
  'detail-tabbed': () => import('../patterns/detail-tabbed/detail-tabbed.component').then(m => m.DetailTabbedComponent),
  'detail-related-records': () =>
    import('../patterns/detail-related-records/detail-related-records.component').then(m => m.DetailRelatedRecordsComponent),
  'form-simple': () => import('../patterns/form-simple/form-simple.component').then(m => m.FormSimpleComponent),
  'form-sections': () => import('../patterns/form-sections/form-sections.component').then(m => m.FormSectionsComponent),
  'form-line-items': () => import('../patterns/form-line-items/form-line-items.component').then(m => m.FormLineItemsComponent),
  'drawer-compact': () => import('../patterns/drawer-compact/drawer-compact.component').then(m => m.DrawerCompactComponent),
  'drawer-sections': () => import('../patterns/drawer-sections/drawer-sections.component').then(m => m.DrawerSectionsComponent),
};
