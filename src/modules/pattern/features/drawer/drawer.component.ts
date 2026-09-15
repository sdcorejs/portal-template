import { SdPermissionService } from '@sdcorejs/angular/modules/permission';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { FormEditorComponent, ContactRecord, emptyContact, sampleContact } from '../../components/form-editor.component';
import { ContactFactsComponent } from '../../components/contact-facts.component';
import { PatternDraft } from '../../data/pattern-draft';
@Component({
  selector: 'app-pattern-drawer',
  imports: [SdButton, SdSideDrawer, FormEditorComponent, ContactFactsComponent],
  templateUrl: './drawer.component.html',
  styleUrl: '../../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  private readonly permission = inject(SdPermissionService);
  readonly canEdit = () => this.permission.hasPermission('CRM_CONTACT_C_UPDATE');
  edit(): void {
    if (!this.canEdit()) return;
    this.mode.set('update');
  }
  readonly variant = input('create');
  readonly mode = signal('create');
  readonly opened = signal(false);
  readonly record = signal(sampleContact());
  readonly message = signal('');
  readonly drawer = viewChild.required(SdSideDrawer);
  readonly editor = viewChild(FormEditorComponent);
  private readonly draft = inject(PatternDraft);
  private readonly document = inject(DOCUMENT);
  private opener: HTMLElement | null = null;
  readonly title = computed(() =>
    this.mode() === 'create' ? 'Tạo liên hệ' : this.mode() === 'update' ? 'Chỉnh sửa liên hệ' : 'Chi tiết liên hệ'
  );
  readonly seed = computed(() => (this.mode() === 'create' ? emptyContact() : this.record()));
  open(): void {
    this.opener = this.document.activeElement as HTMLElement;
    this.mode.set(
      this.variant() === 'detail' ? 'detail' : this.variant() === 'update' || this.variant() === 'sections' ? 'update' : 'create'
    );
    this.opened.set(true);
    this.drawer().open();
  }
  readonly beforeClose = () => this.draft.canLeave();
  close(): void {
    void this.drawer().requestClose();
  }
  save(): void {
    void this.editor()?.save();
  }
  saved(record: ContactRecord): void {
    this.record.set(record);
    this.message.set('Đã lưu liên hệ ' + record.name + '.');
    this.drawer().forceClose();
  }
  closed(): void {
    this.opened.set(false);
    const opener = this.opener;
    requestAnimationFrame(() => {
      if (opener?.isConnected) opener.focus();
    });
  }
}
