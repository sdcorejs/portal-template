import { Component, computed, signal, viewChild } from '@angular/core';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSideDrawer } from '@sd-angular/core/components/side-drawer';
import { SdTable, SdTableColumn, SdTableCommand, SdTableOption } from '@sd-angular/core/components/table';
import { SdUtilities } from '@sd-angular/core/utilities/extensions';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';

interface DemoItem {
  id: number;
  code: string;
  name: string;
  amount: number;
  status: boolean;
  createdDate: string;
}

type ColumnType = 'string' | 'number' | 'date' | 'datetime' | 'boolean';
type FilterType = 'string' | 'number' | 'date' | 'datetime' | 'boolean';
type ItemColor = 'primary' | 'secondary' | 'error' | 'warning' | 'success';

interface ColumnConfig {
  id: string;
  field: string;
  title: string;
  type: ColumnType;
  width: string;
}

interface CommandConfig {
  id: string;
  title: string;
  icon: string;
  color: ItemColor;
}

interface ActionConfig {
  id: string;
  title: string;
  icon: string;
  color: ItemColor;
}

interface FilterConfig {
  id: string;
  field: string;
  title: string;
  type: FilterType;
  required: boolean;
}

interface TableDemoConfig {
  columns: ColumnConfig[];
  commands: CommandConfig[];
  showSelector: boolean;
  actions: ActionConfig[];
  filters: FilterConfig[];
  hideFilterToolbar: boolean;
  filterPerRow: 4 | 6;
  showPaginate: boolean;
  showReload: boolean;
  showConfig: boolean;
  showExport: boolean;
}

const DEFAULT_CONFIG: TableDemoConfig = {
  columns: [
    { id: 'col-id',   field: 'id',          title: 'ID',         type: 'number',   width: '80px'  },
    { id: 'col-code', field: 'code',         title: 'Mã',         type: 'string',   width: '120px' },
    { id: 'col-name', field: 'name',         title: 'Tên',        type: 'string',   width: '200px' },
    { id: 'col-amt',  field: 'amount',       title: 'Số tiền',    type: 'number',   width: '140px' },
    { id: 'col-sts',  field: 'status',       title: 'Trạng thái', type: 'boolean',  width: '130px' },
    { id: 'col-dt',   field: 'createdDate',  title: 'Ngày tạo',   type: 'datetime', width: '165px' },
  ],
  commands: [
    { id: 'cmd-edit', title: 'Sửa', icon: 'edit', color: 'primary' },
  ],
  showSelector: false,
  actions: [],
  filters: [],
  hideFilterToolbar: false,
  filterPerRow: 6,
  showPaginate: true,
  showReload: true,
  showConfig: true,
  showExport: false,
};

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

@Component({
  selector: 'app-demo-table',
  standalone: true,
  imports: [SdTable, SdSideDrawer, SdButton, SdCodeEditor, SdInput, SdLabel, SdSelect, SdSwitch],
  templateUrl: './demo-table.component.html',
  styleUrls: ['./demo-table.component.scss'],
})
export class DemoTableComponent {
  private readonly tableKey = SdUtilities.generateUuid();

  settingsDrawer = viewChild.required<SdSideDrawer>('settingsDrawer');
  activeTab = signal<'properties' | 'source'>('properties');

  appliedConfig = signal<TableDemoConfig>(clone(DEFAULT_CONFIG));

  draftColumns: ColumnConfig[] = [];
  draftCommands: CommandConfig[] = [];
  draftShowSelector = false;
  draftActions: ActionConfig[] = [];
  draftFilters: FilterConfig[] = [];
  draftHideFilterToolbar = false;
  draftFilterPerRow: 4 | 6 = 6;
  draftShowPaginate = true;
  draftShowReload   = true;
  draftShowConfig   = true;
  draftShowExport   = false;

