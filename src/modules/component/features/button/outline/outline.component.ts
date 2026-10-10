import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
import type { Color } from '@sdcorejs/utils/models';

@Component({
  selector: 'app-button-outline-demo',
  standalone: true,
  imports: [SdButton, SdCodeEditor, SdSection, SdSwitch, SdPageComponent],
  templateUrl: './outline.component.html',
  styleUrl: './outline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonOutlineDemoComponent {
  private readonly confirm = inject(SdConfirmService);
  readonly disabled = signal(false);
  readonly failNext = signal(false);
  readonly loading = signal(false);
  readonly approved = signal(false);
  readonly status = signal('Hồ sơ NOVA-204 đang chờ duyệt. Thử tải, xác nhận hoặc nhập lý do.');
  readonly error = signal('');
  readonly tones: { color: Color; title: string }[] = [
    { color: 'primary', title: 'Chính' },
    { color: 'secondary', title: 'Phụ' },
    { color: 'success', title: 'Thành công' },
    { color: 'info', title: 'Thông tin' },
    { color: 'warning', title: 'Cảnh báo' },
    { color: 'error', title: 'Nguy hiểm' },
  ];
  readonly htmlCode = computed(
    () =>
      `<sd-button\n  title="Duyệt hồ sơ"\n  type="outline"\n  color="success"\n  [disabled]="approved() || disabled()"\n  (click)="approve()"\n/>`
  );
  readonly tsCode = `import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';

@Component({
  imports: [SdButton], changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<sd-button title="Duyệt hồ sơ" type="outline" (click)="approve()" />',
})
export class ApprovalExample {
  private readonly confirm = inject(SdConfirmService);
  approved = signal(false);
  disabled = signal(false);
  async approve() {
    if (this.approved() || this.disabled()) return;
    try {
      await this.confirm.confirm('Duyệt hồ sơ NOVA-204?', {
        title: 'Duyệt hồ sơ', yesTitle: 'Duyệt hồ sơ', noTitle: 'Hủy',
        yesButtonColor: 'success',
      });
    } catch { return; } // Cancel là Promise rejection.
    this.approved.set(true);
  }
}`;

  async reload(): Promise<void> {
    if (this.loading() || this.disabled()) return;
    this.loading.set(true);
    this.error.set('');
    await new Promise(resolve => setTimeout(resolve, 650));
    this.loading.set(false);
    if (this.failNext()) {
      this.failNext.set(false);
      this.error.set('Không tải được hồ sơ demo. Bấm Thử lại để tiếp tục.');
      this.status.set('Tải thất bại. Trạng thái hồ sơ được giữ nguyên.');
      return;
    }
    this.status.set('Đã tải lại hồ sơ NOVA-204.');
  }
  async approve(): Promise<void> {
    if (this.disabled() || this.approved()) return;
    try {
      await this.confirm.confirm(
        'Hồ sơ NOVA-204 đề nghị 120 triệu cho không gian làm việc Nova. Việc duyệt sẽ cập nhật trạng thái trong phiên demo. Hãy kiểm tra nội dung và ngân sách trước khi tiếp tục.',
        {
          title: 'Duyệt hồ sơ NOVA-204',
          yesTitle: 'Duyệt hồ sơ',
          noTitle: 'Hủy',
          yesButtonColor: 'success',
          icon: 'fact_check',
        }
      );
    } catch {
      this.status.set('Đã hủy duyệt. Hồ sơ vẫn đang chờ.');
      return;
    }
    this.approved.set(true);
    this.status.set('Đã duyệt hồ sơ NOVA-204 trong phiên demo.');
  }
  async reason(): Promise<void> {
    if (this.disabled()) return;
    try {
      const reason = await this.confirm.withInput('Nhập nội dung cần bổ sung cho hồ sơ NOVA-204.', {
        title: 'Yêu cầu bổ sung',
        label: 'Nội dung cần bổ sung',
        placeholder: 'Ví dụ: Bổ sung bảng dự toán',
        required: true,
        maxlength: 300,
        yesTitle: 'Lưu yêu cầu',
        noTitle: 'Hủy',
      });
      this.status.set('Đã lưu yêu cầu trong phiên demo: ' + reason);
    } catch {
      this.status.set('Đã hủy yêu cầu bổ sung.');
    }
  }
  reset(): void {
    this.disabled.set(false);
    this.failNext.set(false);
    this.approved.set(false);
    this.error.set('');
    this.status.set('Đã khôi phục hồ sơ NOVA-204 về trạng thái chờ duyệt.');
  }
}
SdTabComponent({ component: ButtonOutlineDemoComponent, name: 'Outline & Confirm', icon: 'smart_button' })(ButtonOutlineDemoComponent);
