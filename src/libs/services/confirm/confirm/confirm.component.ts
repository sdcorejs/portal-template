import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdConfirmService } from '@sd-angular/core/services/confirm';
import { SdNotifyService } from '@sd-angular/core/services/notify';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-basic',
  standalone: true,
  imports: [CommonModule, FormsModule, SdButton, SdCodeEditor, SdPageComponent, SdSection, SdInput, SdSelect],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmBasicComponent {
  readonly #confirmService = inject(SdConfirmService);
  readonly #notifyService = inject(SdNotifyService);

  pageDescription = signal(
    'Phương thức .confirm() hiển thị hộp thoại xác nhận với hai lựa chọn: Đồng ý và Hủy bỏ. Trả về Promise — resolve khi người dùng chọn Đồng ý, reject khi Hủy. Thường dùng trong các flow cảnh báo hoặc xóa bản ghi.'
  );

  message = signal('Bạn có chắc chắn muốn áp dụng thay đổi mới nhất vào hệ thống không?');
  title = signal('Xác nhận Cài đặt');
  yesTitle = signal('Đồng ý');
  noTitle = signal('Trở lại');
  yesButtonColor = signal<ButtonColor | null>(null);
  noButtonColor = signal<ButtonColor | null>(null);
  width = signal('400px');

  colorOptions: { id: ButtonColor | null; name: string }[] = [
    { id: null, name: '-- Mặc định --' },
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'success', name: 'Success' },
    { id: 'error', name: 'Error' },
    { id: 'warning', name: 'Warning' },
    { id: 'info', name: 'Info' },
  ];

  widthOptions = [
    { id: '360px', name: '360px - Nhỏ' },
    { id: '400px', name: '400px - Mặc định' },
    { id: '480px', name: '480px - Vừa' },
    { id: '560px', name: '560px - Lớn' },
  ];

  lastResult = signal('Chưa có tương tác nào được ghi nhận');

  tsCode = computed(() => {
    const yesColor = this.yesButtonColor();
    const noColor = this.noButtonColor();
    return `import { Component, inject } from '@angular/core';
import { SdConfirmService } from '@sd-angular/core/services/confirm';

@Component({ ... })
export class MyComponent {
  readonly #confirmService = inject(SdConfirmService);

  async onDeleteData() {
    try {
      await this.#confirmService.confirm('${this.message()}', {
        title: '${this.title()}',
        yesTitle: '${this.yesTitle()}',
        noTitle: '${this.noTitle()}',${yesColor ? `\n        yesButtonColor: '${yesColor}',` : ''}${noColor ? `\n        noButtonColor: '${noColor}',` : ''}
        width: '${this.width()}',
      });
      // Accept Logic
      console.log('Xác nhận thành công');
    } catch {
      // Cancel Logic
    }
  }
}`;
  });

  test(): void {
    this.#confirmService
      .confirm(this.message(), {
        title: this.title(),
        yesTitle: this.yesTitle(),
        noTitle: this.noTitle(),
        yesButtonColor: this.yesButtonColor() ?? undefined,
        noButtonColor: this.noButtonColor() ?? undefined,
        width: this.width(),
      })
      .then(() => {
        this.lastResult.set('Người dùng nhấn ĐỒNG Ý!');
        this.#notifyService.success('Đã xác nhận hành động thành công!');
      })
      .catch(() => {
        this.lastResult.set('Thao tác bị HUỶ');
        this.#notifyService.warning('Thao tác đã bị Hủy!');
      });
  }
}
