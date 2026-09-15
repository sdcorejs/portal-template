import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContactRecord } from './form-editor.component';
@Component({
  selector: 'app-pattern-contact-facts',
  template: `<dl class="facts">
    <dt>Họ và tên</dt>
    <dd>{{ record().name }}</dd>
    <dt>Email</dt>
    <dd>{{ record().email }}</dd>
    <dt>Điện thoại</dt>
    <dd>{{ record().phone || 'Chưa cung cấp' }}</dd>
    <dt>Khu vực</dt>
    <dd>{{ record().region || 'Chưa cung cấp' }}</dd>
    <dt>Ghi chú</dt>
    <dd>{{ record().note || 'Chưa cung cấp' }}</dd>
  </dl>`,
  styleUrl: '../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFactsComponent {
  readonly record = input.required<ContactRecord>();
}
