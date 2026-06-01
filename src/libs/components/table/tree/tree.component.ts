import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTable, SdTableColumn, SdTableOption } from '@sdcorejs/angular/components/table';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

interface BudgetItem {
  id: string;
  stt: string;
  name: string;
  unit?: string;
  quantity?: number;
  unitPrice?: number;
  totalCost: number;
  children?: BudgetItem[];
}

function formatVnd(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('vi-VN').format(value);
}

function generateTree(rootCount: number): BudgetItem[] {
  const units = ['Gói', 'm²', 'Cái', 'Tháng'];
  const roots: BudgetItem[] = [];
  for (let i = 1; i <= rootCount; i++) {
    const childCount = 2 + (i % 3);
    const children: BudgetItem[] = [];
    let total = 0;
    for (let j = 1; j <= childCount; j++) {
      const cost = (1 + ((i * j) % 9)) * 25_000_000;
      total += cost;
      const child: BudgetItem = {
        id: `${i}.${j}`,
        stt: `${i}.${j}`,
        name: `Hạng mục con ${i}.${j} – ${['Vật tư', 'Nhân công', 'Máy móc', 'Dịch vụ'][j % 4]}`,
        unit: units[j % units.length],
        quantity: 1 + (j % 5),
        unitPrice: cost,
        totalCost: cost,
      };
      // Một số node con có cấp 3 để thấy maxDepth
      if (j === 1 && i % 3 === 0) {
        const a = Math.floor(cost * 0.6);
        const b = cost - a;
        child.children = [
          { id: `${i}.${j}.1`, stt: `${i}.${j}.1`, name: `Chi tiết ${i}.${j}.1`, totalCost: a },
          { id: `${i}.${j}.2`, stt: `${i}.${j}.2`, name: `Chi tiết ${i}.${j}.2`, totalCost: b },
        ];
      }
      children.push(child);
    }
    roots.push({
      id: String(i),
      stt: String(i),
      name: `Hạng mục chi phí cấp 1 — #${i}`,
      totalCost: total,
      children,
    });
  }
  return roots;
}

