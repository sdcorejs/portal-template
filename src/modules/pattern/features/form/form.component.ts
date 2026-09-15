import { SdPermissionService } from '@sdcorejs/angular/modules/permission';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormEditorComponent, sampleContact } from '../../components/form-editor.component';
import { ContactFactsComponent } from '../../components/contact-facts.component';
import { SdButton } from '@sdcorejs/angular/components/button';
@Component({
  selector: 'app-pattern-form',
  imports: [FormEditorComponent, ContactFactsComponent, SdButton],
  templateUrl: './form.component.html',
  styleUrl: '../../styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  private readonly permission = inject(SdPermissionService);
  readonly canEdit = () => this.permission.hasPermission('CRM_CONTACT_C_UPDATE');
  edit(): void {
    if (!this.canEdit()) return;
    this.editing.set(true);
  }
  readonly variant = input('simple');
  readonly record = signal(sampleContact());
  readonly editing = signal(false);
}
