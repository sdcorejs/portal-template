import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdOrgChart, SdOrgChartItemDefDirective, type SdOrgChartItem } from '@sdcorejs/angular/components/org-chart';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { I18nService } from '@sdcorejs/angular/i18n';
import { DemoLabFrameComponent } from '../../../../shared/demo-lab/demo-lab-frame.component';
@Component({
  selector: 'app-org-chart-demo',
  standalone: true,
  imports: [DemoLabFrameComponent, SdButton, SdOrgChart, SdOrgChartItemDefDirective],
  templateUrl: './org-chart.component.html',
  styleUrl: '../../../../shared/demo-lab/demo-lab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartDemoComponent {
  readonly i18n = inject(I18nService);
  readonly generation = signal(0);
  readonly state = signal<'ready' | 'loading' | 'error' | 'empty'>('ready');
  readonly locked = signal(false);
  readonly selected = signal<SdOrgChartItem | null>(null);
  private epoch = 0;
  readonly items = computed<SdOrgChartItem[]>(() =>
    this.state() !== 'ready'
      ? []
      : [
          {
            id: 'harbor',
            title: this.t('Dự án Harbor', 'Harbor project'),
            description: this.t('Điều phối dự án', 'Project coordination'),
            children: [
              {
                id: 'ops',
                title: this.t('Nhóm vận hành', 'Operations team'),
                description: 'OPS · Linh',
                children: [
                  { id: 'receiving', title: this.t('Tiếp nhận', 'Receiving'), description: 'OPS-102 · Minh' },
                  { id: 'scanning', title: this.t('Thiết bị', 'Devices'), description: 'OPS-101 · Linh' },
                ],
              },
              { id: 'support', title: this.t('Nhóm hỗ trợ', 'Support team'), description: 'SUP · Mai' },
            ],
          },
        ]
  );
  constructor() {
    inject(DestroyRef).onDestroy(() => this.epoch++);
  }
  t(vi: string, en: string): string {
    return this.i18n.language() === 'en' ? en : vi;
  }
  async load(fail = false): Promise<void> {
    const epoch = ++this.epoch;
    this.state.set('loading');
    this.selected.set(null);
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    if (epoch !== this.epoch) return;
    this.state.set(fail ? 'error' : 'ready');
  }
  reset(): void {
    this.epoch++;
    this.state.set('ready');
    this.generation.update(x => x + 1);
    this.locked.set(false);
    this.selected.set(null);
  }
  empty(): void {
    this.epoch++;
    this.state.set('empty');
    this.selected.set(null);
  }
  label(item: SdOrgChartItem): string {
    const pairs: Record<string, [string, string]> = {
      harbor: ['Dự án Harbor', 'Harbor project'],
      ops: ['Nhóm vận hành', 'Operations team'],
      support: ['Nhóm hỗ trợ', 'Support team'],
      receiving: ['Tiếp nhận', 'Receiving'],
      scanning: ['Thiết bị', 'Devices'],
    };
    const pair = pairs[String(item.id)];
    return pair ? this.t(...pair) : item.title;
  }
  show(item: SdOrgChartItem): void {
    if (!this.locked()) this.selected.set(item);
  }
}
SdTabComponent({ component: OrgChartDemoComponent, name: 'Org Chart', icon: 'groups' })(OrgChartDemoComponent);
