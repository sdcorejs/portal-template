import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { SdHistoryItem } from '@sdcorejs/angular/components/history';
import { SdAuditDiff, type SdAuditDiffOptions } from '@sdcorejs/angular/components/audit-diff';
import { SdJobProgress } from '@sdcorejs/angular/components/job-progress';
import type { SdTaskState } from '@sdcorejs/angular/services/task';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { BrowserUtilities } from '@sdcorejs/utils/fns';
import { WorkspaceStore } from '../data/workspace.store';

@Component({
  selector: 'app-workspace-activity',
  standalone: true,
  imports: [SdHistoryItem, SdAuditDiff, SdJobProgress, SdSection, SdDataState, SdButton, SdSwitch],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceActivityComponent {
  readonly store = inject(WorkspaceStore);
  readonly includeUnchanged = signal(false);
  readonly failExport = signal(false);
  readonly job = signal<SdTaskState>({ id: 'workspace-export', status: 'idle', title: 'Xuất hồ sơ trong phiên' });
  readonly exportBlob = signal<Blob | null>(null);
  readonly running = computed(() => this.job().status === 'running');
  readonly diffOptions = computed<SdAuditDiffOptions>(() => ({
    includeUnchanged: this.includeUnchanged(),
    fields: [
      { path: 'code', label: 'Mã đề nghị', order: 1 },
      { path: 'project', label: 'Dự án', order: 2 },
      { path: 'status', label: 'Trạng thái', order: 3, enumMap: { pending: 'Chờ duyệt', approved: 'Đã duyệt', returned: 'Cần bổ sung' } },
      { path: 'version', label: 'Phiên bản biểu mẫu', order: 1 },
      { path: 'fields', label: 'Số trường', order: 2 },
    ],
  }));
  private controller: AbortController | null = null;
  constructor() {
    inject(DestroyRef).onDestroy(() => this.controller?.abort());
    effect(() => {
      this.store.resetVersion();
      this.controller?.abort();
      this.exportBlob.set(null);
      this.job.set({ id: 'workspace-export', status: 'idle', title: 'Xuất hồ sơ trong phiên' });
    });
  }
  async startExport(): Promise<void> {
    if (this.running()) return;
    const controller = new AbortController();
    this.controller = controller;
    const rows = structuredClone(this.store.requests());
    const fail = this.failExport();
    this.exportBlob.set(null);
    this.job.set({
      id: 'workspace-export',
      status: 'running',
      progress: 0,
      title: 'Chuẩn bị bản xuất',
      message: 'Đang xử lý ' + rows.length + ' hồ sơ giả lập.',
    });
    try {
      for (let processed = 0; processed < rows.length; processed += 6) {
        await this.store.wait(controller.signal);
        if (controller.signal.aborted) return;
        const progress = Math.min(100, Math.round(((processed + 6) / rows.length) * 100));
        if (fail && progress >= 50) throw new Error('Mô phỏng lỗi xuất dữ liệu. Tắt chế độ lỗi rồi Thử lại.');
        this.job.update(state => ({
          ...state,
          progress,
          message: Math.min(processed + 6, rows.length) + '/' + rows.length + ' hồ sơ đã chuẩn bị.',
        }));
      }
      this.exportBlob.set(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' }));
      this.job.update(state => ({ ...state, status: 'succeeded', progress: 100, message: 'Bản xuất đã sẵn sàng để tải.' }));
      this.store.recordEvent('Chuẩn bị bản xuất hồ sơ', rows.length + ' hồ sơ tại thời điểm bắt đầu; không gửi dữ liệu ra ngoài.');
    } catch (error) {
      if (!controller.signal.aborted)
        this.job.update(state => ({
          ...state,
          status: 'failed',
          error,
          message: error instanceof Error ? error.message : 'Không thể xuất dữ liệu.',
        }));
    }
  }
  cancelExport(): void {
    this.controller?.abort();
    this.job.update(state => ({ ...state, status: 'cancelled', message: 'Đã hủy; bạn có thể chạy lại.' }));
  }
  download(): void {
    const blob = this.exportBlob();
    if (blob) BrowserUtilities.downloadBlob(blob, 'workspace-requests.json');
  }
}
