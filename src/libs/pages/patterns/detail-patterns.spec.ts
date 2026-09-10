import { PageNavigation } from '../reference/page-navigation';
import { TestBed } from '@angular/core/testing';
import { DetailOverviewComponent } from './detail-overview/detail-overview.component';
import { DemoSessionStore } from '../data/demo-session.store';
describe('CASE-DETAIL — stale selection', () => {
  it('shows no unrelated fallback record for a stale ID', () => {
    TestBed.configureTestingModule({ providers: [DemoSessionStore, PageNavigation] });
    const store = TestBed.inject(DemoSessionStore);
    store.reset();
    store.selectedId.set('missing');
    const f = TestBed.createComponent(DetailOverviewComponent);
    expect(f.componentInstance.entity()).toBeUndefined();
    f.destroy();
  });
});
