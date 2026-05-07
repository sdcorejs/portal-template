import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdConfirmService } from '@sd-angular/core/services/confirm';
import { SdNotifyService } from '@sd-angular/core/services/notify';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-confirm-with-date',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdInput,
    SdLabel,
    SdSelect,
    SdSwitch,
  ],
  templateUrl: './with-date.component.html',
  styleUrls: ['./with-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmWithDateComponent {
  readonly #confirmService = inject(SdConfirmService);
  readonly #notifyService = inject(SdNotifyService);

  pageDescription = signal(
    'Phương thức .withDate() mở hộp thoại kèm bộ chọn ngày. Hỗ trợ placeholder, giá trị mặc định và bắt buộc chọn. Trả về Promise<string> với ngày được xác nhận.'
  );

  message = signal('Vui lòng chọn ngày áp dụng:');
  title = signal('Chọn ngày');
  yesTitle = signal('Xác nhận');
  noTitle = signal('Hủy');
  yesButtonColor = signal<ButtonColor | null>(null);
  noButtonColor = signal<ButtonColor | null>(null);
  required = signal(false);
  placeholder = signal('DD/MM/YYYY');
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
    const defVal = this.defaultValue();
    return `import { Component, inject } from '@angular/core';
import { SdConfirmService } from '@sd-angular/core/services/confirm';

@Component({ ... })
export class MyComponent {
  readonly #confirmService = inject(SdConfirmService);

  async onSelectDate() {
    try {
      const date = await this.#confirmService.withDate('${this.message()}', {
        title: '${this.title()}',
        yesTitle: '${this.yesTitle()}',
        noTitle: '${this.noTitle()}',${yesColor ? `\n        yesButtonColor: '${yesColor}',` : ''}${noColor ? `\n        noButtonColor: '${noColor}',` : ''}
        required: ${this.required()},
        placeholder: '${this.placeholder()}',${defVal ? `\n        defaultValue: '${defVal}',` : ''}
      });
      console.log(date); // Chuỗi ngày được chọn
    } catch {
      // Người dùng hủy
    }
  }
}`;
  });

  test(): void {
    this.#confirmService
      .withDate(this.message(), {
        title: this.title(),
        yesTitle: this.yesTitle(),
        noTitle: this.noTitle(),
        yesButtonColor: this.yesButtonColor() ?? undefined,
        noButtonColor: this.noButtonColor() ?? undefined,
        required: this.required(),
        placeholder: this.placeholder(),
        defaultValue: this.defaultValue() || undefined,
      })
      .then(value => {
        this.lastResult.set(`Ngày đã chọn: "${value}"`);
        this.#notifyService.success('Bạn đã xác nhận ngày: ' + value);
      })
      .catch(() => {
        this.lastResult.set('Thao tác bị HUỶ');
      });
  }
}
