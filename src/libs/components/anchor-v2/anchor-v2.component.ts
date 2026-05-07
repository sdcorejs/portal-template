import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-anchor-v2',
  standalone: true,
  imports: [RouterOutlet, SdPageComponent],
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnchorV2Component {}
