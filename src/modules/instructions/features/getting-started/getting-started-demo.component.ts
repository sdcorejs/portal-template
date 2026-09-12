import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-overview-demo',
  imports: [RouterLink],
  template: `
    <div class="controls">
      @for (item of options; track item.id) {
        <button type="button" [attr.aria-pressed]="selected() === item.id" (click)="selected.set(item.id)">{{ item.title }}</button>
      }
    </div>
    <div class="card">
      <h3>{{ choice().title }}</h3>
      <p>{{ choice().text }}</p>
      @if (choice().id === 'storybook') {
        <a class="demo-link" href="http://localhost:6006" target="_blank" rel="noopener">Mở Storybook ↗</a>
      } @else {
        <a class="demo-link" [routerLink]="choice().path">Mở {{ choice().title }}</a>
      }
    </div>
    <p><a routerLink="/instructions/instroduction">Xem bài trình bày giới thiệu Core UI →</a></p>
  `,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewDemoComponent {
  readonly selected = signal('instructions');
  readonly options = [
    {
      id: 'instructions',
      title: 'Học quy ước',
      text: 'Instructions giải thích kiến trúc, quyền, naming và quy trình tích hợp.',
      path: '/instructions/architecture',
    },
    {
      id: 'storybook',
      title: 'Thử component API',
      text: 'Storybook có Controls và từng story riêng. Cần chạy npm run storybook ở terminal thứ hai.',
      path: '',
    },
    {
      id: 'pages',
      title: 'Trải nghiệm nghiệp vụ',
      text: 'Pages có bảng, bộ lọc, hồ sơ, tạo/cập nhật và lưu phiên mô phỏng.',
      path: '/pages/list/list-standard',
    },
  ];
  readonly choice = computed(() => this.options.find(item => item.id === this.selected())!);
}
@Component({
  selector: 'app-setup-demo',
  imports: [RouterLink],
  template: `
    @for (step of steps; track step; let i = $index) {
      <label><input type="checkbox" [checked]="done().includes(i)" (change)="toggle(i)" />{{ step }}</label>
    }
    <p role="status">{{ done().length }}/3 bước hoàn tất</p>
    @if (done().length === 3) {
      <div class="status">
        <a routerLink="/pages/list/list-standard">Review Portal</a> ·
        <a href="http://localhost:6006" target="_blank" rel="noopener">Review Storybook ↗</a>
      </div>
    }
  `,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupDemoComponent {
  readonly steps = ['Node và npm ci hoàn tất', 'Portal ở cổng 2208 đã sẵn sàng', 'Storybook ở cổng 6006 đã sẵn sàng'];
  readonly done = signal<number[]>([]);
  toggle(i: number): void {
    this.done.update(items => (items.includes(i) ? items.filter(item => item !== i) : [...items, i]));
  }
}
