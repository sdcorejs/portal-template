import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SdCheckbox } from '@sdcorejs/angular/forms/checkbox';
import { selectionState } from '../data/role-permissions';
export interface PermissionSelectionChange {
  ids: readonly string[];
  checked: boolean;
}
@Component({
  selector: 'app-role-permission-check',
  imports: [SdCheckbox],
  template: `<sd-checkbox
    size="sm"
    [model]="state().checked"
    [disabled]="disabled() || !ids().length"
    [label]="text()"
    [attr.aria-label]="label()"
    [title]="label()"
    (modelChange)="changed.emit({ ids: ids(), checked: $event === true })" />`,
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
