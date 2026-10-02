import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdConfirmService } from '@sdcorejs/angular/services/confirm';
import { WorkspaceStore } from './data/workspace.store';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [RouterOutlet, SdPageComponent, SdButton],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceComponent {
  readonly store = inject(WorkspaceStore);
  readonly router = inject(Router);
  readonly #confirm = inject(SdConfirmService);
  readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );
  readonly navigation = computed(() =>
    [
      { path: 'queue', title: 'Hàng chờ', icon: 'fact_check' },
      { path: 'files', title: 'Kho tài liệu', icon: 'folder_open' },
      { path: 'designer', title: 'Thiết kế biểu mẫu', icon: 'design_services' },
      { path: 'request', title: 'Gửi đề nghị', icon: 'post_add' },
      { path: 'activity', title: 'Hoạt động', icon: 'history' },
    ].map(item => ({ ...item, active: this.url().endsWith('/' + item.path) }))
  );

  navigate(path: string): void {
    void this.router.navigate(['/utility/workspace', path]);
  }
  async reset(): Promise<void> {
    try {
      await this.#confirm.confirm('Khôi phục 24 hồ sơ và biểu mẫu ban đầu? File tải lên và bản nháp của workspace sẽ bị bỏ.', {
        title: 'Reset workspace',
        yesTitle: 'Khôi phục',
        noTitle: 'Giữ phiên hiện tại',
      });
    } catch {
      return;
    }
    this.store.reset();
  }
}
