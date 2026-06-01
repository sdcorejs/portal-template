import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, computed, signal } from '@angular/core';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTooltipDirective } from '@sdcorejs/angular/directives';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [CommonModule, SdPageComponent, SdSection, SdCodeEditor, SdInput, SdInputNumber, SdSelect, SdTooltipDirective],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent {
  @ViewChild('detailTpl', { static: true }) detailTpl!: TemplateRef<unknown>;

  pageDescription = signal<string>('Demo directive sdTooltip: text, template, vị trí hiển thị, delay và màu nền tooltip.');

  tooltipText = signal<string>('Thông tin bổ sung cho người dùng khi hover.');
  tooltipDelay = signal<number>(150);
  tooltipColor = signal<string>('#334155');
  tooltipPosition = signal<TooltipPosition>('bottom');
  buyClicks = signal<number>(0);

  positionOptions: { id: TooltipPosition; name: string }[] = [
    { id: 'top', name: 'Top' },
    { id: 'bottom', name: 'Bottom' },
    { id: 'left', name: 'Left' },
    { id: 'right', name: 'Right' },
  ];

  codeSample = computed(() => {
    const escapedTooltipText = this.tooltipText().replace(/'/g, "\\'");

    return `<div class="tooltip-preview">
  <button
    type="button"
    class="demo-chip"
    [sdTooltip]="'${escapedTooltipText}'"
    [sdTooltipPosition]="'${this.tooltipPosition()}'"
    [sdTooltipDelay]="${this.tooltipDelay()}"
    [sdTooltipColor]="'${this.tooltipColor()}'">
    Tooltip text
  </button>

  <button
    type="button"
    class="demo-chip"
    [sdTooltip]="detailTpl"
    [sdTooltipPosition]="'right'"
    [sdTooltipDelay]="50"
    [sdTooltipColor]="'#0f172a'">
    Tooltip template
  </button>

  <button
    type="button"
    class="demo-chip"
    [sdTooltip]="whiteCardTpl"
    [sdTooltipPosition]="'bottom'"
    [sdTooltipDelay]="80"
    [sdTooltipColor]="'#ffffff'">
    Tooltip nền trắng
  </button>

  <button
    type="button"
    class="demo-chip"
    [sdTooltip]="mediaTpl"
    [sdTooltipPosition]="'left'"
    [sdTooltipDelay]="120"
    [sdTooltipColor]="'#0f172a'">
    Tooltip có ảnh/màu
  </button>

  <button
    type="button"
    class="demo-chip"
    [sdTooltip]="'Phù hợp cho hint ngắn trong cell table'"
    [sdTooltipPosition]="'top'">
    Use-case: table cell
  </button>
</div>

<ng-template #detailTpl>
  <div class="tooltip-template">
    <div class="tooltip-template__title">Thông tin chi tiết</div>
    <div class="tooltip-template__desc">Có thể truyền template để hiển thị nhiều dòng nội dung thay vì text đơn.</div>
  </div>
</ng-template>

<ng-template #whiteCardTpl>
  <div class="tooltip-card tooltip-card--white">
    <div class="tooltip-card__title">Gói Pro</div>
    <div class="tooltip-card__desc">Bao gồm xuất báo cáo nâng cao, lịch sử 12 tháng và chia sẻ dashboard theo nhóm.</div>
    <div class="tooltip-card__meta">
      <span class="tooltip-tag">Mới</span>
      <span class="tooltip-price">399.000đ/tháng</span>
    </div>
    <button type="button" class="tooltip-buy-btn" (click)="onBuyClick($event)">Mua ngay</button>
  </div>
</ng-template>

<ng-template #mediaTpl>
  <div class="tooltip-media">
    <div class="tooltip-media__thumb"></div>
    <div class="tooltip-media__content">
      <div class="tooltip-media__title">Summer Campaign</div>
      <div class="tooltip-media__desc">CTR tăng +18% so với tuần trước. Nhấn để xem báo cáo chi tiết theo kênh.</div>
    </div>
  </div>
</ng-template>`;
  });

  tsSample = `buyClicks = signal<number>(0);

onBuyClick(event: MouseEvent): void {
  event.stopPropagation();
  this.buyClicks.update(value => value + 1);
  alert('Đã bấm Mua ngay');
}`;

  onBuyClick(event: MouseEvent): void {
    event.stopPropagation();
    this.buyClicks.update(value => value + 1);
    alert('Đã bấm Mua ngay');
  }
}
