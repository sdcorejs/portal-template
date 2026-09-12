import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-git-demo',
  template: `<label
      ><input type="checkbox" [checked]="dirty()" (change)="dirty.set(!dirty()); synced.set(false)" />Working tree có thay đổi chưa
      lưu</label
    >
    <label
      ><input type="checkbox" [checked]="branch()" (change)="branch.set(!branch()); synced.set(false)" />Remote có branch tương ứng</label
    >
    <label
      ><input type="checkbox" [checked]="pinned()" (change)="pinned.set(!pinned()); synced.set(false)" />Submodule đang ở commit đã
      ghim</label
    >
    <p class="status" role="status">{{ advice() }}</p>
    <button type="button" [disabled]="dirty() || !branch()" (click)="sync()">Mô phỏng đồng bộ theo branch</button>
    <p>Không có lệnh Git nào được thực thi. Với checkout tái lập, dùng commit gitlink; không cần branch tương ứng.</p>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GitDemoComponent {
  readonly dirty = signal(true);
  readonly branch = signal(true);
  readonly pinned = signal(false);
  readonly synced = signal(false);
  readonly advice = computed(() =>
    this.dirty()
      ? 'Dừng: commit hoặc stash thay đổi trước.'
      : !this.branch()
        ? 'Thiếu branch: thống nhất branch của từng submodule; không chạy checkout -B tự động.'
        : this.synced()
          ? 'Đã mô phỏng cập nhật branch. Review gitlink, push commit repo con rồi commit repo cha.'
          : !this.pinned()
            ? 'Commit hiện tại khác gitlink. Chọn tái lập commit đã ghim hoặc chủ động cập nhật branch.'
            : 'Checkout khớp gitlink. Có thể build; chỉ cập nhật branch khi có chủ đích.'
  );
  sync(): void {
    if (!this.dirty() && this.branch()) {
      this.synced.set(true);
      this.pinned.set(false);
    }
  }
}
@Component({
  selector: 'app-theme-demo',
  imports: [RouterLink],
  template: `<label
      >Primary <input aria-label="Primary" type="color" [value]="color()" (input)="setColor($event)" /><code>{{ color() }}</code></label
    >
    <div class="card">
      <div class="theme-sample" [style.background]="color()">Lưu thay đổi · chữ trắng</div>
      <p role="status">
        Contrast {{ contrast().toFixed(2) }}:1 · {{ contrast() >= 4.5 ? 'Đạt 4.5:1 cho chữ thường' : 'Chưa đạt 4.5:1 cho chữ thường' }}
      </p>
    </div>
    <p><a class="demo-link" routerLink="/instructions/custom-theme/tool">Mở công cụ tạo palette →</a></p>`,
  styleUrl: '../../components/instruction-example/demo.scss',
  styles: [
    `
      .theme-sample {
        color: white;
        padding: 16px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeDemoComponent {
  readonly color = signal('#2a66f4');
  readonly contrast = computed(() => {
    const rgb = [1, 3, 5]
      .map(index => parseInt(this.color().slice(index, index + 2), 16) / 255)
      .map(channel => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
    return 1.05 / (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] + 0.05);
  });
  setColor(event: Event): void {
    this.color.set((event.target as HTMLInputElement).value);
  }
}
