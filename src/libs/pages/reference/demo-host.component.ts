import { ChangeDetectionStrategy, Component, input, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
/** A mounted outlet survives documentation tab switches; parent controls session reset. */
@Component({
  selector: 'app-demo-host',
  imports: [NgComponentOutlet],
  templateUrl: './demo-host.component.html',
  styleUrl: './demo-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoHostComponent {
  readonly component = input.required<Type<unknown>>();
}
