import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, output, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-instruction-order-line',
  imports: [DecimalPipe],
  template: `
    <div class="card">
      <h3>Child · Dòng hàng</h3>
      <label
        >Số lượng
        <input #quantityInput aria-label="Số lượng" type="number" min="1" max="99" [value]="quantity()" (input)="setQuantity($event)"
      /></label>
      <p>Đơn giá nhận qua input: {{ unitPrice() | number }} ₫</p>
      <strong class="value" data-testid="order-total">{{ total() | number }} ₫</strong>
      <div class="controls">
        <button type="button" class="primary" (click)="added.emit(total())">Thêm hàng</button
        ><button type="button" (click)="focusQuantity()">Focus số lượng</button>
      </div>
    </div>
  `,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionOrderLineComponent {
  readonly unitPrice = input.required<number>();
  readonly quantity = model(1);
  readonly total = computed(() => this.unitPrice() * this.quantity());
  readonly added = output<number>();
  readonly quantityInput = viewChild<ElementRef<HTMLInputElement>>('quantityInput');
  setQuantity(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.quantity.set(Math.max(1, Math.min(99, Number.isFinite(value) ? value : 1)));
  }
  focusQuantity(): void {
    this.quantityInput()?.nativeElement.focus();
  }
}
@Component({
  selector: 'app-signals-demo',
  imports: [InstructionOrderLineComponent, DecimalPipe],
  template: `
    <div class="cards">
      <div class="card">
        <h3>Parent · Đơn hàng</h3>
        <label
          >Đơn giá
          <select aria-label="Đơn giá" [value]="price()" (change)="setPrice($event)">
            <option value="120000">120.000 ₫</option>
            <option value="250000">250.000 ₫</option>
          </select></label
        >
        <p>
          Quantity từ model: <strong>{{ quantity() }}</strong>
        </p>
        <p role="status">
          @if (lastAdded() !== null) {
            Đã nhận output: {{ lastAdded() | number }} ₫
          } @else {
            Chưa nhận sự kiện thêm hàng.
          }
        </p>
      </div>
      <app-instruction-order-line [unitPrice]="price()" [(quantity)]="quantity" (added)="lastAdded.set($event)" />
    </div>
  `,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsDemoComponent {
  readonly price = signal(120000);
  readonly quantity = signal(1);
  readonly lastAdded = signal<number | null>(null);
  setPrice(event: Event): void {
    this.price.set(Number((event.target as HTMLSelectElement).value));
  }
}
