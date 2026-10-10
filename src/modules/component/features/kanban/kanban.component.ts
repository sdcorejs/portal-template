import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import {
  SdKanban,
  SdKanbanCardTemplateDirective,
  type SdKanbanColumn,
  type SdKanbanId,
  type SdKanbanMoveRequest,
  type SdKanbanOption,
} from '@sdcorejs/angular/components/kanban';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { I18nService } from '@sdcorejs/angular/i18n';
import { DemoLabFrameComponent } from '../../../../shared/demo-lab/demo-lab-frame.component';
interface WorkItem {
  id: string;
  titleVi: string;
  titleEn: string;
  column: string;
  owner: string;
  priority: string;
}
const seed = (): WorkItem[] => [
  {
    id: 'OPS-101',
    titleVi: 'Kiểm tra máy quét kho Harbor',
    titleEn: 'Check Harbor warehouse scanners',
    column: 'todo',
    owner: 'Linh',
    priority: 'P1',
  },
  {
    id: 'OPS-102',
    titleVi: 'Chuẩn bị lịch nhận hàng',
    titleEn: 'Prepare receiving schedule',
    column: 'todo',
    owner: 'Minh',
    priority: 'P2',
  },
  {
    id: 'OPS-103',
    titleVi: 'Đối chiếu danh mục thiết bị',
    titleEn: 'Review asset catalogue',
    column: 'review',
    owner: 'An',
    priority: 'P1',
  },
  { id: 'OPS-104', titleVi: 'Hoàn tất sơ đồ nhóm', titleEn: 'Complete team chart', column: 'done', owner: 'Mai', priority: 'P2' },
];
@Component({
  selector: 'app-kanban-demo',
  standalone: true,
  imports: [DemoLabFrameComponent, SdButton, SdKanban, SdKanbanCardTemplateDirective],
  templateUrl: './kanban.component.html',
  styleUrl: '../../../../shared/demo-lab/demo-lab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanDemoComponent {
  readonly i18n = inject(I18nService);
  readonly board = viewChild<SdKanban<WorkItem>>(SdKanban);
  readonly items = signal<readonly WorkItem[]>(seed());
  readonly keyword = signal('');
  readonly collapsed = signal<readonly SdKanbanId[]>([]);
  readonly locked = signal(false);
  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly failNext = signal(false);
  readonly status = signal('ready');
  private epoch = 0;
  readonly columns = computed<readonly SdKanbanColumn[]>(() => [
    { id: 'todo', label: this.t('Cần làm', 'To do'), color: 'primary' },
    { id: 'review', label: this.t('Đang kiểm tra', 'Review'), color: 'warning' },
    { id: 'done', label: this.t('Hoàn tất', 'Done'), color: 'success' },
  ]);
  readonly reviewCount = computed(() => this.items().filter(x => x.column === 'review').length);
  readonly option = computed<SdKanbanOption<WorkItem>>(() => {
    this.i18n.language();
    return {
      getId: item => item.id,
      getColumnId: item => item.column,
      getTitle: item => this.t(item.titleVi, item.titleEn),
      withColumn: (item, columnId) => ({ ...item, column: String(columnId) }),
      getSearchText: item => `${item.id} ${item.titleVi} ${item.titleEn} ${item.owner}`,
      move: request => this.confirmMove(request),
      searchable: true,
      collapsible: true,
    };
  });
  constructor() {
    inject(DestroyRef).onDestroy(() => this.epoch++);
  }
  t(vi: string, en: string): string {
    return this.i18n.language() === 'en' ? en : vi;
  }
  async confirmMove(request: SdKanbanMoveRequest<WorkItem>): Promise<boolean> {
    const fail = this.failNext();
    this.failNext.set(false);
    await new Promise<void>(resolve => setTimeout(resolve, 650));
    if (request.signal.aborted) return false;
    if (fail) {
      this.status.set('rejected');
      throw new Error(this.t('Lỗi lưu giả lập. Thử di chuyển lại.', 'Simulated save failure. Try moving again.'));
    }
    this.status.set('saved');
    return true;
  }
  move(): void {
    void this.board()?.move('OPS-101', 'review', 0, 'api');
  }
  reset(): void {
    this.epoch++;
    this.items.set(seed());
    this.keyword.set('');
    this.collapsed.set([]);
    this.locked.set(false);
    this.loading.set(false);
    this.loadError.set(null);
    this.failNext.set(false);
    this.status.set('ready');
  }
  empty(): void {
    this.epoch++;
    this.items.set([]);
    this.loading.set(false);
    this.loadError.set(null);
    this.status.set('empty');
  }
  async reload(fail = false): Promise<void> {
    const epoch = ++this.epoch;
    this.loading.set(true);
    this.loadError.set(null);
    await new Promise<void>(resolve => setTimeout(resolve, 650));
    if (epoch !== this.epoch) return;
    this.loading.set(false);
    if (fail)
      this.loadError.set(this.t('Danh sách chưa tải được. Thử lại để khôi phục mẫu.', 'Queue unavailable. Retry to restore the sample.'));
    else this.items.set(seed());
  }
}
SdTabComponent({ component: KanbanDemoComponent, name: 'Kanban', icon: 'view_kanban' })(KanbanDemoComponent);
