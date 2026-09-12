import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdTextarea } from '@sdcorejs/angular/forms/textarea';
import { SdSection } from '@sdcorejs/angular/components/section';
import { ROLE_STATUSES, RoleRecord } from '../data/role.model';
@Component({
  selector: 'app-role-information-form',
  imports: [SdInput, SdSelect, SdTextarea, SdSection],
  template: `<sd-section title="Thông tin vai trò" icon="shield"
    ><div class="role-fields" [class.view]="viewed()">
      <sd-input
        label="Mã vai trò"
        name="code"
        [form]="form()"
        [model]="seed().code"
        [disabled]="editing()"
        [viewed]="viewed()"
        [maxlength]="40"
        required />
      <sd-input label="Tên vai trò" name="name" [form]="form()" [model]="seed().name" [viewed]="viewed()" [maxlength]="120" required />
      <sd-select
        label="Trạng thái"
        name="status"
        [form]="form()"
        [model]="seed().status"
        [viewed]="viewed()"
        [items]="statuses"
        valueField="id"
        displayField="name"
        [clearable]="false"
        required />
      <sd-textarea
        class="description"
        label="Mô tả"
        [rows]="2"
        name="description"
        [form]="form()"
        [model]="seed().description"
        [viewed]="viewed()"
        [maxlength]="400" /></div
  ></sd-section>`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      .role-fields {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        padding: 20px;
        gap: 8px 16px;
      }
      .role-fields > * {
        min-width: 0;
      }
      .role-fields.view {
        row-gap: 16px;
      }
      .description {
        grid-column: 1/-1;
      }
      @media (max-width: 1000px) {
        .role-fields {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 600px) {
        .role-fields {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleInformationFormComponent {
  readonly form = input.required<FormGroup>();
  readonly seed = input.required<RoleRecord>();
  readonly viewed = input(false);
  readonly editing = input(false);
  readonly statuses = ROLE_STATUSES;
}