  editingColumnId  = signal<string | null>(null);
  editingCommandId = signal<string | null>(null);
  editingActionId  = signal<string | null>(null);
  editingFilterId  = signal<string | null>(null);

  readonly columnTypeOptions: { id: ColumnType; name: string }[] = [
    { id: 'string',   name: 'string'   },
    { id: 'number',   name: 'number'   },
    { id: 'date',     name: 'date'     },
    { id: 'datetime', name: 'datetime' },
    { id: 'boolean',  name: 'boolean'  },
  ];

  readonly filterTypeOptions: { id: FilterType; name: string }[] = [
    { id: 'string',   name: 'string'   },
    { id: 'number',   name: 'number'   },
    { id: 'date',     name: 'date'     },
    { id: 'datetime', name: 'datetime' },
    { id: 'boolean',  name: 'boolean'  },
  ];

  readonly filterPerRowOptions: { id: 4 | 6; name: string }[] = [
    { id: 6, name: '6 filters/dòng' },
    { id: 4, name: '4 filters/dòng' },
  ];

  readonly colorOptions: { id: ItemColor; name: string }[] = [
    { id: 'primary',   name: 'primary'   },
    { id: 'secondary', name: 'secondary' },
    { id: 'error',     name: 'error'     },
    { id: 'warning',   name: 'warning'   },
    { id: 'success',   name: 'success'   },
  ];

  tableOption = computed((): SdTableOption<DemoItem> => {
    const cfg = this.appliedConfig();

    const columns = cfg.columns.map(c => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      field: c.field as any,
      title: c.title,
      type: c.type,
      width: c.width,
      ...(c.type === 'boolean'
        ? { option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Khóa' } }
        : {}),
    })) as SdTableColumn<DemoItem>[];

    const commands: SdTableCommand<DemoItem>[] = cfg.commands.map(cmd => ({
      icon: cmd.icon,
      title: cmd.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      color: cmd.color as any,
      click: (row: DemoItem) => {
        alert(`[Tác vụ dòng] "${cmd.title}"\nIcon: ${cmd.icon} | Màu: ${cmd.color}\nDòng được click — ID: ${row.id}, Mã: ${row.code}`);
      },
    }));

    const base = {
      key: this.tableKey,
      type: 'local' as const,
      items: () => this.getMockData(),
      columns,
      commands: commands.length ? commands : undefined,
      ...(cfg.showPaginate ? { paginate: {} } : {}),
      ...(cfg.showPaginate && cfg.showConfig  ? { config: { visible: true } } : {}),
      ...(cfg.showPaginate && cfg.showReload  ? { reload: { visible: true } } : {}),
      ...(cfg.showPaginate && cfg.showExport  ? { export: { visible: 'EXCEL' as const } } : {}),
    };

    const selectorOption = cfg.showSelector
      ? {
          selector: cfg.actions.length > 0
            ? {
                visible: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                actions: cfg.actions.map(a => ({
                  icon: a.icon,
                  title: a.title,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  color: a.color as any,
                  click: (rows: DemoItem[]) => {
                    alert(`[Tác vụ hàng loạt] "${a.title}"\nIcon: ${a.icon} | Màu: ${a.color}\nSố dòng chọn: ${rows.length} | ID: ${rows.map(r => r.id).join(', ')}`);
                  },
                })),
              }
            : { visible: true },
        }
      : {};

    const hasFilter = cfg.filters.length > 0 || cfg.hideFilterToolbar || cfg.filterPerRow !== 6;
    const filterOption = hasFilter
      ? {
          filter: {
            ...(cfg.filters.length > 0
              ? {
                  externalFilters: cfg.filters.map(f => ({
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    field: f.field as any,
                    title: f.title,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    type: f.type as any,
                    defaultShowing: true,
                    ...(f.required ? { required: true } : {}),
                  })),
                }
              : {}),
            ...(cfg.filterPerRow !== 6 ? { externalFilterPerRow: cfg.filterPerRow } : {}),
            ...(cfg.hideFilterToolbar ? { hideExternalFilterToolbar: true } : {}),
          },
        }
      : {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { ...base, ...selectorOption, ...filterOption } as unknown as SdTableOption<DemoItem>;
  });

