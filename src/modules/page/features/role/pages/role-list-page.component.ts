import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdTable, SdTableOption, SdTableCellDefDirective } from '@sdcorejs/angular/components/table';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { RoleSessionStore } from '../data/role-session.store';
import { ROLE_MODULES } from '../data/role.fixtures';
import { ROLE_STATUSES, RoleLayout, RoleRecord, roleBaseUrl } from '../data/role.model';
interface RoleListRow extends RoleRecord {
  modules: string;
  permissionCount: number;
}
@Component({
  selector: 'app-role-list-page',
  providers: [RoleSessionStore],
  imports: [RouterLink, SdPageComponent, SdButton, SdTable, SdTableCellDefDirective, SdDataState],
  template: `<sd-page title="Danh sách vai trò"
    ><sd-button headerRight title="Tạo mới" type="fill" color="primary" prefixIcon="add" (click)="create()" />
    <div class="role-list">
      @if (loading()) {
        <sd-data-state state="loading" title="Đang tải vai trò…" />
      } @else if (error()) {
        <sd-data-state state="error" title="Không thể tải vai trò" [message]="error()" actionLabel="Thử lại" (sdAction)="load()" />
      } @else {
        <sd-table [autoId]="'roles-' + layout" [option]="option"
          ><ng-template sdTableCellDef="code" let-row="item"
            ><a [routerLink]="baseUrl + '/' + row.id + '/detail'" class="record-link">{{ row.code }}</a></ng-template
          ></sd-table
        >
      }
    </div></sd-page
  >`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-height: 0;
        min-width: 0;
      }
      .role-list {
        height: 100%;
        min-height: 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        padding: 16px;
      }
      sd-table {
        flex: 1;
        min-height: 0;
      }
      .record-link {
        color: var(--sd-primary);
        font-weight: 600;
        text-decoration: none;
      }
      .record-link:hover {
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        .role-list {
          padding: 12px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListPageComponent {
  readonly router = inject(Router);
  create(): void {
    void this.router.navigateByUrl(this.baseUrl + '/create');
  }
  readonly store = inject(RoleSessionStore);
  readonly route = inject(ActivatedRoute);
  readonly destroy = inject(DestroyRef);
  readonly layout = this.route.snapshot.data['roleLayout'] as RoleLayout;
  readonly baseUrl = roleBaseUrl(this.layout);
  readonly rows = signal<RoleListRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly option: SdTableOption<RoleListRow> = {
    type: 'local',
    items: () => this.rows(),
    rowKey: 'id',
    columns: [
      { field: 'code', title: 'Mã vai trò', type: 'string', width: '175px' },
      { field: 'name', title: 'Tên vai trò', type: 'string', width: '230px' },
      { field: 'modules', title: 'Module', type: 'string', width: '200px' },
      { field: 'permissionCount', title: 'Số quyền', type: 'number', width: '100px', align: 'right' },
      { field: 'users', title: 'Người dùng', type: 'number', width: '110px', align: 'right' },
      {
        field: 'status',
        title: 'Trạng thái',
        type: 'values',
        width: '160px',
        option: { items: ROLE_STATUSES, valueField: 'id', displayField: 'name' },
        useBadge: (_value, row) => ({
          type: 'round',
          title: row.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động',
          color: row.status === 'active' ? 'success' : 'secondary',
        }),
      },
      { field: 'updatedAt', title: 'Cập nhật', type: 'date', width: '130px' },
    ],
    paginate: { pageSize: 10, pages: [10, 20, 50] },
    config: { visible: true },
    filter: {
      cacheable: true,
      hideInlineFilter: true,
      hideExternalFilterToolbar: true,
      quickSearch: {
        containFields: ['code', 'name'],
        placeholder: 'Tìm mã hoặc tên vai trò',
        filters: [
          {
            field: 'status',
            title: 'Trạng thái',
            type: 'values',
            option: { items: ROLE_STATUSES, valueField: 'id', displayField: 'name' },
          },
        ],
      },
    },
  };
  constructor() {
    void this.load();
  }
  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const rows = await this.store.list(this.layout);
      if (this.destroy.destroyed) return;
      this.rows.set(
        rows.map(row => ({
          ...row,
          modules: ROLE_MODULES.filter(m => row.permissions.some(id => id.startsWith(m.id + '_')))
            .map(m => m.name)
            .join(', '),
          permissionCount: row.permissions.length,
        }))
      );
    } catch (error) {
      if (!this.destroy.destroyed) this.error.set(error instanceof Error ? error.message : 'Không thể tải dữ liệu.');
    } finally {
      if (!this.destroy.destroyed) this.loading.set(false);
    }
  }
}
SdTabComponent({ component: RoleListPageComponent, name: 'Vai trò', icon: 'shield' })(RoleListPageComponent);
