import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-section-header-slots',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdSection,
    SdSectionItem,
    SdButton,
    SdCodeEditor,
    SdPageComponent,
    SdInput,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './header-slots.component.html',
  styleUrls: ['./header-slots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderSlotsComponent {
  pageDescription = signal(
    'sd-section hỗ trợ 2 slot content projection trong header: ' +
      '[sdHeaderLeft] thay thế toàn bộ phần trái (icon + title + subTitle), ' +
      '[sdHeaderRight] chèn nội dung vào phần phải header (nút action, badge, trạng thái...).'
  );

  // ── Config cho playground sdHeaderRight ──────────────────────────────────
  sectionTitle = signal('Chi tiết hợp đồng');
  showEditBtn = signal(true);
  showDeleteBtn = signal(false);
  showStatusBadge = signal(true);
  collapsable = signal(false);

  // ── Config cho playground sdHeaderLeft ───────────────────────────────────
  customIcon = signal('💼');
  customTitle = signal('Hợp đồng #HD-2025-001');
  customSubTitle = signal('Ngày ký: 01/01/2025');

  // ── Auto-generated code cho sdHeaderRight ────────────────────────────────
  htmlHeaderRightCode = computed(() => {
    const btnEdit = this.showEditBtn()
      ? `\n    <sd-button title="Chỉnh sửa" type="light" size="sm" prefixIcon="edit"></sd-button>`
      : '';
    const btnDelete = this.showDeleteBtn()
      ? `\n    <sd-button title="Xoá" type="light" size="sm" prefixIcon="delete" [color]="'error'"></sd-button>`
      : '';
    const badge = this.showStatusBadge()
      ? `\n    <span class="c-status-badge">Đang hiệu lực</span>`
      : '';
    const collapsableAttr = this.collapsable() ? `\n  collapsable` : '';

    return `<sd-section
  title="${this.sectionTitle()}"
  icon="description"${collapsableAttr}>

  <!-- [sdHeaderRight]: nội dung nằm ở phần phải header -->
  <div sdHeaderRight class="d-flex align-items-center gap-8">${badge}${btnEdit}${btnDelete}
  </div>

  <p>Nội dung body của section.</p>
</sd-section>`;
  });

  // ── Auto-generated code cho sdHeaderLeft ─────────────────────────────────
  htmlHeaderLeftCode = computed(() => {
    return `<!-- [sdHeaderLeft] thay thế TOÀN BỘ phần trái header (icon + title + subTitle) -->
<!-- Khi dùng sdHeaderLeft, các input title/subTitle/icon bị bỏ qua -->
<sd-section>
  <div sdHeaderLeft class="d-flex align-items-center gap-12">
    <span style="font-size: 24px;">${this.customIcon()}</span>
    <div>
      <div class="T16M">${this.customTitle()}</div>
      <div class="T12R text-secondary">${this.customSubTitle()}</div>
    </div>
  </div>

  <p>Nội dung body của section.</p>
</sd-section>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSection } from '@sdcorejs/angular/components/section';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdSection, SdButton],
  templateUrl: './my-component.component.html',
})
export class MyComponent {
  onEdit() { /* ... */ }
  onDelete() { /* ... */ }
}`;

  htmlCombinedCode = `<!-- Kết hợp cả hai slot: sdHeaderLeft + sdHeaderRight -->
<sd-section collapsable>

  <!-- Tuỳ biến hoàn toàn phần trái header -->
  <div sdHeaderLeft class="d-flex align-items-center gap-12">
    <span style="font-size: 22px;">📋</span>
    <div>
      <div class="T16M">Hợp đồng #HD-2025-001</div>
      <div class="T12R text-secondary">Ngày ký: 01/01/2025</div>
    </div>
  </div>

  <!-- Action buttons ở phần phải header -->
  <div sdHeaderRight class="d-flex align-items-center gap-8">
    <span class="c-status-badge">Đang hiệu lực</span>
    <sd-button title="Chỉnh sửa" type="light" size="sm" prefixIcon="edit"></sd-button>
  </div>

  <p>Nội dung chi tiết hợp đồng...</p>
</sd-section>`;
}
