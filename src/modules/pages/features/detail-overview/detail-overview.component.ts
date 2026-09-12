import { ChangeDetectionStrategy, Component, Directive, computed, inject, input, output, signal } from '@angular/core';
import { PageNavigation } from '../../reference/page-navigation';
import { RecordHeaderComponent } from '../../components/record-header.component';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { SdDataState } from '@sdcorejs/angular/components/data-state';
import { SdTab, SdTabGroup } from '@sdcorejs/angular/components/tab';
import { DemoSessionStore } from '../../data/demo-session.store';
import { STATUS_OPTIONS } from '../../data/models';
import { EntityFactsComponent } from '../../components/entity-facts.component';
import { RelatedRecordsComponent } from '../../components/related-records.component';
import { FormSimpleComponent } from '../form-simple/form-simple.component';
import { FormSectionsComponent } from '../form-sections/form-sections.component';
import { FormLineItemsComponent } from '../form-line-items/form-line-items.component';
@Directive()
export abstract class DetailPatternBase {
  readonly store = inject(DemoSessionStore);
  readonly done = output<void>();
  readonly embedded = input(false);
  readonly navigation = inject(PageNavigation);
  back() {
    void this.navigation.backToList();
  }
  readonly activeTab = signal(0);
  readonly entity = computed(() => this.store.records().find(x => x.id === this.store.selectedId()));
  readonly status = computed(() => STATUS_OPTIONS.find(x => x.id === this.entity()?.status)?.name ?? '');
  edit() {
    return this.navigation.go('update');
  }
}
export const DETAIL_IMPORTS = [
  RecordHeaderComponent,
  SdPageComponent,
  SdButton,
  SdBadge,
  SdDataState,
  SdTab,
  SdTabGroup,
  EntityFactsComponent,
  RelatedRecordsComponent,
  FormSimpleComponent,
  FormSectionsComponent,
  FormLineItemsComponent,
];
@Component({
  selector: 'app-detail-overview',
  imports: DETAIL_IMPORTS,
  templateUrl: './detail-overview.component.html',
  styleUrl: './detail-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailOverviewComponent extends DetailPatternBase {}
