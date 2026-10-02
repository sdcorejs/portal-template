import { ChangeDetectionStrategy, Component, computed, afterRenderEffect, inject, signal, untracked, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SdTable, SdTableCellDefDirective, SdTableRowMobileDefDirective, type SdTableOption } from '@sdcorejs/angular/components/table';
import { SdCard, SdCardGroup } from '@sdcorejs/angular/components/card';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdFormRender } from '@sdcorejs/angular/components/form-generic';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdNotifyService } from '@sdcorejs/angular/services/notify';
import { WorkspaceStore, type WorkspaceRequest } from '../data/workspace.store';
import { WORKSPACE_STATUSES, WORKSPACE_TEAMS } from '../data/workspace.seed';

@Component({
  selector: 'app-workspace-queue',
  standalone: true,
  imports: [
    SdTable,
    SdTableCellDefDirective,
    SdTableRowMobileDefDirective,
    SdCard,
    SdCardGroup,
    SdDataState,
    SdSection,
    SdSideDrawer,
    SdFormRender,
    SdButton,
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceQueueComponent {
  readonly store = inject(WorkspaceStore);
  readonly #router = inject(Router);
  readonly #notify = inject(SdNotifyService);
  readonly drawer = viewChild.required(SdSideDrawer);
  readonly table = viewChild(SdTable);
  readonly status = signal<string | null>('all');
  readonly state = signal<'success' | 'empty' | 'error' | 'loading'>('success');
  readonly selectedId = signal<string | null>(null);
  readonly selected = computed(() => this.store.requests().find(row => row.id === this.selectedId()) ?? null);
  readonly selectedFiles = computed(() => this.store.files().filter(file => this.selected()?.attachments.includes(file.id)));
  readonly cards = computed(() => [
    { id: 'all', title: 'Tất cả', count: this.store.requests().length },
    ...WORKSPACE_STATUSES.map(status => ({
      id: status.id,
      title: status.name,
      count: this.store.requests().filter(row => row.status === status.id).length,
    })),
  ]);
  readonly tableOption = computed<SdTableOption<WorkspaceRequest>>(() => {
    return {
      type: 'local',
      key: 'workspace-22-3-queue',
      rowKey: 'id',
      sort: { enable: true },
      items: () => this.store.requests().filter(row => !this.status() || this.status() === 'all' || row.status === this.status()),
      columns: [
        { field: 'code', title: 'Mã đề nghị', type: 'string', width: '140px', sortable: true },
        { field: 'project', title: 'Dự án', type: 'string', width: '260px', sortable: true },
        {
          field: 'team',
          sortable: true,
          title: 'Nhóm',
          type: 'values',
          width: '150px',
          option: { items: WORKSPACE_TEAMS, valueField: 'id', displayField: 'name' },
        },
        { field: 'amount', title: 'Ngân sách (VND)', type: 'number', width: '170px', align: 'right', aggregate: 'SUM', sortable: true },
        {
          field: 'status',
          sortable: true,
          title: 'Trạng thái',
          type: 'values',
          width: '160px',
          option: { items: WORKSPACE_STATUSES, valueField: 'id', displayField: 'name' },
          useBadge: value => ({
            type: 'round',
            color: WORKSPACE_STATUSES.find(item => item.id === value)?.color ?? 'secondary',
            icon: WORKSPACE_STATUSES.find(item => item.id === value)?.icon,
          }),
        },
      ],
      aggregate: { scope: 'filtered' },
      config: { visible: true, resizable: true },
      paginate: { pageSize: 8, pages: [8, 16, 24] },
      filter: {
        hideInlineFilter: true,
        hideExternalFilterToolbar: true,
        quickSearch: { containFields: ['code', 'project'], placeholder: 'Tìm mã hoặc tên dự án, rồi Enter' },
      },
      selector: {
        visible: true,
        disabled: row => row.status !== 'pending',
        actions: [{ title: 'Duyệt đã chọn', icon: 'done_all', color: 'success', click: rows => this.approve(rows ?? []) }],
      },
      commands: [
        {
          title: 'Duyệt',
          icon: 'check_circle',
          color: 'success',
          disabled: row => row.status !== 'pending',
          click: row => this.approve([row]),
        },
      ],
      mobile: { rowLabel: row => row.code + ' · ' + row.project },
    };
  });
  readonly mobileRows = computed(
    () =>
      new Map(
        this.store.requests().map(row => [
          row.id,
          {
            ...row,
            amountLabel: row.amount.toLocaleString('vi-VN'),
            statusLabel: WORKSPACE_STATUSES.find(status => status.id === row.status)?.name ?? row.status,
          },
        ])
      )
  );
  constructor() {
    afterRenderEffect(() => {
      this.store.requests();
      this.status();
      const table = this.table();
      // Keep the option identity stable: reload data through the public API to retain search and sort state.
      untracked(() => table?.reload());
    });
  }
  open(row: WorkspaceRequest): void {
    this.selectedId.set(row.id);
    this.drawer().open();
  }
  approve(rows: WorkspaceRequest[]): void {
    const count = this.store.approve(rows.map(row => row.id));
    if (count) this.#notify.success('Đã duyệt ' + count + ' đề nghị trong phiên demo.');
  }
  create(): void {
    void this.#router.navigate(['/utility/workspace/request']);
  }
  restore(): void {
    this.state.set('success');
  }
  async reload(): Promise<void> {
    this.state.set('loading');
    await this.store.wait();
    this.state.set('success');
  }
}
