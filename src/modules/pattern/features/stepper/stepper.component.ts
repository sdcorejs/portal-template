import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SdStepper, SdStep } from '@sdcorejs/angular/components/stepper';
import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { SdTable, SdTableOption } from '@sdcorejs/angular/components/table';
import { PatternOrder, seedOrders } from '../../data/pattern-query';

@Component({
  selector: 'app-pattern-stepper',
  imports: [SdStepper, SdStep, SdSection, SdSectionItem, SdInput, SdButton, SdTable],
  templateUrl: './stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' },
})
export class StepperComponent {
  stepIcon(key: string): string {
    return (
      (
        {
          identity: 'person',
          contact: 'mail',
          address: 'location_on',
          tax: 'business',
          note: 'notes',
          code: 'verified',
          selection: 'checklist',
          lines: 'list_alt',
          review: 'fact_check',
        } as Record<string, string>
      )[key] ?? 'info'
    );
  }
  readonly variant = input('basic');
  readonly wizard = viewChild(SdStepper);
  private readonly notify = inject(SdNotifyService);
  readonly index = signal(0);
  readonly busy = signal(false);
  readonly saved = signal(false);
  readonly company = signal(false);
  readonly picked = signal<PatternOrder[]>([]);
  readonly lines = signal([{ id: 1, name: 'Giao hàng nội thành', quantity: '1' }]);
  private lineId = 1;
  readonly controls = {
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tax: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    note: new FormControl('', { nonNullable: true }),
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    selection: new FormControl(0, { nonNullable: true, validators: [Validators.min(1)] }),
    lines: new FormControl(true, { nonNullable: true, validators: [Validators.requiredTrue] }),
  };
  readonly groups = {
    identity: new FormGroup({ name: this.controls.name }),
    contact: new FormGroup({ email: this.controls.email }),
    address: new FormGroup({ address: this.controls.address }),
    tax: new FormGroup({ tax: this.controls.tax }),
    note: new FormGroup({ note: this.controls.note }),
    code: new FormGroup({ code: this.controls.code }),
    selection: new FormGroup({ selection: this.controls.selection }),
    lines: new FormGroup({ lines: this.controls.lines }),
    review: new FormGroup({}),
  };
  readonly steps = computed(() => {
    const start = [{ key: 'identity', label: 'Thông tin', fields: [['name', 'Tên khách hàng']] }];
    const end = { key: 'review', label: 'Xác nhận', fields: [] };
    const v = this.variant();
    if (v === 'selection') return [...start, { key: 'selection', label: 'Chọn đơn hàng', fields: [] }, end];
    if (v === 'lines') return [...start, { key: 'lines', label: 'Dịch vụ', fields: [] }, end];
    if (v === 'async') return [...start, { key: 'code', label: 'Kiểm tra mã', fields: [['code', 'Mã hồ sơ (CUS-001 đã tồn tại)']] }, end];
    if (v === 'optional') return [...start, { key: 'note', label: 'Bổ sung', fields: [['note', 'Ghi chú']] }, end];
    const contact = { key: 'contact', label: 'Liên hệ', fields: [['email', 'Email']] };
    if (v === 'branch')
      return [...start, ...(this.company() ? [{ key: 'tax', label: 'Doanh nghiệp', fields: [['tax', 'Mã số thuế']] }] : []), contact, end];
    if (v === 'many')
      return [
        ...start,
        contact,
        { key: 'address', label: 'Địa chỉ', fields: [['address', 'Địa chỉ giao hàng']] },
        { key: 'tax', label: 'Thanh toán', fields: [['tax', 'Mã số thuế']] },
        { key: 'note', label: 'Bổ sung', fields: [['note', 'Ghi chú']] },
        end,
      ];
    return [...start, contact, end];
  });
  readonly tableOption: SdTableOption<PatternOrder> = {
    type: 'local',
    items: () => seedOrders(),
    columns: [
      { field: 'code', title: 'Mã đơn', type: 'string' },
      { field: 'name', title: 'Khách hàng', type: 'string' },
      { field: 'amount', title: 'Giá trị', type: 'number' },
    ],
    paginate: { pageSize: 6, pages: [6, 12, 24] },
    filter: {
      cacheable: false,
      hideInlineFilter: true,
      hideExternalFilterToolbar: true,
      quickSearch: { containFields: ['code', 'name'], placeholder: 'Tìm đơn hàng' },
    },
    selector: { visible: true, onSelect: (_row, rows) => this.select(rows ?? []), onSelectAll: rows => this.select(rows) },
  };
  control(key: string): FormControl {
    return this.controls[key as keyof typeof this.controls];
  }
  group(key: string): FormGroup {
    return this.groups[key as keyof typeof this.groups];
  }
  select(rows: PatternOrder[]): void {
    this.picked.set(rows);
    this.controls.selection.setValue(rows.length);
  }
  edit(key: string, value: string): void {
    this.control(key).setValue(value ?? '');
    if (key === 'code') this.control(key).setErrors((value ?? '').trim() ? { unchecked: true } : { required: true });
  }
  addLine(): void {
    this.lines.update(rows => [...rows, { id: ++this.lineId, name: '', quantity: '1' }]);
    this.validateLines();
  }
  changeLine(id: number, field: 'name' | 'quantity', value: string): void {
    this.lines.update(rows => rows.map(r => (r.id === id ? { ...r, [field]: value ?? '' } : r)));
    this.validateLines();
  }
  removeLine(id: number): void {
    this.lines.update(rows => rows.filter(r => r.id !== id));
    this.validateLines();
  }
  validateLines(): void {
    this.controls.lines.setValue(
      this.lines().length > 0 && this.lines().every(r => r.name.trim() && Number.isInteger(+r.quantity) && +r.quantity > 0)
    );
  }
  private async wait(): Promise<void> {
    this.busy.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    this.busy.set(false);
  }
  async next(): Promise<void> {
    if (this.busy()) return;
    const step = this.steps()[this.index()];
    if (step.key === 'code') {
      await this.wait();
      const code = this.controls.code.value.trim();
      this.controls.code.setErrors(!code || code.toUpperCase() === 'CUS-001' ? { unavailable: true } : null);
    }
    const group = this.group(step.key);
    group.markAllAsTouched();
    if (group.invalid) {
      this.notify.error(
        step.key === 'selection'
          ? 'Chọn ít nhất một đơn hàng.'
          : step.key === 'code'
            ? 'Mã trống hoặc đã tồn tại. Nhập mã khác và thử lại.'
            : 'Kiểm tra các trường bắt buộc trong bước hiện tại.'
      );
      return;
    }
    this.wizard()?.next();
  }
  async save(): Promise<void> {
    if (this.busy() || this.saved()) return;
    const invalid = this.steps().findIndex(s => this.group(s.key).invalid);
    if (invalid >= 0) {
      this.wizard()?.goTo(invalid);
      this.notify.error('Hoàn tất thông tin trước khi lưu.');
      return;
    }
    await this.wait();
    this.saved.set(true);
    sessionStorage.removeItem('pattern-stepper-draft');
    this.notify.success('Đã tạo hồ sơ khách hàng.');
  }
  saveDraft(): void {
    sessionStorage.setItem(
      'pattern-stepper-draft',
      JSON.stringify({ name: this.controls.name.value, email: this.controls.email.value, index: this.index() })
    );
    this.notify.success('Đã lưu nháp trong phiên trình duyệt.');
  }
  restore(): void {
    try {
      const draft = JSON.parse(sessionStorage.getItem('pattern-stepper-draft') || 'null');
      if (!draft || typeof draft.name !== 'string' || typeof draft.email !== 'string') {
        this.notify.info('Chưa có bản nháp.');
        return;
      }
      this.controls.name.setValue(draft.name);
      this.controls.email.setValue(draft.email);
      const target = this.groups.identity.valid ? (this.groups.contact.valid && draft.index === 2 ? 2 : 1) : 0;
      this.wizard()?.goTo(0);
      for (let step = 0; step < target; step++) this.wizard()?.next();
      this.notify.success('Đã khôi phục bản nháp.');
    } catch {
      this.notify.error('Không đọc được bản nháp.');
    }
  }
}
