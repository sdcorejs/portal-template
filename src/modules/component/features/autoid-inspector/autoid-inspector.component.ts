import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal, viewChild } from '@angular/core';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdAutoidInspector } from '@sdcorejs/angular/components/autoid-inspector';
import { I18nService } from '@sdcorejs/angular/i18n';
import { DemoLabFrameComponent } from '../../../../shared/demo-lab/demo-lab-frame.component';

@Component({
  selector: 'app-autoid-inspector-demo',
  standalone: true,
  imports: [DemoLabFrameComponent, SdButton, SdAutoidInspector],
  templateUrl: './autoid-inspector.component.html',
  styleUrls: ['../../../../shared/demo-lab/demo-lab.scss', './autoid-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoidInspectorDemoComponent {
  readonly i18n = inject(I18nService);
  readonly inspector = viewChild(SdAutoidInspector);
  readonly mode = signal<'clean' | 'broken' | 'empty'>('clean');
  readonly enabled = signal(true);
  readonly scanned = signal(false);
  readonly error = signal(false);
  readonly nativeEnabled = signal(false);
  readonly fixtureAction = signal<'none' | 'save' | 'archive'>('none');
  readonly audit = computed(() => (this.scanned() ? this.inspector()?.audit() : null));
  readonly elements = computed(() => (this.scanned() ? (this.inspector()?.elements() ?? []) : []));
  readonly metadata = computed(() => JSON.stringify(this.elements(), null, 2));
  readonly highlighted = computed(() => this.inspector()?.highlightOn() ?? false);
  private nativeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.nativeTimer));
  }

  t(vi: string, en: string): string {
    return this.i18n.language() === 'en' ? en : vi;
  }

  setMode(mode: 'clean' | 'broken' | 'empty'): void {
    if (this.highlighted()) this.inspector()?.toggleHighlight();
    this.inspector()?.closePanel();
    this.mode.set(mode);
    this.scanned.set(false);
    this.error.set(false);
    this.fixtureAction.set('none');
  }

  reset(): void {
    clearTimeout(this.nativeTimer);
    this.setMode('clean');
    this.enabled.set(true);
    this.nativeEnabled.set(false);
  }

  scan(): void {
    if (!this.enabled()) return;
    this.error.set(false);
    try {
      const inspector = this.inspector();
      if (!inspector) throw new Error('Inspector is not mounted');
      inspector.refresh();
      this.scanned.set(true);
    } catch {
      this.scanned.set(false);
      this.error.set(true);
    }
  }

  toggleEnabled(): void {
    if (this.highlighted()) this.inspector()?.toggleHighlight();
    this.inspector()?.closePanel();
    this.nativeEnabled.set(false);
    this.enabled.update(value => !value);
  }

  highlight(): void {
    if (this.enabled() && this.scanned()) this.inspector()?.toggleHighlight();
  }

  exportJson(): void {
    if (!this.enabled() || !this.scanned() || !this.elements().length) return;
    try {
      this.inspector()?.exportJson();
    } catch {
      this.error.set(true);
    }
  }

  openNative(): void {
    if (!this.enabled()) return;
    this.nativeEnabled.set(true);
    clearTimeout(this.nativeTimer);
    // Wait for Angular to pass the supported enabled input before calling openPanel.
    this.nativeTimer = setTimeout(() => this.inspector()?.openPanel(), 0);
  }

  readonly code = `import { SdAutoidInspector } from '@sdcorejs/angular/components/autoid-inspector';

// <section #fixture> ... local controls with data-autoid ... </section>
// <sd-autoid-inspector #inspector
//   [config]="{ root: fixture, extraRequireSelectors: ['input', 'button'] }" />
inspector.refresh();
const audit = inspector.audit();
const elements = inspector.elements();
inspector.toggleHighlight();
inspector.exportJson();
// No generator host: this demo audits and exports local metadata only.`;
}

SdTabComponent({ component: AutoidInspectorDemoComponent, name: 'AutoId Inspector', icon: 'fact_check' })(AutoidInspectorDemoComponent);
