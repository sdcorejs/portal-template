import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-validation-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdPageComponent,
    SdSection,
    SdInput,
    SdSelect,
    SdButton,
    SdCodeEditor,
  ],
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationDemoComponent {
  pageDescription = signal<string>('Demo cách hiển thị lỗi validation mặc định và cách dùng hideInlineError trong bối cảnh ô nhập nằm trong cell table.');

  formValidation = new FormGroup({});
  tableInlineForm = new FormGroup({});
  tableHideForm = new FormGroup({});
  formPattern = new FormGroup({});

  basicInput = signal<any>(null);
  basicPattern = signal<any>(null);
  basicSelect = signal<any>(null);

  tableInlineName = signal<any>(null);
  tableInlineDepartment = signal<any>(null);

  tableHideName = signal<any>(null);
  tableHideDepartment = signal<any>(null);

  patternEmail       = signal<any>(null);
  patternPhone       = signal<any>(null);
  patternPhoneVn     = signal<any>(null);
  patternIdOrPass    = signal<any>(null);
  patternTime        = signal<any>(null);

  departments = [
    { id: 'hr', name: 'Nhân sự' },
    { id: 'it', name: 'Công nghệ' },
    { id: 'sales', name: 'Kinh doanh' },
  ];

  htmlCode = computed(() => `<!-- 1. Validation cơ bản với regex tùy chỉnh -->
<sd-input
  label="Mã nhân viên"
  [(model)]="employeeCode"
  [form]="form"
  required
  pattern="[A-Z0-9]{4,10}"
  patternErrorMessage="Chỉ gồm chữ IN HOA và số (4-10 ký tự)">
</sd-input>

<!-- 2. Dùng SdPatternType — tự lookup regex + errorMessage -->
<sd-input label="Email"          [(model)]="email"   [form]="form" required pattern="EMAIL"></sd-input>
<sd-input label="SĐT"            [(model)]="phone"   [form]="form" required pattern="PHONE"></sd-input>
<sd-input label="SĐT VN"         [(model)]="phoneVn" [form]="form" required pattern="PHONE_VN"></sd-input>
<sd-input label="CCCD/Hộ chiếu"  [(model)]="idvn"   [form]="form" required pattern="IDVN_OR_PASSPORT"></sd-input>
<sd-input label="Giờ (HH:mm)"    [(model)]="time"    [form]="form" required pattern="TIME"></sd-input>

<!-- 3. Trong cell table: dùng hideInlineError -->
<sd-input
  [(model)]="row.code"
  [form]="tableForm"
  required
  hideInlineError>
</sd-input>`);

  validateBasic(): void {
    this.formValidation.markAllAsTouched();
  }

  resetBasic(): void {
    this.formValidation.reset();
    this.formValidation.markAsUntouched();
    this.basicInput.set(null);
    this.basicPattern.set(null);
    this.basicSelect.set(null);
  }

  validateInlineTable(): void {
    this.tableInlineForm.markAllAsTouched();
  }

  resetInlineTable(): void {
    this.tableInlineForm.reset();
    this.tableInlineForm.markAsUntouched();
    this.tableInlineName.set(null);
    this.tableInlineDepartment.set(null);
  }

  validateHideTable(): void {
    this.tableHideForm.markAllAsTouched();
  }

  resetHideTable(): void {
    this.tableHideForm.reset();
    this.tableHideForm.markAsUntouched();
    this.tableHideName.set(null);
    this.tableHideDepartment.set(null);
  }

  validatePattern(): void {
    this.formPattern.markAllAsTouched();
  }

  resetPattern(): void {
    this.formPattern.reset();
    this.formPattern.markAsUntouched();
    this.patternEmail.set(null);
    this.patternPhone.set(null);
    this.patternPhoneVn.set(null);
    this.patternIdOrPass.set(null);
    this.patternTime.set(null);
  }
}
