import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdModalResizable } from '@sdcorejs/angular/components/modal-resizable';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { I18nService } from '@sdcorejs/angular/i18n';
import { DemoLabFrameComponent } from '../../../../shared/demo-lab/demo-lab-frame.component';
@Component({
  selector: 'app-modal-resizable-demo',
  standalone: true,
  imports: [DemoLabFrameComponent, SdButton, SdModalResizable],
  templateUrl: './modal-resizable.component.html',
  styleUrl: '../../../../shared/demo-lab/demo-lab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalResizableDemoComponent {
  readonly i18n = inject(I18nService);
  readonly panelGeneration = signal(0);
  readonly panelA = viewChild<SdModalResizable>('panelA');
  readonly panelB = viewChild<SdModalResizable>('panelB');
  readonly width = signal(Math.min(420, window.innerWidth - 24) + 'px');
  readonly narrow = signal(window.innerWidth < 900);
  readonly locked = signal(false);
  readonly busy = signal(false);
  readonly failNext = signal(false);
  readonly noteA = signal('');
  readonly noteB = signal('');
  readonly savedA = signal('');
  readonly savedB = signal('');
  readonly status = signal('ready');
  private epoch = 0;
  private viewportWidth = window.innerWidth;
  constructor() {
    inject(DestroyRef).onDestroy(() => this.epoch++);
  }
  t(vi: string, en: string): string {
    return this.i18n.language() === 'en' ? en : vi;
  }
  @HostListener('window:resize') resize(): void {
    if (window.innerWidth === this.viewportWidth) return;
    this.viewportWidth = window.innerWidth;
    this.epoch++;
    this.panelA()?.close();
    this.panelB()?.close();
    this.busy.set(false);
    this.width.set(Math.min(420, window.innerWidth - 24) + 'px');
    this.narrow.set(window.innerWidth < 900);
    // New native instances discard cached pixel widths and pending arrangement timers.
    this.panelGeneration.update(value => value + 1);
  }
  open(which: 'a' | 'b'): void {
    if (this.busy()) return;
    if (this.narrow()) (which === 'a' ? this.panelB() : this.panelA())?.close();
    const panel = which === 'a' ? this.panelA() : this.panelB();
    panel?.open();
    if (panel && !panel.isEditing()) panel.toggleEditable();
  }
  async save(which: 'a' | 'b'): Promise<void> {
    const panel = which === 'a' ? this.panelA() : this.panelB();
    const note = (which === 'a' ? this.noteA() : this.noteB()).trim();
    if (this.locked() || this.busy() || !note || note.length > 120 || !panel?.isOpened()) return;
    const epoch = ++this.epoch;
    const fail = this.failNext();
    this.failNext.set(false);
    this.busy.set(true);
    panel.startLoading();
    await new Promise<void>(resolve => setTimeout(resolve, 650));
    if (epoch !== this.epoch) return;
    panel.stopLoading();
    this.busy.set(false);
    if (!panel.isOpened() || this.locked()) return;
    if (fail) this.status.set('error');
    else {
      (which === 'a' ? this.savedA : this.savedB).set(note);
      this.status.set('saved');
    }
  }
  reset(): void {
    this.epoch++;
    this.panelA()?.close();
    this.panelB()?.close();
    this.busy.set(false);
    this.locked.set(false);
    this.failNext.set(false);
    this.noteA.set('');
    this.noteB.set('');
    this.savedA.set('');
    this.savedB.set('');
    this.status.set('ready');
  }
  lock(): void {
    this.epoch++;
    this.panelA()?.stopLoading();
    this.panelB()?.stopLoading();
    this.busy.set(false);
    this.locked.set(!this.locked());
  }
}
SdTabComponent({ component: ModalResizableDemoComponent, name: 'Modal Resizable', icon: 'view_sidebar' })(ModalResizableDemoComponent);
