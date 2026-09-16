import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdTextarea } from '@sdcorejs/angular/forms/textarea';
import { SdSection } from '@sdcorejs/angular/components/section';
import { DemoEntity, STATUS_OPTIONS, GROUP_OPTIONS } from '../data/models';
@Component({
  selector: 'app-entity-form-sections',
  imports: [SdInput, SdInputNumber, SdSelect, SdTextarea, SdSection],
  templateUrl: './entity-form-sections.component.html',
  styleUrl: './entity-form-sections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityFormSectionsComponent {
  readonly form = input.required<FormGroup>();
  readonly seed = input.required<DemoEntity>();
  readonly extended = input(false);
  readonly compact = input(false);
  readonly editing = input(false);
  readonly statuses = STATUS_OPTIONS;
  readonly groups = GROUP_OPTIONS;
}
