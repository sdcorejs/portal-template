import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { I18nService } from '@sdcorejs/angular/i18n';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
@Component({
  selector: 'app-demo-lab-frame',
  standalone: true,
  imports: [SdPageComponent, SdButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-lab.scss',
  template: ` <sd-page [title]="title()" [description]="description()">
    <div headerRight class="lab-toolbar" [attr.aria-label]="i18n.language() === 'en' ? 'Demo controls' : 'Điều khiển demo'">
      <sd-button data-testid="lab-vi" title="VI" [disabled]="i18n.language() === 'vi'" (click)="language('vi')" />
      <sd-button data-testid="lab-en" title="EN" [disabled]="i18n.language() === 'en'" (click)="language('en')" />
      <sd-button
        data-testid="lab-reset"
        prefixIcon="restart_alt"
        [title]="i18n.language() === 'en' ? 'Reset demo' : 'Đặt lại demo'"
        (click)="resetRequested.emit()" />
    </div>
    <div class="lab-content">
      <p class="lab-local-note">
        {{
          i18n.language() === 'en'
            ? 'Fictional Harbor project · Changes stay in this demo session.'
            : 'Dự án Harbor giả lập · Thay đổi chỉ lưu trong phiên demo này.'
        }}
      </p>
      <ng-content />
    </div>
  </sd-page>`,
})
export class DemoLabFrameComponent {
  readonly i18n = inject(I18nService);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly resetRequested = output<void>();
  language(lang: 'vi' | 'en'): void {
    this.i18n.setLanguage(lang, { reload: false });
  }
}
