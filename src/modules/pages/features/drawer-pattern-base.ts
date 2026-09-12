import { DOCUMENT } from '@angular/common';
import { Directive, afterRenderEffect, computed, inject, signal, untracked, viewChild } from '@angular/core';
import { SdTableOption } from '@sdcorejs/angular/components/table';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdUnsavedChangesService } from '@sdcorejs/angular/services/unsaved-changes';
import { DemoSessionStore } from '../data/demo-session.store';
import { DemoEntity, STATUS_OPTIONS } from '../data/models';
import { PageNavigation } from '../reference/page-navigation';
import { statusBadge } from '../components/status-badge';
import { FormPatternBase } from './form-simple/form-simple.component';
@Directive()
export abstract class DrawerPatternBase {
  readonly store = inject(DemoSessionStore);
  readonly navigation = inject(PageNavigation);
  readonly unsaved = inject(SdUnsavedChangesService);
  private readonly document = inject(DOCUMENT);
  private opener: HTMLElement | null = null;
  readonly drawer = viewChild.required(SdSideDrawer);
  readonly editor = viewChild<FormPatternBase>('editor');
  readonly opened = signal(false);
  readonly entity = computed(() => this.store.records().find(row => row.id === this.store.selectedId()));
  readonly title = computed(() =>
    this.store.mode() === 'create'
      ? 'Tạo hồ sơ'
      : (this.store.mode() === 'update' ? 'Cập nhật #' : 'Chi tiết #') + (this.entity()?.code ?? this.store.selectedId())
  );
  readonly option = computed<SdTableOption<DemoEntity>>(() => {
    const rows = this.store.records();
    return {
      type: 'local',
      rowKey: 'id',
      items: () => rows,
      columns: [
        { field: 'code', title: 'Mã', type: 'string', width: '150px' },
        { field: 'name', title: 'Tên hồ sơ', type: 'string' },
        {
          field: 'status',
          title: 'Trạng thái',
          type: 'values',
          width: '180px',
          option: { items: STATUS_OPTIONS, valueField: 'id', displayField: 'name' },
          useBadge: (_value, row) => statusBadge(row.status, this.store.kind === 'category' ? 'round' : 'tag'),
        },
      ],
      paginate: { pageSize: 10 },
    };
  });
  constructor() {
    afterRenderEffect(() => {
      const view = this.navigation.view();
      const drawer = this.drawer();
      untracked(() => {
        if (view === 'list') {
          this.opened.set(false);
          drawer.forceClose();
        } else {
          this.opened.set(true);
          drawer.open();
        }
      });
    });
  }
  openLink(event: MouseEvent, row: DemoEntity) {
    if (!this.opened()) this.opener = this.document.activeElement as HTMLElement | null;
    this.navigation.openLink(event, row.id);
  }
  open(mode: 'detail' | 'create' | 'update', row?: DemoEntity) {
    if (!this.opened()) this.opener = this.document.activeElement as HTMLElement | null;
    return this.navigation.go(mode, row?.id);
  }
  readonly beforeClose = async () => {
    if (!(await this.unsaved.confirmLeave({ scope: this.store, reason: 'close' }))) return false;
    await this.navigation.backToList();
    return true;
  };
  back() {
    if (this.store.mode() === 'detail') void this.navigation.backToList();
    else void this.editor()?.cancel();
  }
  save() {
    void this.editor()?.save();
  }
  onClosed() {
    const opener = this.opener;
    requestAnimationFrame(() => {
      if (opener?.isConnected) opener.focus();
    });
  }
}
