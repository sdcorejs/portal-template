import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { RoleSessionStore } from '../data/role-session.store';
import { emptyRole, RoleLayout, RoleMode, RoleRecord, roleBaseUrl } from '../data/role.model';
import { RoleRecordEditorComponent } from './role-record-editor.component';
@Component({
  selector: 'app-role-record-page',
  providers: [RoleSessionStore],
  imports: [SdDataState, RoleRecordEditorComponent],
  template: `@if (loading()) {
      <sd-data-state state="loading" title="Đang mở vai trò…" />
    } @else if (error()) {
      <sd-data-state state="error" title="Không thể mở vai trò" [message]="error()" actionLabel="Quay lại danh sách" (sdAction)="back()" />
    } @else if (record(); as seed) {
      @for (key of [mode + ':' + seed.id]; track key) {
        <app-role-record-editor [seed]="seed" [layout]="layout" [mode]="mode" />
      }
    }`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-width: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleRecordPageComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly store = inject(RoleSessionStore);
  readonly destroy = inject(DestroyRef);
  readonly layout = this.route.snapshot.data['roleLayout'] as RoleLayout;
  readonly mode = this.route.snapshot.data['roleMode'] as RoleMode;
  readonly loading = signal(true);
  readonly error = signal('');
  readonly record = signal<RoleRecord | null>(null);
  readonly editor = viewChild(RoleRecordEditorComponent);
  private request = 0;
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => void this.load(params.get('id')));
  }
  async load(id: string | null): Promise<void> {
    const request = ++this.request;
    this.loading.set(true);
    this.error.set('');
    this.record.set(null);
    try {
      const rows = await this.store.list(this.layout);
      if (request !== this.request || this.destroy.destroyed) return;
      const record = this.mode === 'create' ? emptyRole() : rows.find(row => row.id === id);
      if (!record) throw new Error('Không tìm thấy vai trò. Hãy chọn lại từ danh sách.');
      this.record.set(record);
    } catch (error) {
      if (request === this.request && !this.destroy.destroyed)
        this.error.set(error instanceof Error ? error.message : 'Không thể tải dữ liệu.');
    } finally {
      if (request === this.request && !this.destroy.destroyed) this.loading.set(false);
    }
  }
  canLeave(): Promise<boolean> {
    return this.editor()?.canLeave() ?? Promise.resolve(true);
  }
  back(): void {
    void this.router.navigateByUrl(roleBaseUrl(this.layout));
  }
}
SdTabComponent({
  component: RoleRecordPageComponent,
  name: args => (args.data?.['roleMode'] === 'create' ? 'Tạo vai trò' : 'Hồ sơ vai trò'),
  icon: 'shield',
})(RoleRecordPageComponent);
