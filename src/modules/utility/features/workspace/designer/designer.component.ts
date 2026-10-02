import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SdFormBuilder } from '@sdcorejs/angular/components/form-generic';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { BrowserUtilities } from '@sdcorejs/utils/fns';
import { WorkspaceStore } from '../data/workspace.store';
import { WORKSPACE_SCHEMA } from '../data/workspace.seed';

@Component({
  selector: 'app-workspace-designer',
  standalone: true,
  imports: [SdFormBuilder, SdButton],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceDesignerComponent {
  readonly store = inject(WorkspaceStore);
  readonly #router = inject(Router);
  readonly #notify = inject(SdNotifyService);
  readonly feedback = signal('Chọn một trường để đổi nhãn, required, rule hoặc độ rộng. Palette hỗ trợ thêm bằng click và bàn phím.');
  publish(): void {
    this.store.publishSchema();
    this.feedback.set('Đã áp dụng biểu mẫu v' + this.store.schemaVersion() + '. Mở Gửi đề nghị để dùng đúng schema này.');
    this.#notify.success('Biểu mẫu đã áp dụng cho đề nghị mới.');
  }
  restore(): void {
    this.store.draftSchema.set(structuredClone(WORKSPACE_SCHEMA));
    this.feedback.set('Đã khôi phục bản nháp mẫu. Bấm Áp dụng nếu muốn dùng cho đề nghị mới.');
  }
  exportSchema(): void {
    BrowserUtilities.downloadBlob(
      new Blob([JSON.stringify(this.store.draftSchema(), null, 2)], { type: 'application/json' }),
      'de-nghi.schema.json'
    );
  }
  tryForm(): void {
    void this.#router.navigate(['/utility/workspace/request']);
  }
}
