import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SdButton, SdButtonItem, SdButtonItemDivider } from '@sdcorejs/angular/components/button';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
@Component({
  selector: 'app-pattern-button',
  imports: [RouterLink, SdButton, SdButtonItem, SdButtonItemDivider, SdSection],
  templateUrl: './button.component.html',
  styleUrl: '../../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input('crud');
  readonly message = signal('');
  readonly saving = signal(false);
  readonly attempt = signal(0);
  readonly deleted = signal(false);
  readonly actions = [
    { title: 'Gửi duyệt', icon: 'send', color: 'primary' },
    { title: 'Duyệt', icon: 'check_circle', color: 'success' },
    { title: 'Từ chối', icon: 'cancel', color: 'error' },
    { title: 'Tạm dừng', icon: 'pause_circle', color: 'warning' },
    { title: 'Xuất dữ liệu', icon: 'download', color: 'info' },
    { title: 'In', icon: 'print', color: 'secondary' },
  ] as const;
  readonly workflowActions = this.actions.slice(0, 4);
  readonly dataActions = this.actions.slice(4);
  runAction(title: string): void {
    this.message.set('Đã thực hiện tác vụ mẫu: ' + title + '.');
  }
  private readonly confirm = inject(SdConfirmService);
  private readonly destroy = inject(DestroyRef);
  async remove(): Promise<void> {
    const target = this.variant() === 'crud' ? 'liên hệ LH-1024' : 'đơn hàng DH-1024';
    try {
      await this.confirm.confirm('Bản ghi ' + target + ' sẽ bị xoá khỏi danh sách mẫu này.', {
        title: 'Xoá ' + target + '?',
        yesTitle: 'Xoá',
        noTitle: 'Giữ lại',
        yesButtonColor: 'error',
      });
      this.deleted.set(true);
      this.message.set('Đã xoá ' + target + ' trong dữ liệu mẫu.');
    } catch {
      this.message.set('Đã giữ lại bản ghi.');
    }
  }
  async save(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    this.message.set('');
    await new Promise(r => setTimeout(r, 500));
    if (this.destroy.destroyed) return;
    this.attempt.update(x => x + 1);
    this.saving.set(false);
    this.message.set(
      this.variant() === 'async' && this.attempt() === 1 ? 'Không thể lưu. Dữ liệu được giữ nguyên; vui lòng thử lại.' : 'Đã lưu thay đổi.'
    );
  }
}
