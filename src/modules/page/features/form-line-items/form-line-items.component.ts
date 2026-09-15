import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_IMPORTS, FormPatternBase } from '../form-simple/form-simple.component';
@Component({
  selector: 'app-form-line-items',
  imports: FORM_IMPORTS,
  templateUrl: './form-line-items.component.html',
  styleUrl: './form-line-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLineItemsComponent extends FormPatternBase {}
