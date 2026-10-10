import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { selectionState } from '../data/role-permissions';
export interface PermissionSelectionChange {
  ids: readonly string[];
  checked: boolean;
}
@Component({
  selector: 'app-role-permission-check',
  imports: [MatCheckbox],
  // Core's checkbox has no public indeterminate/name inputs; this scoped control needs both.
  template: `<mat-checkbox
    [checked]="state().checked"
    [indeterminate]="state().mixed"
    [disabled]="disabled() || !ids().length"
    [aria-label]="label()"
    [title]="label()"
    (change)="changed.emit({ ids: ids(), checked: $event.checked })"
    >{{ text() }}</mat-checkbox
  >`,
  styles: [':host { display: inline-flex; align-items: center; }'],
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
