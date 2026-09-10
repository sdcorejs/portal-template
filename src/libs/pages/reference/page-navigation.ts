import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DemoSessionStore } from '../data/demo-session.store';
export type RecordView = 'list' | 'detail' | 'create' | 'update';
/** URL is the source of truth; components request navigation and never switch view independently. */
@Injectable()
export class PageNavigation {
  readonly router = inject(Router, { optional: true });
  readonly store = inject(DemoSessionStore);
  readonly view = signal<RecordView>('list');
  baseUrl = '';
  listShell = true;
  href(view: RecordView, id = this.store.selectedId()): string {
    if (view === 'list') return this.baseUrl;
    if (view === 'create') return this.baseUrl + '/create';
    return this.baseUrl + '/' + encodeURIComponent(id ?? 'missing') + '/' + view;
  }
  go(view: RecordView, id = this.store.selectedId(), replaceUrl = false) {
    return this.router?.navigateByUrl(this.href(view, id), { replaceUrl }) ?? Promise.resolve(false);
  }
  openLink(event: MouseEvent, id: string) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopPropagation();
    void this.go('detail', id);
  }
  backToList() {
    if (this.listShell) return this.go('list');
    const lists: Record<string, string> = {
      customer: '/pages/list/list-standard',
      order: '/pages/list/list-advanced-filter',
      product: '/pages/list/list-grouped-tree',
      ticket: '/pages/list/list-master-detail',
      category: '/pages/detail/drawer-compact',
      contact: '/pages/detail/drawer-sections',
    };
    return this.router?.navigateByUrl(lists[this.store.kind] ?? '/pages') ?? Promise.resolve(false);
  }
  backFromForm() {
    return this.view() === 'update' ? this.go('detail') : this.backToList();
  }
}
