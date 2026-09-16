import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdTooltipDirective } from '@sdcorejs/angular/directives';
import { SdIcon } from '@sdcorejs/angular/modules/icon';

@Component({
  selector: 'app-demo-property',
  imports: [SdSectionItem, SdTooltipDirective, SdIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sd-section-item label="" labelWidth="0px">
      <div class="property-row">
        <div class="property-label">
          <strong>{{ label() }}</strong>
          <button type="button" class="property-info" [attr.aria-label]="'Thông tin ' + label()" [sdTooltip]="description">
            <sd-icon name="info" size="sm" />
          </button>
        </div>
        <div class="property-control"><ng-content /></div>
      </div>
    </sd-section-item>
    <ng-template #description><ng-content select="[propertyDescription]" /></ng-template>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .property-row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .property-label {
      flex: 0 0 34%;
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }
    strong {
      font-weight: 600;
      overflow-wrap: anywhere;
    }
    .property-info {
      display: inline-flex;
      flex: none;
      align-items: center;
      padding: 2px;
      border: 0;
      background: none;
      color: var(--sd-primary, #005fc4);
      cursor: help;
    }
    .property-info:focus-visible {
      outline: 2px solid currentColor;
      border-radius: 4px;
    }
    .property-control {
      flex: 1;
      min-width: 0;
    }
  `,
})
export class DemoPropertyComponent {
  readonly label = input.required<string>();
}
