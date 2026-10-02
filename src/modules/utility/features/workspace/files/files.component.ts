import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import {
  SdFileExplorer,
  type SdFileExplorerListArgs,
  type SdFileExplorerOpenEvent,
  type SdFileExplorerOption,
} from '@sdcorejs/angular/components/file-explorer';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { WorkspaceStore } from '../data/workspace.store';

@Component({
  selector: 'app-workspace-files',
  standalone: true,
  imports: [SdFileExplorer, SdButton, SdSwitch],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceFilesComponent {
  readonly store = inject(WorkspaceStore);
  readonly explorer = viewChild(SdFileExplorer);
  readonly readOnly = signal(false);
  readonly failNextLoad = signal(false);
  readonly opened = signal('Mở thư mục Tài liệu tham khảo để xem ảnh concept; thử tải file, tạo folder hoặc chuyển Grid.');
  readonly list = async ({ parentId, signal }: SdFileExplorerListArgs) => {
    // reload() lists the visible folder and expanded tree nodes in the same turn.
    // Capture the simulation per request so a tree refresh cannot consume the visible folder's failure.
    const fail = this.failNextLoad();
    await this.store.wait(signal);
    if (fail) {
      throw new Error('Mô phỏng lỗi đọc thư mục. Bấm Thử lại để khôi phục.');
    }
    return this.store.files().filter(item => item.parentId === parentId);
  };
  readonly option = computed<SdFileExplorerOption>(() => ({
    autoId: 'workspace-files',
    title: 'Kho tài liệu',
    rootLabel: 'Workspace',
    defaultView: 'list',
    description: 'TXT, JSON, CSV, PDF và ảnh · tối đa 5 MB/file · bộ nhớ cục bộ',
    list: this.list,
    preview: ({ item }) => this.store.content(item.id),
    download: async ({ item, progress, signal }) => {
      await this.store.wait(signal);
      const blob = this.store.content(item.id);
      progress(blob.size, blob.size);
      return blob;
    },
    upload: this.readOnly() ? undefined : ({ file, parentId, signal, progress }) => this.store.addFile(file, parentId, signal, progress),
    createFolder: this.readOnly() ? undefined : ({ parentId, name }) => this.store.createFolder(parentId, name),
  }));
  simulateError(): void {
    this.failNextLoad.set(true);
    this.explorer()?.reload();
    this.failNextLoad.set(false);
  }
  onOpen(event: SdFileExplorerOpenEvent): void {
    this.opened.set('Đang xem ' + event.item.name + ' · ' + (event.path.map(folder => folder.name).join(' / ') || 'Workspace'));
  }
}
