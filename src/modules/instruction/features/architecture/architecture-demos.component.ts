import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routing-demo',
  imports: [RouterLink],
  template: `<div class="controls">
      @for (action of actions; track action) {
        <button type="button" [attr.aria-pressed]="selected() === action" (click)="selected.set(action)">{{ action }}</button>
      }
    </div>
    <pre aria-label="URL kết quả">{{ url() }}</pre>
    <a class="demo-link" [routerLink]="url()">Mở {{ selected() }} →</a>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingDemoComponent {
  readonly actions = ['List', 'Create', 'Detail', 'Update'];
  readonly selected = signal('List');
  readonly url = computed(
    () =>
      '/page/list/list-standard' +
      ({ List: '', Create: '/create', Detail: '/customer-1/detail', Update: '/customer-1/update' }[this.selected()] ?? '')
  );
}
@Component({
  selector: 'app-configuration-demo',
  template: `
    <div class="controls">
      <label
        >Môi trường
        <select aria-label="Môi trường" [value]="environment()" [disabled]="pending()" (change)="setEnvironment($event)">
          <option value="sandbox">Sandbox</option>
          <option value="staging">Staging</option>
        </select></label
      >
      <label><input type="checkbox" [checked]="fail()" [disabled]="pending()" (change)="fail.set(!fail())" />Giả lập lỗi 503</label>
    </div>
    <pre>GET {{ host() }}/customers</pre>
    <button type="button" class="primary" [disabled]="pending()" (click)="send()">{{ pending() ? 'Đang tải…' : 'Gửi request' }}</button>
    <p role="status" [class.error]="status().startsWith('503')" class="status">{{ status() }}</p>
    @if (records().length) {
      <table>
        <caption>
          Response mô phỏng
        </caption>
        <thead>
          <tr>
            <th scope="col">Mã</th>
            <th scope="col">Công ty</th>
          </tr>
        </thead>
        <tbody>
          @for (record of records(); track record.code) {
            <tr>
              <td>{{ record.code }}</td>
              <td>{{ record.name }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationDemoComponent {
  readonly environment = signal('sandbox');
  readonly host = computed(() => '/mock/' + this.environment() + '/crm');
  readonly fail = signal(false);
  readonly pending = signal(false);
  readonly status = signal('Chưa gửi request. Không có request ra mạng.');
  readonly records = signal<{ code: string; name: string }[]>([]);
  private timer: ReturnType<typeof setTimeout> | undefined;
  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }
  setEnvironment(event: Event): void {
    this.environment.set((event.target as HTMLSelectElement).value);
  }
  send(): void {
    if (this.pending()) return;
    const fails = this.fail();
    this.pending.set(true);
    this.records.set([]);
    this.status.set('Đang tải dữ liệu…');
    this.timer = setTimeout(
      () => {
        this.pending.set(false);
        this.status.set(
          fails ? '503 · Dịch vụ tạm thời không khả dụng. Bỏ lỗi và thử lại.' : '200 · Đã tải 2 khách hàng từ ' + this.host()
        );
        if (!fails)
          this.records.set([
            { code: 'CUS-001', name: 'Công ty Minh An' },
            { code: 'CUS-002', name: 'Công ty Bình Minh' },
          ]);
      },
      1000 + Math.floor(Math.random() * 1001)
    );
  }
}
@Component({
  selector: 'app-integration-demo',
  template: `<div class="controls">
      <button type="button" [attr.aria-pressed]="source() === 'local'" (click)="source.set('local')">Module local</button
      ><button type="button" [attr.aria-pressed]="source() === 'submodule'" (click)="source.set('submodule')">Git submodule</button>
    </div>
    <p>
      {{
        source() === 'local'
          ? 'Source nằm trực tiếp trong src/modules/crm.'
          : 'Source là repo con; cần kiểm tra gitlink và khả năng fetch commit.'
      }}
    </p>
    @for (step of steps; track step) {
      <label><input type="checkbox" [checked]="done().includes(step)" (change)="toggle(step)" />{{ step }}</label>
    }
    <p class="status" role="status">
      {{ done().length === steps.length ? 'Đủ 5 điểm tích hợp. Sẵn sàng build và review.' : 'Còn thiếu: ' + missing().join(', ') }}
    </p>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationDemoComponent {
  readonly source = signal('local');
  readonly steps = ['Source có public index.ts', 'Alias @crm', 'Configuration provider', 'Lazy route /crm', 'Menu và guard'];
  readonly done = signal<string[]>([]);
  readonly missing = computed(() => this.steps.filter(step => !this.done().includes(step)));
  toggle(step: string): void {
    this.done.update(items => (items.includes(step) ? items.filter(item => item !== step) : [...items, step]));
  }
}
