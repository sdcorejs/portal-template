import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormEditorComponent, sampleContact } from '../../components/form-editor.component';
import { ContactFactsComponent } from '../../components/contact-facts.component';
import { SdButton } from '@sdcorejs/angular/components/button';
@Component({
  selector: 'app-pattern-forms',
  imports: [FormEditorComponent, ContactFactsComponent, SdButton],
  templateUrl: './forms.component.html',
  styleUrl: '../../styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsComponent {
  readonly variant = input('simple');
  readonly record = signal(sampleContact());
  readonly editing = signal(false);
}
