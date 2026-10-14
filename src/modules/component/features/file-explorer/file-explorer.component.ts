import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdInform } from '@sdcorejs/angular/components/inform';
import {
  SdFileExplorer,
  SdFileExplorerColumnDef,
  type SdFileExplorerConfig,
  type SdFileExplorerMoveRequest,
  type SdFileExplorerOpenEvent,
} from '@sdcorejs/angular/components/file-explorer';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
import { DemoPropertyComponent } from '../../../../app/components/demo-property/demo-property.component';
import { FileExplorerDemoStore, type ExplorerDemoData, type ExplorerDemoItem } from './file-explorer.data';

@Component({
  selector: 'app-file-explorer-demo',
  standalone: true,
  imports: [
    DemoPropertyComponent,
    SdInform,
    SdButton,
    SdCodeEditor,
    SdFileExplorer,
    SdFileExplorerColumnDef,
    SdSection,
    SdSectionItem,
    SdSwitch,
    SdPageComponent,
  ],
  providers: [FileExplorerDemoStore],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileExplorerDemoComponent {
  readonly store = inject(FileExplorerDemoStore);
  private readonly confirm = inject(SdConfirmService);
  readonly explorer = viewChild<SdFileExplorer<ExplorerDemoData>>(SdFileExplorer);
  readonly selected = signal<readonly ExplorerDemoItem[]>([]);
  readonly inspected = signal<ExplorerDemoItem | null>(null);
  readonly customLabel = signal(true);
  readonly selectionActionsEnabled = signal(true);
  readonly moving = signal(false);
  readonly bulkBusy = signal(false);
  readonly resetVersion = signal(0);
  readonly status = signal('Chọn Brief và Budget để thử hành động nhóm. Locked-notes bị khóa; mở thư mục Đang xử lý để xem ảnh.');
  readonly option: SdFileExplorerConfig<ExplorerDemoData> = {
    autoId: 'candidate-explorer',
    title: 'Kho dự án Nova',
    rootLabel: 'Dự án Nova',
    defaultView: 'list',
    description: 'Dữ liệu hư cấu trong phiên demo · Upload tối đa 1 MB · Metadata bổ sung ở chế độ Danh sách',
    dataSource: {
      onList: ({ parentId, signal }) => this.store.list(parentId, signal),
      onSearch: ({ parentId, keyword, signal }) => this.store.list(parentId, signal, keyword),
    },
    capabilities: {
      preview: { onPreview: ({ item }) => this.store.blob(item.id) },
      download: {
        downloadable: item => !item.data?.locked,
        onDownload: async ({ item, signal, progress }) => {
          await this.store.wait(signal);
          const blob = this.store.blob(item.id);
          progress(blob.size, blob.size);
          return blob;
        },
      },
      share: {
        shareable: item => item.data?.classification !== 'private',
        onShare: async ({ item, signal }) => {
          await this.store.wait(signal);
          return location.origin + '/#demo-share/' + encodeURIComponent(item.id);
        },
      },
      upload: {
        uploadable: () => !this.store.readOnly(),
        onUpload: ({ file, parentId, signal, progress }) => this.store.upload(file, parentId, signal, progress),
      },
    },
    selector: {
      mode: 'actions',
      disabled: item => !!item.data?.locked,
      onSelect: (_item, items) => this.selected.set(items),
      onSelectAll: items => this.selected.set(items),
      onClear: () => this.selected.set([]),
      actions: [
        {
          title: 'Đánh dấu đã xem',
          prefixIcon: 'done_all',
          type: 'outline',
          disabled: () => this.store.readOnly() || this.moving(),
          loading: () => this.bulkBusy(),
          onClick: items => {
            void this.review(items);
          },
        },
        {
          title: 'Chuyển vào Lưu trữ',
          prefixIcon: 'drive_file_move',
          disabled: items => this.store.readOnly() || this.moving() || items.every(item => item.parentId === 'archive'),
          onClick: items => {
            void this.moveToArchive(items);
          },
        },
      ],
    },
    // Có icon thì dùng tooltip để dòng gọn; Core vẫn lấy tooltip làm nhãn trong menu/drawer.
    // Action không có icon cần giữ title để không tạo nút trống.
    fileCommands: [
      { tooltip: 'Thông tin metadata', prefixIcon: 'info', onClick: item => this.inspect(item) },
      {
        tooltip: 'Đánh dấu tệp đã xem',
        prefixIcon: 'done',
        disabled: item => !!item.data?.locked || this.store.readOnly(),
        loading: () => this.bulkBusy(),
        onClick: item => {
          void this.review([item]);
        },
      },
    ],
    folderCommands: [
      {
        tooltip: 'Đếm tài liệu',
        prefixIcon: 'folder_open',
        onClick: item =>
          this.status.set(
            item.name + ' có ' + this.store.rows().filter(row => row.parentId === item.id).length + ' tài liệu trong phiên demo.'
          ),
      },
    ],
    move: { movable: request => this.store.canMove(request), onMove: request => this.move(request) },
  };
  readonly activeOption = computed<SdFileExplorerConfig<ExplorerDemoData>>(() => ({
    ...this.option,
    selector: { ...this.option.selector, actions: this.selectionActionsEnabled() ? this.option.selector?.actions : [] },
  }));
  readonly htmlCode = `<sd-file-explorer [option]="option">
  <ng-template sdFileExplorerColumnDef="owner" [sdFileExplorerColumnFor]="option"
    title="Người phụ trách" width="152px" let-item let-data="data">
    {{ data?.ownerName ?? 'Chưa phân công' }}
  </ng-template>
</sd-file-explorer>`;
  readonly tsCode = `import { SdFileExplorer, SdFileExplorerColumnDef,
  type SdFileExplorerConfig } from '@sdcorejs/angular/components/file-explorer';
type Metadata = { ownerName: string; classification: 'team' | 'private' };
const option: SdFileExplorerConfig<Metadata> = {
  dataSource: { onList: ({ parentId, signal }) => store.list(parentId, signal) },
  selector: { mode: 'actions', actions: [{ title: 'Đánh dấu đã xem',
    onClick: items => store.markReviewed(items) }] },
  move: {
    movable: request => store.canMove(request),
    onMove: async request => { await store.move(request); return true; },
  },
}; // store là consumer của portal; Core không có storage backend.`;

  inspect(item: ExplorerDemoItem): void {
    this.inspected.set(item);
    this.status.set('Metadata của ' + item.name + ' được giữ trong data<ExplorerDemoData>.');
  }
  setSelectionActions(enabled: boolean): void {
    this.selectionActionsEnabled.set(enabled);
    this.selected.set([]);
    this.resetVersion.update(value => value + 1);
    this.status.set(
      enabled ? 'Đã bật hành động chọn tệp.' : 'Không có action chọn tệp; checkbox và thanh chọn được ẩn. Dữ liệu giữ nguyên.'
    );
  }
  onOpen(event: SdFileExplorerOpenEvent<ExplorerDemoData>): void {
    this.inspect(event.item);
  }
  async review(items: readonly ExplorerDemoItem[]): Promise<void> {
    if (this.bulkBusy() || this.store.readOnly()) return;
    this.bulkBusy.set(true);
    try {
      await this.confirm.confirm('Đánh dấu ' + items.length + ' tệp đã xem trong phiên demo?', {
        title: 'Xem tài liệu',
        yesTitle: 'Đánh dấu',
        noTitle: 'Hủy',
      });
      this.store.markReviewed(items);
      this.status.set('Đã cập nhật metadata đã xem cho ' + items.length + ' tệp.');
      this.explorer()?.reload();
    } catch {
      this.status.set('Đã hủy; metadata giữ nguyên.');
    } finally {
      this.bulkBusy.set(false);
    }
  }
  async move(request: SdFileExplorerMoveRequest<ExplorerDemoData>): Promise<boolean> {
    this.moving.set(true);
    try {
      try {
        await this.confirm.confirm(
          'Chuyển ' +
            request.items.length +
            ' tệp vào ' +
            (request.targetFolder?.name ?? 'Dự án Nova') +
            '? Dữ liệu chỉ thay đổi trong phiên demo.',
          { title: 'Di chuyển tài liệu', yesTitle: 'Di chuyển', noTitle: 'Hủy' }
        );
      } catch {
        this.status.set('Đã hủy di chuyển; dữ liệu giữ nguyên.');
        return false;
      }
      await this.store.move(request);
      this.status.set('Đã chuyển ' + request.items.length + ' tệp bằng nguồn ' + request.source + '. Metadata giữ nguyên.');
      return true;
    } finally {
      this.moving.set(false);
    }
  }
  async moveToArchive(items: readonly ExplorerDemoItem[]): Promise<void> {
    const target = this.store.rows().find(item => item.id === 'archive') ?? null;
    await this.explorer()?.moveFiles(items, target, 'api');
  }
  simulateReadError(): void {
    this.store.failReads.set(true);
    this.explorer()?.reload();
  }
  async restoreReads(): Promise<void> {
    this.store.failReads.set(false);
    if (this.store.refreshBlocked()) {
      this.store.refreshBlocked.set(false);
      await this.explorer()?.retryMoveRefresh();
    } else this.explorer()?.reload();
    this.status.set('Đã khôi phục đọc danh sách. Retry refresh không chạy lại mutation.');
  }
  reset(): void {
    this.store.reset();
    this.resetVersion.update(value => value + 1);
    this.selected.set([]);
    this.inspected.set(null);
    this.selectionActionsEnabled.set(true);
    this.status.set('Đã khôi phục seed, metadata và bộ đếm di chuyển.');
  }
}
SdTabComponent({ component: FileExplorerDemoComponent, name: 'File Explorer', icon: 'folder' })(FileExplorerDemoComponent);
