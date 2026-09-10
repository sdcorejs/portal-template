import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { SdTableOption } from '@sdcorejs/angular/components/table';
import { DemoEntity } from '../../data/models';
import { LIST_IMPORTS, ListPatternBase } from '../list-standard/list-standard.component';
@Component({
  selector: 'app-list-grouped-tree',
  imports: LIST_IMPORTS,
  templateUrl: './list-grouped-tree.component.html',
  styleUrl: './list-grouped-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListGroupedTreeComponent extends ListPatternBase {
  readonly treeOption = computed<SdTableOption<DemoEntity & { children?: DemoEntity[] }>>(() => {
    return {
      ...this.option(),
      tree: { loadType: 'static', childrenKey: 'children', defaultExpanded: 1 },
    };
  });
}
