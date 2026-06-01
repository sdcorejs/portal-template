import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-instruction-instroduction',
  standalone: true,
  imports: [SdPageComponent],
  templateUrl: './instroduction.component.html',
  styleUrls: ['./instroduction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstroductionComponent {}
