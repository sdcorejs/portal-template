import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
@Component({
  selector: 'app-pattern-buttons',
  imports: [RouterLink, SdButton],
  templateUrl: './buttons.component.html',
  styleUrl: '../../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsComponent {
  readonly variant = input('crud');
  readonly message = signal('');
  readonly saving = signal(false);
  readonly attempt = signal(0);
  readonly deleted = signal(false);
  private readonly confirm = inject(SdConfirmService);
  private readonly destroy = inject(DestroyRef);
  async remove(): Promise<void> {
    try {
      await this.confirm.confirm('Đơn hàng DH-1024 sẽ bị xóa khỏi danh sách mẫu này.', {
        title: 'Xóa đơn hàng DH-1024?',
        yesTitle: 'Xóa đơn hàng',
        noTitle: 'Giữ lại',
        yesButtonColor: 'error',
      });
      this.deleted.set(true);
      this.message.set('Đã xóa đơn hàng mẫu DH-1024.');
    } catch {
      this.message.set('Đã giữ lại đơn hàng.');
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
    this.message.set(this.attempt() === 1 ? 'Không thể lưu. Dữ liệu được giữ nguyên; vui lòng thử lại.' : 'Đã lưu thay đổi.');
  }
}
