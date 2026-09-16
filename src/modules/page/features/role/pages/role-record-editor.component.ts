import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { SdUnsavedChangesService } from '@sdcorejs/angular/services/unsaved-changes';
import { RoleInformationFormComponent } from '../components/role-information-form.component';
import { RolePermissionEditorComponent } from '../components/role-permission-editor.component';
import { RoleLayout, RoleMode, RoleRecord, roleBaseUrl } from '../data/role.model';
import { roleFingerprint } from '../data/role-permissions';
import { RoleSessionStore } from '../data/role-session.store';
@Component({
  selector: 'app-role-record-editor',
  providers: [SdUnsavedChangesService],
  imports: [SdPageComponent, SdButton, SdBadge, RoleInformationFormComponent, RolePermissionEditorComponent],
  template: `<sd-page [title]="title()">
    <div headerLeft class="d-flex align-items-center gap-8">
      <sd-button tooltip="Quay lại" type="text" prefixIcon="arrow_back" [disabled]="saving()" (click)="back()" />
      <div>
        <div class="heading">
          <h1>
            {{ title() }}
            @if (mode() !== 'create') {
              <span>#{{ seed().code }}</span>
            }
          </h1>
          @if (viewed()) {
            <sd-badge
              type="round"
              [title]="seed().status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'"
              [color]="seed().status === 'active' ? 'success' : 'secondary'" />
          }
        </div>
        @if (mode() !== 'create') {
          <p class="description">{{ seed().name }}</p>
        }
      </div>
    </div>
    <div headerRight class="actions">
      @if (viewed()) {
        <sd-button title="Cập nhật" type="fill" color="primary" prefixIcon="edit" (click)="edit()" />
      } @else {
        <sd-button title="Lưu" type="fill" color="primary" prefixIcon="save" [loading]="saving()" [disabled]="saving()" (click)="save()" />
      }
    </div>
    <div class="record-content" [attr.aria-busy]="saving()">
      @if (error()) {
        <div role="alert" class="error">{{ error() }}</div>
      }
      @if (savedMessage()) {
        <p role="status" class="success">{{ savedMessage() }}</p>
      }
      <fieldset [disabled]="saving()">
        <app-role-information-form [form]="form" [seed]="seed()" [viewed]="viewed()" [editing]="mode() !== 'create'" />
        <app-role-permission-editor [layout]="layout()" [viewed]="viewed()" [(selected)]="selected" [disabled]="viewed() || saving()" />
      </fieldset></div
  ></sd-page>`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        min-width: 0;
      }
      .heading {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      h1 {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.4;
        margin: 0;
      }
      h1 span {
        color: var(--sd-primary);
      }
      .description {
        font-size: 13px;
        color: var(--sd-text-secondary);
        margin: 4px 0 0;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .record-content {
        padding: 20px;
      }
      fieldset {
        border: 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      fieldset[disabled] {
        opacity: 0.7;
        pointer-events: none;
      }
      .error,
      .success {
        padding: 12px 16px;
        margin-bottom: 16px;
        border-radius: 6px;
      }
      .error {
        color: var(--sd-error);
        background: var(--sd-error-light);
      }
      .success {
        color: var(--sd-success);
        background: var(--sd-success-light);
      }
      @media (max-width: 600px) {
        .record-content {
          padding: 12px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleRecordEditorComponent implements OnInit {
  readonly seed = input.required<RoleRecord>();
  readonly mode = input.required<RoleMode>();
  readonly layout = input.required<RoleLayout>();
  readonly store = inject(RoleSessionStore);
  readonly unsaved = inject(SdUnsavedChangesService);
  readonly router = inject(Router);
  readonly location = inject(Location);
  readonly destroy = inject(DestroyRef);
  readonly form = new FormGroup({});
  readonly fields = signal<Partial<RoleRecord>>({});
  readonly selected = signal<string[]>([]);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly savedMessage = signal('');
  readonly baseline = signal('');
  readonly viewed = computed(() => this.mode() === 'detail');
  readonly title = computed(() => (this.mode() === 'create' ? 'Tạo vai trò' : this.viewed() ? 'Chi tiết vai trò' : 'Cập nhật vai trò'));
  readonly value = computed<RoleRecord>(() => ({ ...this.seed(), ...this.fields(), permissions: this.selected() }));
  readonly dirty = computed(() => !this.viewed() && roleFingerprint(this.value()) !== this.baseline());
  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.syncFields());
    // Core controls register first, then silently apply their initial model values.
    // Read once after that render so pristine fields are not mistaken for edits.
    afterNextRender(() => this.syncFields());
  }
  private syncFields(): void {
    const fields = this.form.getRawValue() as Partial<RoleRecord>;
    if ('description' in fields) fields.description ??= '';
    this.fields.set(fields);
  }
  ngOnInit(): void {
    this.selected.set([...this.seed().permissions]);
    this.baseline.set(roleFingerprint(this.seed()));
    const registration = this.unsaved.register({
      id: 'role-draft',
      scope: this,
      isDirty: this.dirty,
      save: () => this.save(false),
      discard: () => {
        this.baseline.set(roleFingerprint(this.value()));
        return true;
      },
    });
    this.destroy.onDestroy(() => registration.destroy());
    if ((this.location.getState() as { roleSaved?: boolean })?.roleSaved) this.savedMessage.set('Đã lưu vai trò.');
  }
  canLeave(): Promise<boolean> {
    return this.saving() ? Promise.resolve(false) : this.unsaved.confirmLeave({ scope: this, reason: 'navigation' });
  }
  back(): void {
    if (!this.saving()) void this.router.navigateByUrl(roleBaseUrl(this.layout()));
  }
  edit(): void {
    void this.router.navigateByUrl(roleBaseUrl(this.layout()) + '/' + encodeURIComponent(this.seed().id) + '/update');
  }
  async save(navigate = true): Promise<boolean> {
    if (this.saving() || this.viewed()) return false;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.error.set('Vui lòng kiểm tra các trường bắt buộc.');
      return false;
    }
    this.error.set('');
    this.saving.set(true);
    try {
      const saved = await this.store.save(this.layout(), this.value());
      if (this.destroy.destroyed) return false;
      this.baseline.set(roleFingerprint(this.value()));
      this.form.markAsPristine();
      this.saving.set(false);
      if (navigate)
        await this.router.navigateByUrl(roleBaseUrl(this.layout()) + '/' + encodeURIComponent(saved.id) + '/detail', {
          replaceUrl: this.mode() === 'create',
          state: { roleSaved: true },
        });
      return true;
    } catch (error) {
      if (!this.destroy.destroyed) this.error.set(error instanceof Error ? error.message : 'Không thể lưu vai trò. Vui lòng thử lại.');
      return false;
    } finally {
      if (!this.destroy.destroyed) this.saving.set(false);
    }
  }
}
