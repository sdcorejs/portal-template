import { SdSection, SdSectionItem } from '@sdcorejs/angular/components/section';
import { SdIcon } from '@sdcorejs/angular/modules/icon';
import { ChangeDetectionStrategy, Component, afterRenderEffect, computed, inject, untracked, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SdBadge } from '@sdcorejs/angular/components/badge';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdUnsavedChangesService } from '@sdcorejs/angular/services/unsaved-changes';
import { FormSectionsComponent } from '../form-sections/form-sections.component';
import { GROUP_OPTIONS } from '../../data/models';
import { statusBadge } from '../../components/status-badge';
import { LIST_IMPORTS, ListPatternBase } from '../list-standard/list-standard.component';
@Component({
  selector: 'app-list-master-detail',
  imports: [...LIST_IMPORTS, SdSection, SdSectionItem, SdIcon, SdBadge, SdSideDrawer, DatePipe],
  templateUrl: './list-master-detail.component.html',
  styleUrl: './list-master-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMasterDetailComponent extends ListPatternBase {
  readonly drawer = viewChild.required(SdSideDrawer);
  readonly editor = viewChild<FormSectionsComponent>('editor');
  readonly unsaved = inject(SdUnsavedChangesService);
  readonly entity = computed(() => this.store.records().find(row => row.id === this.store.selectedId()));
  readonly badge = computed(() => statusBadge(this.entity()?.status ?? 'pending', 'round'));
  readonly region = computed(() => GROUP_OPTIONS.find(group => group.id === this.entity()?.group)?.name ?? '—');
  constructor() {
    super();
    afterRenderEffect(() => {
      const editing = this.navigation.view() === 'update';
      const drawer = this.drawer();
      untracked(() => (editing ? drawer.open() : drawer.forceClose()));
    });
  }
  readonly beforeClose = async () => {
    if (this.store.saving() || !(await this.unsaved.confirmLeave({ scope: this.store, reason: 'close' }))) return false;
    await this.navigation.go('detail');
    return true;
  };
}
