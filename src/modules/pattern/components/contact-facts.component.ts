import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { ContactRecord } from './form-editor.component';
@Component({
  selector: 'app-pattern-contact-facts',
  imports: [SdSection, SdSectionItem],
  template: `<sd-section hideHeader>
    <sd-section-item label="Họ và tên" labelWidth="35%"
      ><strong>{{ record().name }}</strong></sd-section-item
    >
    <sd-section-item label="Email" labelWidth="35%"
      ><strong>{{ record().email }}</strong></sd-section-item
    >
    <sd-section-item label="Điện thoại" labelWidth="35%"
      ><strong>{{ record().phone || 'Chưa cung cấp' }}</strong></sd-section-item
    >
    <sd-section-item label="Khu vực" labelWidth="35%"
      ><strong>{{ record().region || 'Chưa cung cấp' }}</strong></sd-section-item
    >
    <sd-section-item label="Ghi chú" labelWidth="35%"
      ><strong>{{ record().note || 'Chưa cung cấp' }}</strong></sd-section-item
    >
  </sd-section>`,
  styles: ':host { display: block; min-width: 0; overflow-wrap: anywhere; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFactsComponent {
  readonly record = input.required<ContactRecord>();
}
