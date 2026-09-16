import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SdTable, SdTableCellDefDirective, SdTableTitleDefDirective, SdTableOption } from '@sdcorejs/angular/components/table';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { PermissionCheckComponent, PermissionSelectionChange } from './permission-check.component';
import { CRUD, permissionsFor, selectionState } from '../data/role-permissions';
import type { RoleModule, RoleEntity, RolePermission } from '../data/role.model';
interface MatrixRow {
  id: string;
  name: string;
  hint: string;
  ids: string[];
  VIEW?: string;
  CREATE?: string;
  UPDATE?: string;
  DELETE?: string;
  other: RolePermission[];
}
@Component({
  selector: 'app-role-permission-matrix',
  imports: [SdTable, SdTableCellDefDirective, SdTableTitleDefDirective, SdBadge, PermissionCheckComponent],
  template: `<sd-table autoId="role-permission-matrix" [option]="option()">
    <ng-template sdTableCellDef="name" let-row="item">
      <div class="d-flex align-items-center gap-8">
        @if (!viewed()) {
          <app-role-permission-check
            [selected]="selected()"
            [ids]="row.ids"
            [label]="'Chọn tất cả quyền ' + row.name"
            [disabled]="disabled()"
            (changed)="changed.emit($event)" />
        }
        <div class="d-flex flex-column gap-4">
          <div class="d-flex align-items-center gap-8">
            <strong>{{ row.name }}</strong>
            <sd-badge type="round" color="primary" [title]="'' + selectionState(selected(), row.ids).count" />
          </div>
          <small>{{ row.hint }}</small>
        </div>
      </div>
    </ng-template>
    @for (column of columns(); track column.action) {
      <ng-template [sdTableTitleDef]="column.action">
        @if (viewed()) {
          {{ column.label }}
        } @else {
          <app-role-permission-check
            [selected]="selected()"
            [ids]="column.ids"
            [label]="'Chọn ' + column.label + ' cho các chức năng đang hiển thị'"
            [text]="column.label"
            [disabled]="disabled()"
            (changed)="changed.emit($event)" />
        }
      </ng-template>
      <ng-template [sdTableCellDef]="column.action" let-row="item">
        @if (row[column.action]; as id) {
          @if (viewed()) {
            <sd-badge
              type="round"
              [color]="selected().includes(id) ? 'success' : 'secondary'"
              [title]="selected().includes(id) ? 'Có' : 'Không'" />
          } @else {
            <app-role-permission-check
              [selected]="selected()"
              [ids]="[id]"
              [label]="column.label + ' · ' + row.name"
              [disabled]="disabled()"
              (changed)="changed.emit($event)" />
          }
        } @else {
          <span [attr.aria-label]="'Không áp dụng ' + column.label">—</span>
        }
      </ng-template>
    }
    <ng-template sdTableCellDef="other" let-row="item">
      <div class="d-flex flex-wrap gap-8">
        @for (permission of row.other; track permission.id) {
          @if (viewed()) {
            @if (selected().includes(permission.id)) {
              <sd-badge type="round" color="primary" [title]="permission.label" />
            }
          } @else {
            <app-role-permission-check
              [selected]="selected()"
              [ids]="[permission.id]"
              [label]="permission.label + ' · ' + row.name"
              [text]="permission.label"
              [disabled]="disabled()"
              (changed)="changed.emit($event)" />
          }
        } @empty {
          <span>—</span>
        }
      </div>
    </ng-template>
  </sd-table>`,
  styles: [':host { display: block; min-width: 0; height: 400px; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionMatrixComponent {
  readonly module = input.required<RoleModule>();
  readonly entities = input.required<RoleEntity[]>();
  readonly selected = input.required<string[]>();
  readonly disabled = input(false);
  readonly viewed = input(false);
  readonly changed = output<PermissionSelectionChange>();
  readonly selectionState = selectionState;
  readonly rows = computed<MatrixRow[]>(() =>
    this.entities().map(entity => {
      const permissions = permissionsFor(this.module(), entity);
      return {
        id: entity.id,
        name: entity.name,
        hint: entity.hint,
        ids: permissions.map(p => p.id),
        ...Object.fromEntries(permissions.filter(p => p.type === 'CRUD').map(p => [p.action, p.id])),
        other: permissions.filter(p => p.type === 'Other'),
      };
    })
  );
  readonly columns = computed(() =>
    CRUD.map(column => ({
      ...column,
      ids: this.entities().flatMap(entity =>
        permissionsFor(this.module(), entity)
          .filter(p => p.action === column.action)
          .map(p => p.id)
      ),
    }))
  );
  readonly option = computed<SdTableOption<MatrixRow>>(() => {
    const rows = this.rows();
    return {
      type: 'local',
      items: () => rows,
      rowKey: 'id',
      columns: [
        { field: 'name', title: 'Chức năng', type: 'string', width: '290px' },
        ...CRUD.map(column => ({
          field: column.action as 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE',
          title: column.label,
          type: 'string' as const,
          width: '110px',
        })),
        { field: 'other', title: 'Other / Quyền khác', type: 'string', width: '320px' },
      ],
      paginate: { hidden: true, pageSize: Math.max(rows.length, 1) },
      filter: { disabled: true },
      sort: { enable: false },
      config: { visible: false },
    };
  });
}
