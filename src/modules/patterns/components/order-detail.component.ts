import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { PatternOrder, STATUS_LABELS } from '../data/pattern-query';
@Component({
  selector: 'app-pattern-order-detail',
  imports: [SdButton, SdSideDrawer],
  templateUrl: './order-detail.component.html',
  styleUrl: '../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  readonly drawer = viewChild.required(SdSideDrawer);
  readonly record = signal<PatternOrder | null>(null);
  readonly labels = STATUS_LABELS;
  private readonly document = inject(DOCUMENT);
  private opener: HTMLElement | null = null;
  open(row: PatternOrder): void {
    this.opener = this.document.activeElement as HTMLElement;
    this.record.set(row);
    this.drawer().open();
  }
  restore(): void {
    const opener = this.opener;
    requestAnimationFrame(() => {
      if (opener?.isConnected) opener.focus();
    });
  }
}
