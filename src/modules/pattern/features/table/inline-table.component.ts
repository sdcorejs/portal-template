import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  SdTable,
  SdTableCellDefDirective,
  SdTableTitleDefDirective,
  SdTableCommandHeaderDefDirective,
  SdTableOption,
} from '@sdcorejs/angular/components/table';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdInform } from '@sdcorejs/angular/components/inform';
import { SdIcon } from '@sdcorejs/angular/modules/icon';
import { SdTooltipDirective } from '@sdcorejs/angular/directives';
import { SdFormatNumberPipe } from '@sdcorejs/angular/pipes';
import { PatternDraft } from '../../data/pattern-draft';
import { normalizeSearch } from '../../data/pattern-query';

interface LineValue {
  id: number;
  name: string;
  quantity: number;
  price: number;
  amount?: number;
}
interface LineEditor extends LineValue {
  form: FormGroup<Record<string, FormControl>>;
}

@Component({
  selector: 'app-pattern-inline-table',
  imports: [
    SdTable,
    SdTableCellDefDirective,
    SdTableTitleDefDirective,
    SdTableCommandHeaderDefDirective,
    SdInput,
    SdInputNumber,
    SdButton,
    SdInform,
    SdIcon,
    SdTooltipDirective,
    SdFormatNumberPipe,
  ],
  templateUrl: './inline-table.component.html',
  styleUrl: './inline-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineTableComponent implements OnInit {
  readonly variant = input('inline-edit');
  readonly table = viewChild.required(SdTable<LineEditor>);
  readonly rows = signal<LineEditor[]>([]);
  readonly saving = signal(false);
  readonly orderName = signal('Đơn hàng thiết bị văn phòng');
  readonly message = signal('');
  readonly severity = signal<'warning' | 'error' | 'success'>('warning');
  readonly serverErrors = signal<Record<number, string>>({});
  readonly revision = signal(0);
  readonly amounts = computed(() => {
    this.revision();
    return Object.fromEntries(
      this.rows().map(row => {
        const value = this.value(row);
        return [row.id, Number(value.quantity || 0) * Number(value.price || 0)];
      })
    );
  });
  readonly total = computed(() => Object.values(this.amounts()).reduce((sum, value) => sum + value, 0));
  private nextId = 1;
  private baseline = '';
  private readonly destroy = inject(DestroyRef);
  private readonly draft = inject(PatternDraft);
  private readonly subscriptions = new Map<number, { unsubscribe(): void }>();
  readonly option: SdTableOption<LineEditor> = {
    type: 'local',
    items: () => this.rows(),
    rowKey: 'id',
    selector: { visible: false },
    filter: { disabled: true },
    paginate: { hidden: true, pageSize: 1000 },
    columns: [
      { field: 'id', title: 'Dòng', type: 'number', width: '65px' },
      { field: 'name', title: 'Sản phẩm', type: 'string', width: '260px' },
      { field: 'quantity', title: 'Số lượng', type: 'number', width: '150px' },
      { field: 'price', title: 'Đơn giá', type: 'number', width: '180px' },
      { field: 'amount', title: 'Thành tiền', type: 'number', width: '160px', align: 'right' },
    ],
    command: {
      commands: [{ title: 'Xoá dòng', icon: 'delete', color: 'error', disabled: () => this.saving(), click: row => this.remove(row.id) }],
    },
  };

  ngOnInit(): void {
    this.rows.set([
      this.createRow('Máy in', this.variant() === 'inline-errors' ? 0 : 2, 3000000),
      this.createRow(this.variant() === 'inline-errors' ? '' : 'Màn hình', 1, 2500000),
    ]);
    this.baseline = this.snapshot();
    const dirty = () => this.snapshot() !== this.baseline;
    this.draft.dirty = dirty;
    this.draft.saving = () => this.saving();
    this.destroy.onDestroy(() => {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      if (this.draft.dirty === dirty) {
        this.draft.dirty = () => false;
        this.draft.saving = () => false;
      }
    });
  }

  private createRow(name: string, quantity: number, price: number): LineEditor {
    const row = { id: this.nextId++, name, quantity, price, form: new FormGroup<Record<string, FormControl>>({}) };
    this.subscriptions.set(
      row.id,
      row.form.valueChanges.subscribe(() => {
        this.revision.update(value => value + 1);
        this.serverErrors.update(errors => {
          const next = { ...errors };
          delete next[row.id];
          return next;
        });
      })
    );
    return row;
  }
  private value(row: LineEditor): LineValue {
    const value = row.form.getRawValue();
    return {
      id: row.id,
      name: 'name' in value ? (value['name'] ?? '') : row.name,
      quantity: 'quantity' in value ? value['quantity'] : row.quantity,
      price: 'price' in value ? value['price'] : row.price,
    };
  }
  private snapshot(): string {
    return JSON.stringify({
      name: this.variant() === 'order-lines' ? this.orderName() : '',
      rows: this.rows().map(row => this.value(row)),
    });
  }

  async add(): Promise<void> {
    if (this.saving()) return;
    this.rows.update(rows => [...rows, this.createRow('', 1, 0)]);
    this.message.set('');
    await this.table().reload(true);
  }
  async remove(id: number): Promise<void> {
    if (this.saving()) return;
    this.subscriptions.get(id)?.unsubscribe();
    this.subscriptions.delete(id);
    this.rows.update(rows => rows.filter(row => row.id !== id));
    this.serverErrors.update(errors => {
      const next = { ...errors };
      delete next[id];
      return next;
    });
    this.message.set('');
    await this.table().reload(true);
  }
  async save(): Promise<void> {
    if (this.saving()) return;
    this.message.set('');
    this.serverErrors.set({});
    const issues: string[] = [];
    if (this.variant() === 'order-lines' && !this.orderName().trim()) issues.push('Nhập tên đơn hàng.');
    if (!this.rows().length) issues.push('Thêm ít nhất một dòng hàng.');
    for (const row of this.rows()) {
      row.form.markAllAsTouched();
      const value = this.value(row);
      if (!value.name.trim()) {
        row.form.get('name')?.setErrors({ required: true });
        issues.push(`Dòng ${row.id}: nhập sản phẩm.`);
      }
      if (!Number.isInteger(value.quantity) || value.quantity < 1) issues.push(`Dòng ${row.id}: số lượng phải là số nguyên lớn hơn 0.`);
      if (value.price == null || !Number.isFinite(value.price) || value.price < 0)
        issues.push(`Dòng ${row.id}: đơn giá phải từ 0 trở lên.`);
    }
    if (issues.length) {
      this.severity.set('warning');
      this.message.set(issues.join(' '));
      return;
    }
    const values = this.rows().map(row => this.value(row));
    this.saving.set(true);
    this.rows().forEach(row => row.form.disable({ emitEvent: false }));
    await new Promise(resolve => setTimeout(resolve, 600));
    if (this.destroy.destroyed) return;
    this.rows().forEach(row => row.form.enable({ emitEvent: false }));
    this.saving.set(false);
    // BE mẫu yêu cầu mỗi sản phẩm xuất hiện một lần trong cùng đơn hàng.
    const duplicates = values.filter(row => values.filter(other => normalizeSearch(other.name) === normalizeSearch(row.name)).length > 1);
    if (duplicates.length) {
      this.serverErrors.set(Object.fromEntries(duplicates.map(row => [row.id, 'Sản phẩm đã có ở dòng khác.'])));
      this.severity.set('error');
      this.message.set(
        `Không thể lưu: sản phẩm bị trùng tại dòng ${duplicates.map(row => row.id).join(', ')}. Sửa sản phẩm hoặc xoá dòng trùng.`
      );
      return;
    }
    this.baseline = this.snapshot();
    this.severity.set('success');
    this.message.set(`Đã lưu ${values.length} dòng hàng trong phiên mẫu.`);
  }
}