  generatedCode = computed(() => {
    const cfg = this.appliedConfig();

    const colLines = cfg.columns
      .map(c => {
        let s = `    { field: '${c.field}', title: '${c.title}', type: '${c.type}', width: '${c.width}'`;
        if (c.type === 'boolean') s += `,\n      option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Khóa' }`;
        return s + ' },';
      })
      .join('\n');

    const cmdLines = cfg.commands
      .map(c => `    { icon: '${c.icon}', title: '${c.title}', color: '${c.color}', click: row => this.on${c.title}(row) },`)
      .join('\n');

    let selectorCode = '';
    if (cfg.showSelector) {
      if (cfg.actions.length > 0) {
        const actLines = cfg.actions
          .map(a => `      { icon: '${a.icon}', title: '${a.title}', color: '${a.color}',\n        click: rows => this.on${a.title}(rows) },`)
          .join('\n');
        selectorCode = `  selector: {\n    visible: true,\n    actions: [\n${actLines}\n    ],\n  },\n`;
      } else {
        selectorCode = `  selector: { visible: true },\n`;
      }
    }

    let filterCode = '';
    const hasFilter = cfg.filters.length > 0 || cfg.hideFilterToolbar || cfg.filterPerRow !== 6;
    if (hasFilter) {
      const fParts: string[] = [];
      if (cfg.filters.length > 0) {
        const fLines = cfg.filters
          .map(f => {
            let s = `    { field: '${f.field}', title: '${f.title}', type: '${f.type}', defaultShowing: true`;
            if (f.required) s += `, required: true`;
            return s + ' },';
          })
          .join('\n');
        fParts.push(`  externalFilters: [\n${fLines}\n  ],`);
      }
      if (cfg.filterPerRow !== 6) fParts.push(`  externalFilterPerRow: ${cfg.filterPerRow},`);
      if (cfg.hideFilterToolbar) fParts.push(`  hideExternalFilterToolbar: true,`);
      filterCode = `\n  filter: {\n${fParts.map(p => `  ${p}`).join('\n')}\n  },`;
    }

    const paginateCode = cfg.showPaginate
      ? [
          cfg.showReload ? `  reload: { visible: true },` : null,
          cfg.showConfig ? `  config: { visible: true },` : null,
          cfg.showExport ? `  export: { visible: 'EXCEL' },` : null,
        ].filter((l): l is string => l !== null).join('\n') + '\n'
      : '';

    return `tableOption: SdTableOption<Item> = {
  key: 'my-list',
  type: 'server',
  items: async (_, pagingReq) => await this.itemService.paging(pagingReq),
  columns: [
${colLines}
  ],${cfg.commands.length ? `\n  commands: [\n${cmdLines}\n  ],` : ''}
${selectorCode}${filterCode}${paginateCode}};`;
  });

  openSettings(): void {
    const cfg = this.appliedConfig();
    this.draftColumns = clone(cfg.columns);
    this.draftCommands = clone(cfg.commands);
    this.draftShowSelector = cfg.showSelector;
    this.draftActions = clone(cfg.actions);
    this.draftFilters = clone(cfg.filters);
    this.draftHideFilterToolbar = cfg.hideFilterToolbar;
    this.draftFilterPerRow = cfg.filterPerRow;
    this.draftShowPaginate = cfg.showPaginate;
    this.draftShowReload   = cfg.showReload;
    this.draftShowConfig   = cfg.showConfig;
    this.draftShowExport   = cfg.showExport;
    this.editingColumnId.set(null);
    this.editingCommandId.set(null);
    this.editingActionId.set(null);
    this.editingFilterId.set(null);
    this.activeTab.set('properties');
    this.settingsDrawer().open();
  }

