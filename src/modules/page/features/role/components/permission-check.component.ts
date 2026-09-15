import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { selectionState } from '../data/role-permissions';
export interface PermissionSelectionChange {
  ids: readonly string[];
  checked: boolean;
}
@Component({
  selector: 'app-role-permission-check',
  imports: [MatCheckboxModule],
  template: `<mat-checkbox
    [checked]="state().checked"
    [indeterminate]="state().mixed"
    [disabled]="disabled() || !ids().length"
    [aria-label]="label()"
    (change)="changed.emit({ ids: ids(), checked: $event.checked })"
    >{{ text() }}</mat-checkbox
  >`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
      }
      mat-checkbox {
        --mdc-checkbox-selected-icon-color: var(--sd-primary);
        --mat-checkbox-selected-icon-color: var(--sd-primary);
        --mat-checkbox-selected-checkmark-color: var(--sd-primary-contrast, #fff);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionCheckComponent {
  readonly selected = input.required<readonly string[]>();
  readonly ids = input.required<readonly string[]>();
  readonly label = input.required<string>();
  readonly text = input('');
  readonly disabled = input(false);
  readonly state = computed(() => selectionState(this.selected(), this.ids()));
  readonly changed = output<PermissionSelectionChange>();
}
