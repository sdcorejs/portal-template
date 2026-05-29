import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdSection } from '@sd-angular/core/components/section';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import type { Language } from '@sd-angular/core/models';

import {
  DEFAULT_PORTAL_CONFIG,
  PortalConfig,
  PortalNumberFormat,
  loadPortalConfig,
  resetPortalConfig,
  savePortalConfig,
} from '../../../app/configurations/portal-config';

@Component({
  selector: 'app-portal-config',
  standalone: true,
  imports: [CommonModule, FormsModule, SdPageComponent, SdSection, SdSelect, SdSwitch],
  templateUrl: './portal-config.component.html',
  styleUrls: ['./portal-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalConfigComponent {
  pageDescription = signal<string>(
    'Cấu hình toàn cục của Portal. Giá trị lưu vào localStorage và áp dụng sau khi bấm "Lưu & Tải lại". Mục đích: kiểm thử nhanh các tổ hợp config khác nhau mà không cần đổi source.'
  );

  // why: signal lưu giá trị form. Khởi tạo từ localStorage để user thấy đúng giá trị hiện hành.
  private initial = loadPortalConfig();

  numberFormat = signal<PortalNumberFormat>(this.initial.numberFormat);
  language = signal<Language>(this.initial.language);
  useTabRouter = signal<boolean>(this.initial.useTabRouter);

  numberFormatOptions = [
    { id: '1.234.567,89', name: '1.234.567,89 — VN/EU (dấu chấm phân nhóm, dấu phẩy phần thập phân)' },
    { id: '1,234,567.89', name: '1,234,567.89 — US (dấu phẩy phân nhóm, dấu chấm phần thập phân)' },
  ];

  languageOptions = [
    { id: 'vi', name: 'Tiếng Việt' },
    { id: 'en', name: 'English' },
    { id: 'ja', name: '日本語' },
    { id: 'ko', name: '한국어' },
    { id: 'zh', name: '中文' },
  ];

  numberPreview = computed(() => {
    const sample = 1234567.89;
    return this.numberFormat() === '1.234.567,89'
      ? new Intl.NumberFormat('de-DE').format(sample)
      : new Intl.NumberFormat('en-US').format(sample);
  });

  hasChanges = computed(
    () =>
      this.numberFormat() !== this.initial.numberFormat ||
      this.language() !== this.initial.language ||
      this.useTabRouter() !== this.initial.useTabRouter
  );

  onSave(): void {
    const config: PortalConfig = {
      numberFormat: this.numberFormat(),
      language: this.language(),
      useTabRouter: this.useTabRouter(),
    };
    savePortalConfig(config);
    window.location.reload();
  }

  onReset(): void {
    if (!window.confirm('Khôi phục cấu hình về mặc định và tải lại trang?')) return;
    resetPortalConfig();
    window.location.reload();
  }

  defaultsCode = `const DEFAULT_PORTAL_CONFIG: PortalConfig = ${JSON.stringify(
    DEFAULT_PORTAL_CONFIG,
    null,
    2
  )};`;
}
