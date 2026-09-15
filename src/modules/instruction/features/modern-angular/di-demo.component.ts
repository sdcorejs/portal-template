import { ChangeDetectionStrategy, Component, Injectable, inject, input, signal } from '@angular/core';
@Injectable()
export class InstructionCounter {
  readonly id = crypto.randomUUID().slice(0, 8);
  readonly count = signal(0);
}
@Component({
  selector: 'app-di-consumer',
  template: `<div class="card">
    <h3>{{ label() }}</h3>
    <p>
      Instance <code>{{ counter.id }}</code>
    </p>
    <strong class="value">{{ counter.count() }}</strong
    ><button type="button" (click)="counter.count.update(increment)">Tăng {{ label() }}</button>
  </div>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiConsumerComponent {
  readonly label = input('Consumer');
  readonly counter = inject(InstructionCounter);
  readonly increment = (value: number) => value + 1;
}
@Component({
  selector: 'app-di-local',
  imports: [DiConsumerComponent],
  providers: [InstructionCounter],
  template: `<app-di-consumer label="Local" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiLocalComponent {}
@Component({
  selector: 'app-di-scope',
  imports: [DiConsumerComponent, DiLocalComponent],
  providers: [InstructionCounter],
  template: `<div class="cards"><app-di-consumer label="Shared A" /><app-di-consumer label="Shared B" /><app-di-local /></div>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiScopeComponent {}
@Component({
  selector: 'app-di-demo',
  imports: [DiScopeComponent],
  template: `<div class="controls"><button type="button" (click)="generation.update(next)">Dựng lại scope</button></div>
    @for (key of generation(); track key) {
      <app-di-scope />
    }`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiDemoComponent {
  readonly generation = signal([0]);
  readonly next = ([value]: number[]) => [value + 1];
}
