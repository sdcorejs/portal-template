import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PermissionCheckComponent, PermissionSelectionChange } from './permission-check.component';
import { CRUD, permissionsFor, selectionState } from '../data/role-permissions';
import type { RoleModule, RoleEntity } from '../data/role.model';
@Component({
  selector: 'app-role-permission-matrix',
  imports: [PermissionCheckComponent],
  template: `<div class="permission-scroll" tabindex="0" role="region" aria-label="Ma trận quyền có thể cuộn ngang">
    <table class="permission-table matrix">
      <caption class="sr-only">
        Ma trận phân quyền theo chức năng
      </caption>
      <thead>
        <tr>
          <th scope="col" class="feature">Chức năng</th>
          @for (column of columns(); track column.action) {
            <th scope="col" class="crud">
              <app-role-permission-check
                [selected]="selected()"
                [ids]="column.ids"
                [label]="'Chọn ' + column.label + ' cho các chức năng đang hiển thị'"
                [text]="column.label"
                [disabled]="disabled()"
                (changed)="changed.emit($event)" />
            </th>
          }
          <th scope="col" class="other">Other <span class="muted">/ Quyền khác</span></th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.entity.id) {
          <tr>
            <th scope="row" class="feature">
              <div class="feature-label">
                <app-role-permission-check
                  [selected]="selected()"
                  [ids]="row.ids"
                  [label]="'Chọn tất cả quyền ' + row.entity.name"
                  [disabled]="disabled()"
                  (changed)="changed.emit($event)" />
                <div>
                  <strong>{{ row.entity.name }}</strong
                  ><span class="hint">{{ row.entity.hint }}</span>
                </div>
                <span class="count">{{ selectionState(selected(), row.ids).count }}</span>
              </div>
            </th>
            @for (cell of row.crud; track cell.action) {
              <td class="crud">
                @if (cell.id) {
                  <app-role-permission-check
                    [selected]="selected()"
                    [ids]="[cell.id]"
                    [label]="cell.label + ' · ' + row.entity.name"
                    [disabled]="disabled()"
                    (changed)="changed.emit($event)" />
                } @else {
                  <span class="muted" [attr.aria-label]="'Không áp dụng ' + cell.label">—</span>
                }
              </td>
            }
            <td>
              <div class="other-options">
                @for (permission of row.other; track permission.id) {
                  <app-role-permission-check
                    [selected]="selected()"
                    [ids]="[permission.id]"
                    [label]="permission.label + ' · ' + row.entity.name"
                    [text]="permission.label"
                    [disabled]="disabled()"
                    (changed)="changed.emit($event)" />
                } @empty {
                  <span class="muted">—</span>
                }
              </div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>`,
  styleUrl: './permission-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionMatrixComponent {
  readonly module = input.required<RoleModule>();
  readonly entities = input.required<RoleEntity[]>();
  readonly selected = input.required<string[]>();
  readonly disabled = input(false);
  readonly changed = output<PermissionSelectionChange>();
  readonly selectionState = selectionState;
  readonly rows = computed(() =>
    this.entities().map(entity => {
      const permissions = permissionsFor(this.module(), entity);
      return {
        entity,
        ids: permissions.map(p => p.id),
        crud: CRUD.map(column => ({ ...column, id: permissions.find(p => p.action === column.action)?.id })),
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
}
