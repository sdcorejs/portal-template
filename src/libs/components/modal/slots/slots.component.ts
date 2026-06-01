import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdModal } from '@sdcorejs/angular/components/modal';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-modal-slots',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdInput,
    SdLabel,
    SdModal,
    SdPageComponent,
    SdSection,
    SdSelect,
  ],
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSlotsComponent {
  headerSlotsModal = viewChild.required<SdModal>('headerSlots');
  footerSlotsModal = viewChild.required<SdModal>('footerSlots');
  formModal = viewChild.required<SdModal>('formModal');

  pageDescription = signal(
    'sd-modal hỗ trợ 7 slot ngoài content: `sdHeaderLeft`, `sdHeaderRight`, `sdHeader` (full thay header), `sdFooter`, `sdFooterLeft`, `sdFooterRight`, và default. Demo này dựng 3 modal — header chips, footer step navigation, và form CRUD với validation footer.'
  );

  // Form state
  productCode = signal('SP-001');
  productName = signal('');
  category = signal('');
  saving = signal(false);
  savedMessage = signal('—');

  categoryOptions = [
    { id: 'F', name: 'Thực phẩm' },
    { id: 'E', name: 'Điện tử' },
    { id: 'C', name: 'Quần áo' },
  ];

  // Wizard step
  step = signal(1);
  totalSteps = 3;

  openHeader(): void {
    this.headerSlotsModal().open();
  }

  openFooter(): void {
    this.step.set(1);
    this.footerSlotsModal().open();
  }

  openForm(): void {
    this.savedMessage.set('—');
    this.formModal().open();
  }

  next(): void {
    if (this.step() < this.totalSteps) this.step.update(n => n + 1);
  }

  prev(): void {
    if (this.step() > 1) this.step.update(n => n - 1);
  }

  isFormValid(): boolean {
    return this.productCode().trim().length >= 3 && this.productName().trim().length >= 3 && !!this.category();
  }

  save(): void {
    if (!this.isFormValid()) return;
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.savedMessage.set(
        `Đã lưu ${this.productCode()} — ${this.productName()} (${this.category()}) lúc ${new Date().toLocaleTimeString('vi-VN')}`
      );
      this.formModal().close();
    }, 600);
  }

  headerCode = `<sd-modal #m title="Tài liệu hợp đồng" width="640px">

  <!-- sdHeaderLeft — chip status bên trái title -->
  <span sdHeaderLeft class="status-chip status-chip--active">Active</span>

  <!-- sdHeaderRight — action button bên phải title (trước nút X) -->
  <button sdHeaderRight class="icon-btn" (click)="copyLink()">
    <mat-icon>link</mat-icon>
  </button>

  <p>Nội dung tài liệu...</p>
</sd-modal>

// Hoặc thay TOÀN BỘ header bằng sdHeader:
<sd-modal #m2>
  <div sdHeader class="custom-header">
    <h3>Tự dựng header — không dùng title input</h3>
  </div>
  <!-- ... -->
</sd-modal>`;

  footerCode = `<sd-modal #wizard title="Tạo đơn hàng — 3 bước">

  <!-- Step content trong default slot, chuyển theo step() -->
  @switch (step()) {
    @case (1) { <step-1-form /> }
    @case (2) { <step-2-review /> }
    @case (3) { <step-3-confirm /> }
  }

  <!-- Footer chia 3 vùng: trái (cancel) ─── giữa (step indicator) ─── phải (next/prev) -->
  <div sdFooterLeft>
    <sd-button title="Huỷ" type="outline" (click)="wizard.close()"></sd-button>
  </div>

  <div sdFooter class="step-indicator">
    Bước {{ step() }} / {{ totalSteps }}
  </div>

  <div sdFooterRight>
    <sd-button title="Trước" type="outline" [disabled]="step() === 1" (click)="prev()"></sd-button>
    <sd-button title="Tiếp" color="primary" [disabled]="step() === totalSteps" (click)="next()"></sd-button>
  </div>
</sd-modal>`;

  formCode = `<sd-modal #form title="Thêm sản phẩm" width="520px" [disableBackdropClose]="true">

  <!-- Form content -->
  <form class="d-flex flex-column gap-12 p-24">
    <sd-label>Mã sản phẩm</sd-label>
    <sd-input [(model)]="productCode"></sd-input>

    <sd-label>Tên sản phẩm</sd-label>
    <sd-input [(model)]="productName"></sd-input>

    <sd-label>Danh mục</sd-label>
    <sd-select [items]="categoryOptions" valueField="id" displayField="name"
               [(model)]="category"></sd-select>
  </form>

  <!-- Footer: Cancel trái, Save phải, disable Save nếu invalid -->
  <div sdFooter class="form-footer">
    <sd-button title="Huỷ" type="outline" (click)="form.close()"></sd-button>
    <sd-button title="Lưu" color="primary"
               [disabled]="!isFormValid() || saving()"
               [loading]="saving()"
               (click)="save()"></sd-button>
  </div>
</sd-modal>`;
}
