import { PageNavigation } from '../reference/page-navigation';
import { TestBed } from '@angular/core/testing';
import { ListStandardComponent } from './list-standard/list-standard.component';
import { ListGroupedTreeComponent } from './list-grouped-tree/list-grouped-tree.component';
import { DemoSessionStore } from '../data/demo-session.store';
describe('CASE-LIST — selection context and hierarchy', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [DemoSessionStore, PageNavigation] }));
  it('keeps table configuration stable when session records change so applied filters survive', () => {
    const store = TestBed.inject(DemoSessionStore);
    store.reset();
    const f = TestBed.createComponent(ListStandardComponent);
    const option = f.componentInstance.option();
    store.records.set(store.records().map((row, index) => (index === 0 ? { ...row, name: 'Tên đã cập nhật' } : row)));
    expect(f.componentInstance.option()).toBe(option);
    if (option.type === 'local') expect(option.items()).toEqual(store.records());
    f.destroy();
  });
  it('configures a static two-level tree with stable row identity', async () => {
    const store = TestBed.inject(DemoSessionStore);
    store.reset('product');
    const f = TestBed.createComponent(ListGroupedTreeComponent);
    const option = f.componentInstance.treeOption();
    expect(option.rowKey).toBe('id');
    expect(option.tree?.loadType).toBe('static');
    f.destroy();
  });
});
