import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { SdTab, SdTabGroup } from '@sdcorejs/angular/components/tab';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdCheckbox } from '@sdcorejs/angular/forms/checkbox';
import { SdSection } from '@sdcorejs/angular/components/section';
import { ROLE_MODULES } from '../data/role.fixtures';
import { permissionsFor, selectionState, setPermissionScope } from '../data/role-permissions';
import type { RoleLayout, RoleModule } from '../data/role.model';
import { PermissionCheckComponent, PermissionSelectionChange } from './permission-check.component';
import { PermissionMatrixComponent } from './permission-matrix.component';
import { PermissionTreeComponent } from './permission-tree.component';
@Component({
  selector: 'app-role-permission-editor',
  imports: [
    SdTab,
    SdTabGroup,
    SdInput,
    SdCheckbox,
    SdSection,
    PermissionCheckComponent,
    PermissionMatrixComponent,
    PermissionTreeComponent,
  ],
  template: `<sd-section title="Phân quyền" [icon]="layout() === 'matrix' ? 'grid_view' : 'account_tree'">
    <span sdHeaderRight class="summary" role="status">{{ selected().length }} quyền · {{ selectedModules() }} module</span>
    <sd-tab-group [(selectedIndex)]="tab" [stretchTabs]="false" animationDuration="0ms">
      @for (module of modules; track module.id; let index = $index) {
        <sd-tab [label]="module.name" [badge]="moduleCount(module)">
          @if (tab() === index) {
            <div class="permission-toolbar">
              <sd-input label="Tìm chức năng hoặc quyền" [(model)]="search" size="sm" />
              <app-role-permission-check
                [selected]="selected()"
                [ids]="visibleIds()"
                label="Chọn tất cả quyền đang hiển thị"
                text="Chọn tất cả kết quả"
                [disabled]="disabled()"
                (changed)="select($event)" />
              <sd-checkbox label="Chức năng đã có quyền" [(model)]="onlySelected" />
            </div>
            @if (visibleEntities().length) {
              @if (layout() === 'matrix') {
                <app-role-permission-matrix
                  [module]="module"
                  [entities]="visibleEntities()"
                  [selected]="selected()"
                  [disabled]="disabled()"
                  (changed)="select($event)" />
              } @else {
                <app-role-permission-tree
                  [module]="module"
                  [entities]="visibleEntities()"
                  [selected]="selected()"
                  [disabled]="disabled()"
                  (changed)="select($event)" />
              }
            } @else {
              <p class="empty">Không có chức năng phù hợp. Thử từ khóa khác hoặc bỏ bộ lọc đã có quyền.</p>
            }
            <div class="legend">
              <span>{{ visibleEntities().length }} chức năng · {{ visibleIds().length }} quyền hiển thị</span
              ><span>{{ layout() === 'matrix' ? '— Không có quyền tương ứng' : 'Chọn hàng cha để chọn toàn bộ quyền con' }}</span>
            </div>
          }
        </sd-tab>
      }
    </sd-tab-group></sd-section
  >`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .summary {
        font-size: 12px;
        color: var(--sd-text-secondary);
      }
      .permission-toolbar {
        display: flex;
        gap: 8px 16px;
        align-items: center;
        flex-wrap: wrap;
        padding: 20px 20px 4px;
      }
      .permission-toolbar sd-input {
        width: 260px;
        max-width: 100%;
      }
      .permission-toolbar sd-checkbox {
        margin-left: auto;
      }
      .legend {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 20px;
        border-top: 1px solid var(--sd-border);
        font-size: 12px;
        color: var(--sd-text-secondary);
      }
      .empty {
        padding: 30px 20px;
        color: var(--sd-text-secondary);
      }
      @media (max-width: 600px) {
        .permission-toolbar {
          padding: 16px 12px 4px;
        }
        .permission-toolbar sd-checkbox {
          margin-left: 0;
        }
        .permission-toolbar sd-input {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolePermissionEditorComponent {
  readonly layout = input.required<RoleLayout>();
  readonly selected = model.required<string[]>();
  readonly disabled = input(false);
  readonly modules = ROLE_MODULES;
  readonly tab = signal(0);
  readonly search = signal('');
  readonly onlySelected = signal<unknown>(false);
  readonly module = computed(() => this.modules[this.tab()] ?? this.modules[0]);
  readonly visibleEntities = computed(() => {
    const query = (this.search() ?? '').trim().toLocaleLowerCase('vi');
    return this.module().entities.filter(entity => {
      const permissions = permissionsFor(this.module(), entity);
      return (
        (entity.name + ' ' + entity.hint + ' ' + permissions.map(p => p.label).join(' ')).toLocaleLowerCase('vi').includes(query) &&
        (!this.onlySelected() || permissions.some(p => this.selected().includes(p.id)))
      );
    });
  });
  readonly visibleIds = computed(() => this.visibleEntities().flatMap(e => permissionsFor(this.module(), e).map(p => p.id)));
  readonly selectedModules = computed(() => this.modules.filter(module => this.moduleCount(module) > 0).length);
  moduleCount(module: RoleModule): number {
    return selectionState(
      this.selected(),
      module.entities.flatMap(e => permissionsFor(module, e).map(p => p.id))
    ).count;
  }
  select(event: PermissionSelectionChange): void {
    if (!this.disabled()) this.selected.set(setPermissionScope(this.selected(), event.ids, event.checked));
  }
}
