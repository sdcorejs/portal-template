import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdTree, type SdTreeComponentOption, type SdTreeLoadErrorEvent, type SdTreeItemLazy } from '@sdcorejs/angular/components/tree';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { I18nService } from '@sdcorejs/angular/i18n';
import { DemoLabFrameComponent } from '../../../../shared/demo-lab/demo-lab-frame.component';
interface ServiceItem {
  id: string;
  name: string;
  owner: string;
}
@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [DemoLabFrameComponent, SdButton, SdTree],
  templateUrl: './tree.component.html',
  styleUrl: '../../../../shared/demo-lab/demo-lab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeDemoComponent {
  readonly i18n = inject(I18nService);
  readonly tree = viewChild<SdTree<ServiceItem>>(SdTree);
  readonly selected = signal<ServiceItem[]>([]);
  readonly query = signal('');
  readonly lastError = signal('');
  readonly locked = signal(false);
  readonly mode = signal<'ready' | 'empty' | 'root-error' | 'child-error'>('ready');
  readonly generation = signal(0);
  readonly detail = signal<ServiceItem | null>(null);
  readonly error = computed(
    () =>
      !!this.tree()?.rootError() ||
      (this.tree()
        ?.visibleNodes()
        .some(node => !!node.loadError) ??
        false)
  );
  private failRoot = false;
  private failChild = false;
  private disposed = false;
  readonly option = computed<SdTreeComponentOption<ServiceItem>>(() => {
    const generation = this.generation();
    const empty = this.mode() === 'empty';
    this.i18n.language();
    const wrap = (id: string, vi: string, en: string, hasChildren: boolean): SdTreeItemLazy<ServiceItem> => ({
      id,
      label: this.t(vi, en),
      data: { id, name: this.t(vi, en), owner: id === 'ops' ? 'Linh' : 'Mai' },
      hasChildren,
    });
    return {
      autoId: 'successor-tree',
      items: async () => {
        await this.delay();
        if (generation !== this.generation() || this.disposed) return [];
        if (this.failRoot) {
          this.failRoot = false;
          throw new Error(this.t('Không tải được danh mục.', 'Catalogue load failed.'));
        }
        return empty
          ? []
          : [wrap('ops', 'Vận hành Harbor', 'Harbor operations', true), wrap('support', 'Hỗ trợ dự án', 'Project support', true)];
      },
      tree: {
        loadType: 'lazy',
        onExpandChildren: async item => {
          await this.delay();
          if (generation !== this.generation() || this.disposed) return [];
          if (this.failChild) {
            this.failChild = false;
            throw new Error(this.t('Chưa tải được nhánh. Thử lại.', 'Branch unavailable. Retry.'));
          }
          return item.id === 'ops'
            ? [
                wrap('scanner', 'Kiểm tra máy quét', 'Scanner checks', false),
                wrap('receiving', 'Lịch nhận hàng', 'Receiving schedule', false),
              ]
            : [wrap('assets', 'Danh mục thiết bị', 'Asset catalogue', false)];
        },
      },
      selector: {
        visible: true,
        cascade: 'descendants',
        disabled: () => this.locked(),
        message: items => `${items.length} ${this.t('mục đã chọn', 'selected items')}`,
      },
      showLines: true,
      commands: [
        {
          key: 'detail',
          title: this.t('Xem phụ trách', 'View owner'),
          icon: 'info',
          disabled: () => this.locked(),
          click: item => {
            if (!this.locked()) this.detail.set(item);
          },
        },
      ],
    };
  });
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.disposed = true;
    });
  }
  t(vi: string, en: string): string {
    return this.i18n.language() === 'en' ? en : vi;
  }
  showError(event: SdTreeLoadErrorEvent<ServiceItem>): void {
    this.lastError.set(this.tree()?.errorMessage(event.error) ?? this.t('Không tải được dữ liệu', 'Data load failed'));
  }
  search(value: string): void {
    this.query.set(value);
    this.tree()?.filter(value);
  }
  label(item: ServiceItem): string {
    const labels: Record<string, [string, string]> = {
      ops: ['Vận hành Harbor', 'Harbor operations'],
      support: ['Hỗ trợ dự án', 'Project support'],
      scanner: ['Kiểm tra máy quét', 'Scanner checks'],
      receiving: ['Lịch nhận hàng', 'Receiving schedule'],
      assets: ['Danh mục thiết bị', 'Asset catalogue'],
    };
    const pair = labels[item.id];
    return pair ? this.t(...pair) : item.name;
  }
  private delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  load(mode: 'ready' | 'empty' | 'root-error' | 'child-error'): void {
    this.failRoot = mode === 'root-error';
    this.failChild = mode === 'child-error';
    this.mode.set(mode);
    this.query.set('');
    this.tree()?.filter('');
    this.selected.set([]);
    this.detail.set(null);
    this.generation.update(x => x + 1);
  }
  reset(): void {
    this.locked.set(false);
    this.load('ready');
  }
  select(items: ServiceItem[]): void {
    if (!this.locked()) this.selected.set(items);
  }
}
SdTabComponent({ component: TreeDemoComponent, name: 'Tree', icon: 'account_tree' })(TreeDemoComponent);
