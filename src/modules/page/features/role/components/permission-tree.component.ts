import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SdTable, SdTableCellDefDirective, SdTableOption } from '@sdcorejs/angular/components/table';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { PermissionCheckComponent, PermissionSelectionChange } from './permission-check.component';
import { permissionsFor, selectionState } from '../data/role-permissions';
import type { RoleModule, RoleEntity } from '../data/role.model';
interface PermissionRow {
  id: string;
  name: string;
  type: string;
  scope: string;
  ids: string[];
  children?: PermissionRow[];
}
@Component({
  selector: 'app-role-permission-tree',
  imports: [SdTable, SdTableCellDefDirective, PermissionCheckComponent, SdBadge],
  template: `<sd-table autoId="role-permission-tree" [option]="option()">
    <ng-template sdTableCellDef="name" let-row="item">
      <span>{{ row.name }}</span>
      @if (row.children) {
        <sd-badge class="ml-8" type="round" color="primary" [title]="selectionState(selected(), row.ids).count + ' / ' + row.ids.length" />
      }
    </ng-template>
    <ng-template sdTableCellDef="type" let-row="item">
      @if (row.type) {
        <sd-badge type="tag" [title]="row.type" [color]="row.type === 'Other' ? 'warning' : 'secondary'" />
      }
    </ng-template>
    <ng-template sdTableCellDef="ids" let-row="item">
      @if (viewed()) {
        @if (!row.children) {
          @if (row.type === 'Other' && selected().includes(row.id)) {
            <sd-badge type="round" color="primary" [title]="row.name" />
          } @else {
            <sd-badge
              type="round"
              [color]="selected().includes(row.id) ? 'success' : 'secondary'"
              [title]="selected().includes(row.id) ? 'Có' : 'Không'" />
          }
        }
      } @else {
        <app-role-permission-check
          [selected]="selected()"
          [ids]="row.ids"
          [label]="row.children ? 'Chọn tất cả quyền ' + row.name : row.name + ' · ' + row.scope"
          [disabled]="disabled()"
          (changed)="changed.emit($event)" />
      }
    </ng-template>
  </sd-table>`,
  styles: [':host { display: block; min-width: 0; height: 520px; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionTreeComponent {
  readonly module = input.required<RoleModule>();
  readonly entities = input.required<RoleEntity[]>();
  readonly selected = input.required<string[]>();
  readonly disabled = input(false);
  readonly viewed = input(false);
  readonly changed = output<PermissionSelectionChange>();
  readonly selectionState = selectionState;
  readonly rows = computed<PermissionRow[]>(() =>
    this.entities().map(entity => {
      const permissions = permissionsFor(this.module(), entity);
      return {
        id: entity.id,
        name: entity.name,
        type: '',
        scope: entity.hint,
        ids: permissions.map(p => p.id),
        children: permissions.map(p => ({ id: p.id, name: p.label, type: p.type, scope: entity.name, ids: [p.id] })),
      };
    })
  );
  readonly option = computed<SdTableOption<PermissionRow>>(() => {
    const rows = this.rows();
    return {
      type: 'local',
      items: () => rows,
      rowKey: 'id',
      columns: [
        { field: 'name', title: 'Chức năng / Quyền', type: 'string', width: '340px' },
        { field: 'type', title: 'Nhóm thao tác', type: 'string', width: '140px' },
        { field: 'scope', title: 'Phạm vi chức năng', type: 'string', width: '280px' },
        { field: 'ids', title: 'Cho phép', type: 'string', width: '100px' },
      ],
      tree: { loadType: 'static', childrenKey: 'children', defaultExpanded: true },
      paginate: { hidden: true, pageSize: Math.max(rows.length, 1) },
      filter: { disabled: true },
      sort: { enable: false },
      config: { visible: false },
    };
  });
}
