import { ChangeDetectionStrategy, Component, DestroyRef, Type, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdUnsavedChangesService } from '@sdcorejs/angular/services/unsaved-changes';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { PAGE_PATTERNS } from '../catalog/pattern-registry';
import { PATTERN_LOADERS } from '../catalog/pattern-loaders';
import { PageNavigation, RecordView } from './page-navigation';
import { DemoSessionStore } from '../data/demo-session.store';
import { DemoHostComponent } from './demo-host.component';
@Component({
  selector: 'app-page-reference',
  providers: [DemoSessionStore, SdUnsavedChangesService, PageNavigation],
  imports: [SdDataState, DemoHostComponent],
  templateUrl: './page-reference.component.html',
  styleUrl: './page-reference.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageReferenceComponent {
  readonly store = inject(DemoSessionStore);
  readonly unsaved = inject(SdUnsavedChangesService);
  readonly component = signal<Type<unknown> | null>(null);
  readonly loadError = signal('');
  readonly destroy = inject(DestroyRef);
  readonly navigation = inject(PageNavigation);
  readonly route = inject(ActivatedRoute);
  private request = 0;
  private loaded = false;
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      void this.load(this.route.snapshot.data['patternId'], params.get('view') as RecordView | null, params.get('recordId'));
    });
  }
  async load(id: string, view: RecordView | null, recordId: string | null) {
    const request = ++this.request;
    const pattern = PAGE_PATTERNS.find(p => p.id === id);
    if (!pattern) {
      this.loadError.set('Không tìm thấy trang.');
      return;
    }
    this.navigation.baseUrl = pattern.route;
    this.navigation.listShell = id.startsWith('list-') || id.startsWith('drawer-');
    this.loadError.set('');
    try {
      let component = this.component();
      if (!this.loaded) {
        const result = await Promise.all([PATTERN_LOADERS[id](), this.store.openSession(pattern.entityKind)]);
        if (request !== this.request || this.destroy.destroyed) return;
        component = id.startsWith('form-')
          ? (await import('../patterns/detail-overview/detail-overview.component')).DetailOverviewComponent
          : result[0];
        this.loaded = true;
        this.store.formLayout.set(id === 'form-simple' ? 'simple' : id === 'form-line-items' ? 'lines' : 'sections');
      } else {
        await this.store.wait(view === 'create' ? 'Đang chuẩn bị hồ sơ…' : 'Đang mở hồ sơ…');
      }
      if (request !== this.request || this.destroy.destroyed) return;
      if (!view && !this.navigation.listShell) {
        this.component.set(component);
        await this.navigation.go('detail', this.store.selectedId(), true);
        return;
      }
      this.store.selectedId.set(recordId);
      this.store.mode.set(view === 'create' || view === 'update' ? view : 'detail');
      this.navigation.view.set(view ?? 'list');
      this.component.set(component);
    } catch {
      if (!this.destroy.destroyed) this.loadError.set('Không thể tải dữ liệu. Vui lòng tải lại trang.');
    }
  }
  canLeave() {
    return this.unsaved.confirmLeave({ scope: this.store, reason: 'navigation' });
  }
}
SdTabComponent({
  component: PageReferenceComponent,
  name: args => args.data?.['title'] ?? 'Hồ sơ',
  icon: args => args.data?.['icon'] ?? 'description',
})(PageReferenceComponent);