  applyConfig(): void {
    this.appliedConfig.set({
      columns: clone(this.draftColumns),
      commands: clone(this.draftCommands),
      showSelector: this.draftShowSelector,
      actions: clone(this.draftActions),
      filters: clone(this.draftFilters),
      hideFilterToolbar: this.draftHideFilterToolbar,
      filterPerRow: this.draftFilterPerRow,
      showPaginate: this.draftShowPaginate,
      showReload:   this.draftShowReload,
      showConfig:   this.draftShowConfig,
      showExport:   this.draftShowExport,
    });
    this.settingsDrawer().close();
  }

  cancelConfig(): void {
    this.settingsDrawer().close();
  }

  // ── Column management ──────────────────────────────────
  toggleEditColumn(id: string): void {
    this.editingColumnId.set(this.editingColumnId() === id ? null : id);
  }

  addColumn(): void {
    const newId = `col-${Date.now()}`;
    this.draftColumns = [...this.draftColumns, { id: newId, field: 'newField', title: 'Cột mới', type: 'string', width: '150px' }];
    this.editingColumnId.set(newId);
  }

  removeColumn(id: string): void {
    this.draftColumns = this.draftColumns.filter(c => c.id !== id);
    if (this.editingColumnId() === id) this.editingColumnId.set(null);
  }

  // ── Command management ─────────────────────────────────
  toggleEditCommand(id: string): void {
    this.editingCommandId.set(this.editingCommandId() === id ? null : id);
  }

  addCommand(): void {
    const newId = `cmd-${Date.now()}`;
    this.draftCommands = [...this.draftCommands, { id: newId, title: 'Tác vụ mới', icon: 'edit', color: 'primary' }];
    this.editingCommandId.set(newId);
  }

  removeCommand(id: string): void {
    this.draftCommands = this.draftCommands.filter(c => c.id !== id);
    if (this.editingCommandId() === id) this.editingCommandId.set(null);
  }

  // ── Filter management ─────────────────────────────────
  toggleEditFilter(id: string): void {
    this.editingFilterId.set(this.editingFilterId() === id ? null : id);
  }

  addFilter(): void {
    const newId = `flt-${Date.now()}`;
    this.draftFilters = [...this.draftFilters, { id: newId, field: 'newField', title: 'Filter mới', type: 'string', required: false }];
    this.editingFilterId.set(newId);
  }

  removeFilter(id: string): void {
    this.draftFilters = this.draftFilters.filter(f => f.id !== id);
    if (this.editingFilterId() === id) this.editingFilterId.set(null);
  }

  // ── Action management ──────────────────────────────────
  toggleEditAction(id: string): void {
    this.editingActionId.set(this.editingActionId() === id ? null : id);
  }

  addAction(): void {
    const newId = `act-${Date.now()}`;
    this.draftActions = [...this.draftActions, { id: newId, title: 'Tác vụ mới', icon: 'delete', color: 'error' }];
    this.editingActionId.set(newId);
  }

  removeAction(id: string): void {
    this.draftActions = this.draftActions.filter(a => a.id !== id);
    if (this.editingActionId() === id) this.editingActionId.set(null);
  }

  private getMockData(): DemoItem[] {
    const names = ['Alpha Corp', 'Beta Ltd', 'Gamma Inc', 'Delta Co', 'Epsilon LLC',
                   'Zeta Group', 'Eta Partners', 'Theta Sys', 'Iota Tech', 'Kappa Pro'];
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      code: `ITM-${String(i + 1).padStart(3, '0')}`,
      name: names[i % names.length],
      amount: (100 + i * 37) * 1_000,
      status: i % 4 !== 3,
      createdDate: new Date(2024, i % 12, (i % 28) + 1, 8 + (i % 4), i % 60).toISOString(),
    }));
  }
}
