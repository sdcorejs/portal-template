import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { PatternOrder, STATUS_LABELS } from '../data/pattern-query';
import { FormsModule } from '@angular/forms';
import { SdPermissionService } from '@sdcorejs/angular/modules/permission';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { PatternStore } from '../data/pattern-store';
@Component({
  selector: 'app-pattern-order-detail',
  imports: [SdButton, SdSideDrawer, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: '../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  private readonly permission = inject(SdPermissionService);
  private readonly store = inject(PatternStore);
  private readonly notify = inject(SdNotifyService);
  readonly canEdit = () => this.permission.hasPermission('OMS_ORDER_C_UPDATE');
  readonly editing = signal(false);
  readonly saving = signal(false);
  draft = { name: '', owner: '', amount: 0 };
  edit(): void {
    const row = this.record();
    if (!row || !this.canEdit()) return;
    this.draft = { name: row.name, owner: row.owner, amount: row.amount };
    this.editing.set(true);
  }
  async save(): Promise<void> {
    const row = this.record();
    if (!row || !this.canEdit() || this.saving()) return;
    if (!this.draft.name.trim() || !Number.isFinite(this.draft.amount) || this.draft.amount < 0) {
      this.notify.error('Nhập khách hàng và giá trị đơn hàng hợp lệ.');
      return;
    }
    this.saving.set(true);
    const updated = { ...row, ...this.draft };
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    this.store.records.update(rows => rows.map(item => (item.id === row.id ? updated : item)));
    this.record.set(updated);
    this.saving.set(false);
    this.editing.set(false);
    this.notify.success('Đã cập nhật đơn hàng.');
  }
  readonly beforeClose = () => !this.saving();
  readonly drawer = viewChild.required(SdSideDrawer);
  readonly record = signal<PatternOrder | null>(null);
  readonly labels = STATUS_LABELS;
  private readonly document = inject(DOCUMENT);
  private opener: HTMLElement | null = null;
  open(row: PatternOrder): void {
    this.editing.set(false);
    this.opener = this.document.activeElement as HTMLElement;
    this.record.set(row);
    this.drawer().open();
  }
  restore(): void {
    const opener = this.opener;
    requestAnimationFrame(() => {
      if (opener?.isConnected) opener.focus();
    });
  }
}
