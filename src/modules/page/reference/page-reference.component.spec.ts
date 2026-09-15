import { UrlSegment, UrlSegmentGroup } from '@angular/router';
import { pageRoutes } from '../routes';
import { referenceUnsavedGuard } from '../components/unsaved-changes.guard';
import { PAGE_EXAMPLES } from '../catalog/page-examples';
describe('CASE-REFERENCE — business route lifecycle', () => {
  it('guards every editable page and preserves old URLs as redirects', () => {
    const screens = pageRoutes.filter(route => route.loadComponent);
    expect(screens.length).toBe(12);
    expect(screens.every(route => route.canDeactivate?.includes(referenceUnsavedGuard))).toBeTrue();
    expect(screens.every(route => route.data?.['title'] && route.data?.['icon'])).toBeTrue();
    for (const example of PAGE_EXAMPLES) {
      const route = screens.find(route => route.data?.['patternId'] === example.id)!;
      const match = (suffix: string) =>
        route.matcher!(
          (example.group + '/' + example.id + suffix).split('/').map(path => new UrlSegment(path, {})),
          new UrlSegmentGroup([], {}),
          route
        );
      expect(match('')).not.toBeNull();
      expect(match('/create')?.posParams?.['view'].path).toBe('create');
      expect(match('/customer-2/detail')?.posParams?.['recordId'].path).toBe('customer-2');
      expect(match('/customer-2/update')?.posParams?.['view'].path).toBe('update');
      expect(match('/customer-2/delete')).toBeNull();
      expect(route.runGuardsAndResolvers).toBe('always');
      expect(pageRoutes.find(route => route.path === example.id)?.redirectTo).toBe(example.group + '/' + example.id);
    }
  });
});
