import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-with-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdInput,
    SdInputNumber,
    SdLabel,
    SdSelect,
    SdSwitch,
  ],
  templateUrl: './with-input.component.html',
  styleUrls: ['./with-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmWithInputComponent {
  readonly #confirmService = inject(SdConfirmService);
  readonly #notifyService = inject(SdNotifyService);

  pageDescription = signal(
    'Phương thức .withInput() mở hộp thoại kèm ô nhập văn bản. Hỗ trợ giá trị mặc định, bắt buộc nhập và giới hạn ký tự. Trả về Promise<string> với nội dung người dùng đã nhập.'
  );

  message = signal('Vui lòng nhập lý do thực hiện hành động:');
  title = signal('Nhập thông tin');
  yesTitle = signal('Xác nhận');
  noTitle = signal('Hủy');
  yesButtonColor = signal<ButtonColor | null>(null);
  noButtonColor = signal<ButtonColor | null>(null);
  required = signal(false);
  maxlength = signal<number>(255);
  defaultValue = signal('');

  colorOptions: { id: ButtonColor | null; name: string }[] = [
    { id: null, name: '-- Mặc định --' },
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'success', name: 'Success' },
    { id: 'error', name: 'Error' },
    { id: 'warning', name: 'Warning' },
    { id: 'info', name: 'Info' },
  ];

  lastResult = signal('Chưa có tương tác nào được ghi nhận');

  tsCode = computed(() => {
    const yesColor = this.yesButtonColor();
    const noColor = this.noButtonColor();
    return `import { Component, inject } from '@angular/core';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';

@Component({ ... })
export class MyComponent {
  readonly #confirmService = inject(SdConfirmService);

  async onRenameFile() {
    try {
      const value = await this.#confirmService.withInput('${this.message()}', {
        title: '${this.title()}',
        yesTitle: '${this.yesTitle()}',
        noTitle: '${this.noTitle()}',${yesColor ? `\n        yesButtonColor: '${yesColor}',` : ''}${noColor ? `\n        noButtonColor: '${noColor}',` : ''}
        required: ${this.required()},
        maxlength: ${this.maxlength()},
        defaultValue: '${this.defaultValue()}',
      });
      console.log(value); // Chuỗi người dùng đã nhập
    } catch {
      // Người dùng hủy
    }
  }
}`;
  });

  test(): void {
    this.#confirmService
      .withInput(this.message(), {
        title: this.title(),
        yesTitle: this.yesTitle(),
        noTitle: this.noTitle(),
        yesButtonColor: this.yesButtonColor() ?? undefined,
        noButtonColor: this.noButtonColor() ?? undefined,
        required: this.required(),
        maxlength: this.maxlength(),
        defaultValue: this.defaultValue(),
      })
      .then(value => {
        this.lastResult.set(`Chuỗi nhập: "${value}"`);
        this.#notifyService.success('Đã lấy dữ liệu: ' + value);
      })
      .catch(() => {
        this.lastResult.set('Thao tác bị HUỶ');
      });
  }
}
