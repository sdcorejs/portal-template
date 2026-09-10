import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { DemoEntity, EntityKind } from '../data/models';
import { statusBadge } from './status-badge';
export const ENTITY_NOUNS: Record<EntityKind, string> = {
  customer: 'công ty',
  order: 'đơn hàng',
  product: 'sản phẩm',
  ticket: 'yêu cầu hỗ trợ',
  contract: 'hợp đồng',
  category: 'danh mục',
  partner: 'đối tác',
  contact: 'liên hệ',
};
@Component({
  selector: 'app-record-header',
  imports: [SdBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="record-heading">
      <h1>
        {{ prefix() }}
        @if (entity(); as row) {
          <span class="record-code">#{{ row.code }}</span>
        }
      </h1>
      @if (badge(); as status) {
        <sd-badge type="round" [title]="status.title" [color]="status.color" [icon]="status.icon" />
      }
    </div>
    @if (entity(); as row) {
      <p class="record-description">{{ row.name }}</p>
    }`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .record-heading {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      h1 {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.4;
        margin: 0;
      }
      .record-code {
        color: var(--sd-primary);
      }
      .record-description {
        margin: 4px 0 0;
        color: var(--sd-text-secondary);
        font-size: 14px;
        overflow-wrap: anywhere;
      }
    `,
  ],
})
export class RecordHeaderComponent {
  readonly kind = input.required<EntityKind>();
  readonly mode = input<'detail' | 'create' | 'update'>('detail');
  readonly entity = input<DemoEntity>();
  readonly prefix = computed(
    () => (this.mode() === 'detail' ? 'Chi tiết ' : this.mode() === 'create' ? 'Tạo ' : 'Cập nhật ') + ENTITY_NOUNS[this.kind()]
  );
  readonly badge = computed(() => (this.entity() ? statusBadge(this.entity()!.status, 'round') : null));
}
