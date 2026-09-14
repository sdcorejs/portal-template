import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-pattern-headers',
  imports: [SdButton, SdBadge, RouterLink],
  templateUrl: './headers.component.html',
  styleUrl: '../../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadersComponent {
  readonly variant = input('title');
  readonly editing = signal(false);
}
