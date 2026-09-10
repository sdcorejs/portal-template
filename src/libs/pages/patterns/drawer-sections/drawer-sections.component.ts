import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdTable, SdTableCellDefDirective } from '@sdcorejs/angular/components/table';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { RecordHeaderComponent } from '../../components/record-header.component';
import { EntityFactsComponent } from '../../components/entity-facts.component';
import { FormSectionsComponent } from '../form-sections/form-sections.component';
import { DrawerPatternBase } from '../drawer-pattern-base';
@Component({
  selector: 'app-drawer-sections',
  imports: [
    SdPageComponent,
    SdButton,
    SdTable,
    SdTableCellDefDirective,
    SdSideDrawer,
    SdDataState,
    RecordHeaderComponent,
    EntityFactsComponent,
    FormSectionsComponent,
  ],
  templateUrl: './drawer-sections.component.html',
  styleUrl: './drawer-sections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerSectionsComponent extends DrawerPatternBase {}