@Component({
  selector: 'app-table-tree',
  standalone: true,
  imports: [CommonModule, FormsModule, SdTable, SdCodeEditor, SdPageComponent, SdSection, SdSelect, SdSwitch, SdInputNumber],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTreeComponent {
  // ── Config signals ──────────────────────────────────────────────────────────
  maxDepth = signal(3);
  defaultExpandedMode = signal<'true' | 'false' | 'level'>('level');
  expandLevel = signal(1);
  indentSize = signal(20);
  showIndex = signal(false);
  showSelector = signal(true);

  defaultExpandedOptions = [
    { id: 'false', name: 'false (đóng hết)' },
    { id: 'true', name: 'true (mở hết)' },
    { id: 'level', name: 'số cấp (mở tới cấp N)' },
  ];

  pageDescription = signal(
    'Table dạng cây với `tree` option — render children inline dưới parent. Mỗi row có thể chứa mảng `children`. Cấu hình `childrenKey`, `maxDepth`, `defaultExpanded` (boolean | number), `indentSize`. Pagination chỉ tính trên root rows. Cây tự nhả/thu qua icon ▸/▾ ở cột đầu tiên.'
  );

  // ── Data ───────────────────────────────────────────────────────────────────
  private readonly treeData = generateTree(40);
  rootCount = signal(this.treeData.length);

  // ── Reactive table option ──────────────────────────────────────────────────
  tableOption = computed((): SdTableOption<BudgetItem> => ({
    type: 'local',
    key: 'table-tree-demo',
    tree: {
      childrenKey: 'children',
      maxDepth: this.maxDepth(),
      defaultExpanded: this.resolveDefaultExpanded(),
      indentSize: this.indentSize(),
    },
    columns: this.buildColumns(),
    items: () => this.treeData,
    index: this.showIndex() ? { enabled: true, title: 'STT gốc', width: '80px' } : { enabled: false },
    selector: { visible: this.showSelector() },
    paginate: { pageSize: 10, pages: [10, 25, 50] },
    filter: { hideExternalFilterToolbar: true },
    config: { visible: true },
    style: {
      rowCss: (_row, _i, ctx) => {
        if (!ctx) return {};
        if (ctx.level === 0) return { 'background-color': '#f8fafc' };
        if (ctx.hasChildren) return { 'font-weight': '600' };
        return {};
      },
    },
  }));

  private resolveDefaultExpanded(): boolean | number {
    const mode = this.defaultExpandedMode();
    if (mode === 'true') return true;
    if (mode === 'false') return false;
    return this.expandLevel();
  }

  // ── Generated TS snippet ───────────────────────────────────────────────────
  tsCode = computed(() => {
    const expanded =
      this.defaultExpandedMode() === 'level'
        ? this.expandLevel()
        : this.defaultExpandedMode();
    return `interface BudgetItem {
  id: string;
  stt: string;
  name: string;
  totalCost: number;
  children?: BudgetItem[];   // ← key chứa con — khớp tree.childrenKey
}

tableOption: SdTableOption<BudgetItem> = {
  type: 'local',
  key: 'budget-tree',
  items: () => this.getBudgetRoots(),

  // ─── TREE CONFIG ──────────────────────────────────────────────
  tree: {
    childrenKey: 'children',     // tên field chứa mảng con (mặc định)
    maxDepth: ${this.maxDepth()},                  // giới hạn độ sâu render
    defaultExpanded: ${typeof expanded === 'number' ? expanded : expanded},   // false | true | số cấp
    indentSize: ${this.indentSize()},                // px indent mỗi cấp (mặc định 20)
    // onExpandChildren?: row => this.api.loadChildren(row.id)
    //   ← lazy load khi row chưa có children embedded
  },

  columns: [
    { field: 'stt',       title: 'STT',          type: 'string', width: '120px' },
    { field: 'name',      title: 'Tên hạng mục', type: 'string', width: '320px' },
    { field: 'unit',      title: 'Đơn vị',       type: 'string', width: '100px' },
    { field: 'quantity',  title: 'SL',           type: 'number', width: '90px', align: 'right' },
    { field: 'unitPrice', title: 'Đơn giá',      type: 'number', width: '140px', align: 'right' },
    { field: 'totalCost', title: 'Thành tiền',   type: 'number', width: '160px', align: 'right' },
  ],

  paginate: { pageSize: 10, pages: [10, 25, 50] },  // pageSize tính trên root rows

  style: {
    // Row màu nhạt cho root, in đậm cho parent có con
    rowCss: (_row, _i, ctx) => {
      if (ctx?.level === 0) return { 'background-color': '#f8fafc' };
      if (ctx?.hasChildren) return { 'font-weight': '600' };
      return {};
    },
  },
};`;
  });

  // ── Columns ────────────────────────────────────────────────────────────────
  private buildColumns(): SdTableColumn<BudgetItem>[] {
    return [
      { field: 'stt', title: 'STT', type: 'string', width: '140px', sortable: false, filter: { disabled: true } },
      { field: 'name', title: 'Tên hạng mục', type: 'string', width: '340px' },
      {
        field: 'unit',
        title: 'Đơn vị',
        type: 'string',
        width: '100px',
        sortable: false,
        filter: { disabled: true },
      },
      {
        field: 'quantity',
        title: 'SL',
        type: 'number',
        width: '90px',
        align: 'right',
        sortable: false,
        filter: { disabled: true },
      },
      {
        field: 'unitPrice',
        title: 'Đơn giá (₫)',
        type: 'number',
        width: '150px',
        align: 'right',
        sortable: false,
        filter: { disabled: true },
        transform: v => formatVnd(v as number),
      },
      {
        field: 'totalCost',
        title: 'Thành tiền (₫)',
        type: 'number',
        width: '170px',
        align: 'right',
        sortable: true,
        filter: { disabled: true },
        transform: v => formatVnd(v as number),
      },
    ];
  }
}
