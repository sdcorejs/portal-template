import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_IMPORTS, FormPatternBase } from '../form-simple/form-simple.component';
@Component({
  selector: 'app-form-sections',
  imports: FORM_IMPORTS,
  templateUrl: './form-sections.component.html',
  styleUrl: './form-sections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSectionsComponent extends FormPatternBase {}
