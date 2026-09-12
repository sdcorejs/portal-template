import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { PermissionCheckComponent, PermissionSelectionChange } from './permission-check.component';
import { permissionsFor, selectionState } from '../data/role-permissions';
import type { RoleModule, RoleEntity } from '../data/role.model';
@Component({
  selector: 'app-role-permission-tree',
  imports: [PermissionCheckComponent, SdBadge],
  template: `<div class="permission-scroll" tabindex="0" role="region" aria-label="Bảng quyền phân cấp có thể cuộn ngang">
    <table class="permission-table tree">
      <caption class="sr-only">
        Chức năng và các quyền con
      </caption>
      <thead>
        <tr>
          <th scope="col">Chức năng / Quyền</th>
          <th scope="col">Nhóm thao tác</th>
          <th scope="col">Phạm vi chức năng</th>
          <th scope="col" class="check-column">Cho phép</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.entity.id) {
          <tr class="parent">
            <th scope="row">
              <div class="tree-title">
                <button
                  type="button"
                  class="expand"
                  [attr.aria-expanded]="!collapsed().includes(row.entity.id)"
                  [attr.aria-label]="(collapsed().includes(row.entity.id) ? 'Mở rộng ' : 'Thu gọn ') + row.entity.name"
                  (click)="toggle(row.entity.id)">
                  {{ collapsed().includes(row.entity.id) ? '›' : '⌄' }}</button
                >{{ row.entity.name }} <span class="count">{{ selectionState(selected(), row.ids).count }} / {{ row.ids.length }}</span>
              </div>
            </th>
            <td></td>
            <td class="hint">{{ row.entity.hint }}</td>
            <td class="check-column">
              <app-role-permission-check
                [selected]="selected()"
                [ids]="row.ids"
                [label]="'Chọn tất cả quyền ' + row.entity.name"
                [disabled]="disabled()"
                (changed)="changed.emit($event)" />
            </td>
          </tr>
          @if (!collapsed().includes(row.entity.id)) {
            @for (permission of row.permissions; track permission.id) {
              <tr>
                <td class="child">{{ permission.label }}</td>
                <td><sd-badge type="tag" [title]="permission.type" [color]="permission.type === 'Other' ? 'warning' : 'secondary'" /></td>
                <td class="muted">{{ row.entity.name }}</td>
                <td class="check-column">
                  <app-role-permission-check
                    [selected]="selected()"
                    [ids]="[permission.id]"
                    [label]="permission.label + ' · ' + row.entity.name"
                    [disabled]="disabled()"
                    (changed)="changed.emit($event)" />
                </td>
              </tr>
            }
          }
        }
      </tbody>
    </table>
  </div>`,
  styleUrl: './permission-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionTreeComponent {
  readonly module = input.required<RoleModule>();
  readonly entities = input.required<RoleEntity[]>();
  readonly selected = input.required<string[]>();
  readonly disabled = input(false);
  readonly changed = output<PermissionSelectionChange>();
  readonly collapsed = signal<string[]>([]);
  readonly selectionState = selectionState;
  readonly rows = computed(() =>
    this.entities().map(entity => {
      const permissions = permissionsFor(this.module(), entity);
      return { entity, permissions, ids: permissions.map(p => p.id) };
    })
  );
  toggle(id: string): void {
    this.collapsed.update(ids => (ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]));
  }
}
