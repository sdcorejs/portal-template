import { CommonModule } from '@angular/common';
import { Component, computed, signal, viewChild } from '@angular/core';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection, SdSectionItem } from '@sd-angular/core/components/section';
import { SdSideDrawer } from '@sd-angular/core/components/side-drawer';
import { SdTable, SdTableOption } from '@sd-angular/core/components/table';
import { SdUploadFile } from '@sd-angular/core/components/upload-file';
import { SdDate } from '@sd-angular/core/forms/date';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdTextarea } from '@sd-angular/core/forms/textarea';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import { SdUtilities } from '@sd-angular/core/utilities/extensions';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ComponentType =
  | 'table' | 'button' | 'section'
  | 'input' | 'select' | 'textarea' | 'date' | 'upload-file';

export type FormComponentType = 'input' | 'select' | 'textarea' | 'date' | 'upload-file';

export interface ButtonCfg {
  title: string;
  type: 'fill' | 'light' | 'outline' | 'link';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size: 'sm' | 'md' | 'lg';
  prefixIcon: string;
  suffixIcon: string;
  disabled: boolean;
}

export interface TableCfg {
  showPaginate: boolean;
  showReload: boolean;
  showConfig: boolean;
  showSelector: boolean;
  showExport: boolean;
}

export interface SectionItem {
  id: string;
  type: FormComponentType;
  label: string;
  placeholder: string;
  required: boolean;
  colSpan: number; // 1–6
}

export interface SectionCfg {
  title: string;
  icon: string;
  subTitle: string;
  collapsable: boolean;
  noPaddingBody: boolean;
  items: SectionItem[];
}

export interface InputCfg  { label: string; placeholder: string; required: boolean; }
export interface SelectCfg { label: string; required: boolean; }
export interface DateCfg   { label: string; required: boolean; }
export interface TextareaCfg { label: string; placeholder: string; rows: number; required: boolean; }
export interface UploadCfg  { label: string; max: number; }

export type ItemConfig =
  ButtonCfg | TableCfg | SectionCfg | InputCfg | SelectCfg | DateCfg | TextareaCfg | UploadCfg;

export interface CanvasItem {
  id: string;
  type: ComponentType;
  colSpan: number; // 1–12
  height: string;  // 'auto' | '100%' | '300px' …
  config: ItemConfig;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clone<T>(v: T): T { return JSON.parse(JSON.stringify(v)); }

function toPascal(s: string): string {
  return (s ?? '').trim().replace(/\s+/g, ' ').split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function toCamel(s: string): string {
  const p = toPascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function defaultColSpan(t: ComponentType): number {
  return t === 'table' || t === 'section' ? 12 : t === 'button' ? 3 : 6;
}

function defaultConfig(t: ComponentType): ItemConfig {
  switch (t) {
    case 'button':      return { title: 'Lưu', type: 'fill', color: 'primary', size: 'md', prefixIcon: 'save', suffixIcon: '', disabled: false } as ButtonCfg;
    case 'table':       return { showPaginate: true, showReload: true, showConfig: true, showSelector: false, showExport: false } as TableCfg;
    case 'section':     return { title: 'Thông tin', icon: 'info', subTitle: '', collapsable: false, noPaddingBody: true, items: [] } as SectionCfg;
    case 'input':       return { label: 'Trường nhập liệu', placeholder: '', required: false } as InputCfg;
    case 'select':      return { label: 'Chọn giá trị', required: false } as SelectCfg;
    case 'date':        return { label: 'Ngày', required: false } as DateCfg;
    case 'textarea':    return { label: 'Ghi chú', placeholder: '', rows: 3, required: false } as TextareaCfg;
    case 'upload-file': return { label: 'Tệp đính kèm', max: 1 } as UploadCfg;
  }
}

// ── Mock data ─────────────────────────────────────────────────────────────────

interface MockItem { id: number; code: string; name: string; amount: number; status: boolean; }

function getMockData(): MockItem[] {
  const names = ['Alpha Corp', 'Beta Ltd', 'Gamma Inc', 'Delta Co', 'Epsilon LLC',
                 'Zeta Group', 'Eta Partners', 'Theta Sys', 'Iota Tech', 'Kappa Pro'];
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    code: `ITM-${String(i + 1).padStart(3, '0')}`,
    name: names[i % names.length],
    amount: (100 + i * 37) * 1_000,
    status: i % 3 !== 2,
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-page-builder',
  standalone: true,
  imports: [
    CommonModule,
    SdPageComponent,
    SdSection, SdSectionItem,
    SdButton,
    SdTable,
    SdInput, SdSelect, SdTextarea, SdDate, SdUploadFile,
    SdSwitch, SdLabel,
    SdSideDrawer, SdCodeEditor,
  ],
  templateUrl: './page-builder.component.html',
  styleUrls: ['./page-builder.component.scss'],
})
export class PageBuilderComponent {
  readonly alert = alert;

  settingsDrawer = viewChild.required<SdSideDrawer>('settingsDrawer');

  // ── State ─────────────────────────────────────────────────────────────────
  items            = signal<CanvasItem[]>([]);
  selectedId       = signal<string | null>(null);
  activeTab        = signal<'properties' | 'source'>('properties');
  activeSource     = signal<'html' | 'ts'>('html');
  sectionDragOver  = signal<string | null>(null);
  showSource       = signal(false);

  /** Plain mutable draft — no signal needed (default CD picks up mutations on each event) */
  draft: CanvasItem | null = null;
  draftSectionEditId: string | null = null;

  // ── Palette ───────────────────────────────────────────────────────────────
  readonly paletteItems: { type: ComponentType; label: string; icon: string; desc: string }[] = [
    { type: 'table',       label: 'Table',       icon: 'table_chart',             desc: 'Bảng dữ liệu server / local' },
    { type: 'button',      label: 'Button',      icon: 'smart_button',            desc: 'Nút bấm hành động' },
    { type: 'section',     label: 'Section',     icon: 'view_in_ar',              desc: 'Khung chứa form' },
    { type: 'input',       label: 'Input',       icon: 'text_fields',             desc: 'Ô nhập liệu văn bản' },
    { type: 'select',      label: 'Select',      icon: 'arrow_drop_down_circle',  desc: 'Dropdown lựa chọn' },
    { type: 'date',        label: 'Date',        icon: 'calendar_today',          desc: 'Chọn ngày tháng' },
    { type: 'upload-file', label: 'Upload File', icon: 'upload_file',             desc: 'Tải tệp lên' },
    { type: 'textarea',    label: 'Textarea',    icon: 'notes',                   desc: 'Nhập nhiều dòng' },
  ];

  readonly colSpanOptions  = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `${i + 1} cột` }));
  readonly colSpan6Options = Array.from({ length: 6  }, (_, i) => ({ id: i + 1, name: `${i + 1} cột` }));
  readonly heightOptions   = [
    { id: 'auto',  name: 'Auto (theo nội dung)' },
    { id: '100%',  name: '100% (đầy container)' },
    { id: '200px', name: '200px' },
    { id: '300px', name: '300px' },
    { id: '400px', name: '400px' },
    { id: '500px', name: '500px' },
  ];
  readonly btnTypeOptions  = [
    { id: 'fill', name: 'fill' }, { id: 'light', name: 'light' },
    { id: 'outline', name: 'outline' }, { id: 'link', name: 'link' },
  ];
  readonly btnColorOptions = [
    { id: 'primary', name: 'primary' }, { id: 'secondary', name: 'secondary' },
    { id: 'success', name: 'success' }, { id: 'warning', name: 'warning' },
    { id: 'error', name: 'error' },
  ];
  readonly btnSizeOptions  = [
    { id: 'sm', name: 'sm — Nhỏ' }, { id: 'md', name: 'md — Vừa' }, { id: 'lg', name: 'lg — Lớn' },
  ];
  readonly formTypeOptions: { id: FormComponentType; name: string }[] = [
    { id: 'input', name: 'Input' }, { id: 'select', name: 'Select' },
    { id: 'textarea', name: 'Textarea' }, { id: 'date', name: 'Date' },
    { id: 'upload-file', name: 'Upload File' },
  ];

  // ── Typed config getters for draft ────────────────────────────────────────
  get draftBtnCfg(): ButtonCfg   { return this.draft?.config as ButtonCfg; }
  get draftTblCfg(): TableCfg    { return this.draft?.config as TableCfg; }
  get draftSecCfg(): SectionCfg  { return this.draft?.config as SectionCfg; }
  get draftInpCfg(): InputCfg    { return this.draft?.config as InputCfg; }
  get draftSelCfg(): SelectCfg   { return this.draft?.config as SelectCfg; }
  get draftDtCfg():  DateCfg     { return this.draft?.config as DateCfg; }
  get draftTaCfg():  TextareaCfg { return this.draft?.config as TextareaCfg; }
  get draftUplCfg(): UploadCfg   { return this.draft?.config as UploadCfg; }

  get draftSecEditItem(): SectionItem | null {
    if (!this.draftSectionEditId) return null;
    return this.draftSecCfg?.items.find(i => i.id === this.draftSectionEditId) ?? null;
  }

  // ── Computed ──────────────────────────────────────────────────────────────
  getTableOption(item: CanvasItem): SdTableOption<MockItem> {
    const cfg = item.config as TableCfg;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      key: item.id,
      type: 'local',
      items: () => getMockData(),
      columns: [
        { field: 'id',     title: 'ID',          type: 'number',  width: '70px'  },
        { field: 'code',   title: 'Mã',          type: 'string',  width: '110px' },
        { field: 'name',   title: 'Tên',         type: 'string',  width: '180px' },
        { field: 'amount', title: 'Số tiền',     type: 'number',  width: '130px' },
        { field: 'status', title: 'Trạng thái',  type: 'boolean', width: '120px',
          option: { displayOnTrue: 'Hoạt động', displayOnFalse: 'Khóa' } },
      ],
      commands: [
        { icon: 'edit',   title: 'Sửa',  color: 'primary', click: (row) => alert(`Sửa dòng — ID: ${row.id}, Mã: ${row.code}`) },
        { icon: 'delete', title: 'Xoá',  color: 'error',   click: (row) => alert(`Xoá dòng — ID: ${row.id}`) },
      ],
      ...(cfg.showSelector ? { selector: { visible: true } } : {}),
      ...(cfg.showPaginate ? { paginate: {} } : {}),
      ...(cfg.showPaginate && cfg.showReload ? { reload: { visible: true } } : {}),
      ...(cfg.showPaginate && cfg.showConfig ? { config: { visible: true } } : {}),
      ...(cfg.showPaginate && cfg.showExport ? { export: { visible: 'EXCEL' as const } } : {}),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as SdTableOption<MockItem>;
  }

  getTypeLabel(t?: ComponentType | null): string {
    return this.paletteItems.find(p => p.type === t)?.label ?? (t ?? '');
  }
  getTypeIcon(t?: ComponentType | null): string {
    return this.paletteItems.find(p => p.type === t)?.icon ?? 'widgets';
  }
  getSectionItems(item: CanvasItem): SectionItem[] {
    return (item.config as SectionCfg).items ?? [];
  }

  // ── Drag from palette ─────────────────────────────────────────────────────
  onPaletteDragStart(event: DragEvent, type: string): void {
    event.dataTransfer!.setData('palette-type', type);
    event.dataTransfer!.effectAllowed = 'copy';
  }

  // ── Canvas drop ───────────────────────────────────────────────────────────
  onCanvasDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }

  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    const type = event.dataTransfer!.getData('palette-type') as ComponentType;
    if (type) this.addItem(type);
  }

  onItemDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
  }

  onItemDrop(event: DragEvent, beforeId: string): void {
    event.preventDefault();
    event.stopPropagation();
    const type = event.dataTransfer!.getData('palette-type') as ComponentType;
    if (type) this.addItemBefore(type, beforeId);
  }

  // ── Section inner drop ────────────────────────────────────────────────────
  readonly formTypes: string[] = ['input', 'select', 'textarea', 'date', 'upload-file'];

  onSectionDragOver(event: DragEvent, sectionId: string): void {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'copy';
    this.sectionDragOver.set(sectionId);
  }

  onSectionDrop(event: DragEvent, sectionId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.sectionDragOver.set(null);
    const type = event.dataTransfer!.getData('palette-type');
    if (!this.formTypes.includes(type)) {
      alert('Chỉ có thể kéo Input, Select, Textarea, Date, Upload File vào Section!');
      return;
    }
    this.addSectionItem(sectionId, type as FormComponentType);
  }

  onSectionDragLeave(): void { this.sectionDragOver.set(null); }

  // ── Item management ───────────────────────────────────────────────────────
  private createItem(type: ComponentType): CanvasItem {
    return { id: SdUtilities.generateUuid(), type, colSpan: defaultColSpan(type), height: 'auto', config: defaultConfig(type) };
  }

  addItem(type: ComponentType): void {
    this.items.update(list => [...list, this.createItem(type)]);
  }

  addItemBefore(type: ComponentType, beforeId: string): void {
    this.items.update(list => {
      const idx = list.findIndex(i => i.id === beforeId);
      const item = this.createItem(type);
      if (idx < 0) return [...list, item];
      const copy = [...list];
      copy.splice(idx, 0, item);
      return copy;
    });
  }

  removeItem(id: string): void {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  moveUp(id: string): void {
    this.items.update(list => {
      const idx = list.findIndex(i => i.id === id);
      if (idx <= 0) return list;
      const copy = [...list];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      return copy;
    });
  }

  moveDown(id: string): void {
    this.items.update(list => {
      const idx = list.findIndex(i => i.id === id);
      if (idx < 0 || idx >= list.length - 1) return list;
      const copy = [...list];
      [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      return copy;
    });
  }

  // ── Section item management (canvas) ─────────────────────────────────────
  addSectionItem(sectionId: string, type: FormComponentType): void {
    this.items.update(list => list.map(item => {
      if (item.id !== sectionId) return item;
      const cfg = item.config as SectionCfg;
      const si: SectionItem = {
        id: SdUtilities.generateUuid(), type,
        label: this.getTypeLabel(type), placeholder: '', required: false, colSpan: 3,
      };
      return { ...item, config: { ...cfg, items: [...cfg.items, si] } };
    }));
  }

  removeSectionItem(sectionId: string, itemId: string): void {
    this.items.update(list => list.map(item => {
      if (item.id !== sectionId) return item;
      const cfg = item.config as SectionCfg;
      return { ...item, config: { ...cfg, items: cfg.items.filter(i => i.id !== itemId) } };
    }));
  }

  // ── Settings drawer ───────────────────────────────────────────────────────
  openSettings(id: string): void {
    const item = this.items().find(i => i.id === id);
    if (!item) return;
    this.selectedId.set(id);
    this.draft = clone(item);
    this.draftSectionEditId = null;
    this.activeTab.set('properties');
    this.settingsDrawer().open();
  }

  applySettings(): void {
    if (!this.draft) return;
    const d = this.draft;
    this.items.update(list => list.map(i => i.id === d.id ? clone(d) : i));
    this.settingsDrawer().close();
  }

  cancelSettings(): void { this.settingsDrawer().close(); }

  // ── Section items in draft ────────────────────────────────────────────────
  toggleSectionEdit(id: string): void {
    this.draftSectionEditId = this.draftSectionEditId === id ? null : id;
  }

  addDraftSectionItem(type: FormComponentType): void {
    if (!this.draft) return;
    const cfg = this.draft.config as SectionCfg;
    const si: SectionItem = {
      id: SdUtilities.generateUuid(), type,
      label: this.getTypeLabel(type), placeholder: '', required: false, colSpan: 3,
    };
    cfg.items = [...cfg.items, si];
    this.draftSectionEditId = si.id;
  }

  removeDraftSectionItem(id: string): void {
    if (!this.draft) return;
    const cfg = this.draft.config as SectionCfg;
    cfg.items = cfg.items.filter(i => i.id !== id);
    if (this.draftSectionEditId === id) this.draftSectionEditId = null;
  }

  // ── Source code generation ────────────────────────────────────────────────
  generatedHtml = computed(() => {
    const list = this.items();
    if (!list.length) return '<!-- Chưa có component nào. Kéo component từ bảng bên trái vào canvas. -->';

    const lines: string[] = [
      '<sd-page title="Trang mới" description="Mô tả trang">',
      '  <div class="c-page-grid">',
    ];
    for (const item of list) lines.push(...this.genItemHtml(item, '    '));
    lines.push('  </div>', '</sd-page>');
    return lines.join('\n');
  });

  private genItemHtml(item: CanvasItem, pad: string): string[] {
    const colStyle = `style="grid-column: span ${item.colSpan}${item.height !== 'auto' ? `; height: ${item.height}` : ''}"`;
    const L: string[] = [];
    switch (item.type) {
      case 'button': {
        const c = item.config as ButtonCfg;
        L.push(`${pad}<div ${colStyle}>`);
        const parts = [`  title="${c.title}"`, `  type="${c.type}"`, `  color="${c.color}"`, `  size="${c.size}"`];
        if (c.prefixIcon) parts.push(`  prefixIcon="${c.prefixIcon}"`);
        if (c.suffixIcon) parts.push(`  suffixIcon="${c.suffixIcon}"`);
        if (c.disabled)   parts.push(`  [disabled]="true"`);
        parts.push(`  (click)="on${toPascal(c.title)}Click()">`);
        L.push(`${pad}  <sd-button\n${parts.map(p => pad + p).join('\n')}`);
        L.push(`${pad}  </sd-button>`);
        L.push(`${pad}</div>`);
        break;
      }
      case 'table': {
        L.push(`${pad}<div ${colStyle}>`);
        L.push(`${pad}  <sd-table [option]="tableOption"></sd-table>`);
        L.push(`${pad}</div>`);
        break;
      }
      case 'section': {
        const c = item.config as SectionCfg;
        const attrs = [`title="${c.title}"`];
        if (c.icon)       attrs.push(`icon="${c.icon}"`);
        if (c.subTitle)   attrs.push(`subTitle="${c.subTitle}"`);
        if (c.collapsable) attrs.push('collapsable');
        if (c.noPaddingBody) attrs.push('noPaddingBody');
        L.push(`${pad}<div ${colStyle}>`);
        L.push(`${pad}  <sd-section ${attrs.join(' ')}>`);
        if (c.items.length > 0) {
          L.push(`${pad}    <div class="c-form-grid">`);
          for (const si of c.items) {
            L.push(`${pad}      <div style="grid-column: span ${si.colSpan}">`);
            L.push(...this.genFormItemHtml(si, `${pad}        `));
            L.push(`${pad}      </div>`);
          }
          L.push(`${pad}    </div>`);
        }
        L.push(`${pad}  </sd-section>`, `${pad}</div>`);
        break;
      }
      default: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = item.config as any;
        const si: SectionItem = { id: item.id, type: item.type as FormComponentType, label: c.label ?? '', placeholder: c.placeholder ?? '', required: c.required ?? false, colSpan: item.colSpan };
        L.push(`${pad}<div ${colStyle}>`);
        L.push(...this.genFormItemHtml(si, `${pad}  `));
        L.push(`${pad}</div>`);
      }
    }
    return L;
  }

  private genFormItemHtml(si: SectionItem, pad: string): string[] {
    const field = toCamel(si.label);
    const req   = si.required ? ' [required]="true"' : '';
    const ph    = si.placeholder ? ` placeholder="${si.placeholder}"` : '';
    switch (si.type) {
      case 'input':       return [`${pad}<sd-input [label]="'${si.label}'"${ph}${req} [(model)]="${field}"></sd-input>`];
      case 'select':      return [`${pad}<sd-select [label]="'${si.label}'" [items]="${field}Options" valueField="id" displayField="name"${req} [(model)]="${field}"></sd-select>`];
      case 'textarea':    return [`${pad}<sd-textarea [label]="'${si.label}'"${ph} [(model)]="${field}"></sd-textarea>`];
      case 'date':        return [`${pad}<sd-date [label]="'${si.label}'"${req} [(model)]="${field}"></sd-date>`];
      case 'upload-file': return [`${pad}<sd-upload-file [label]="'${si.label}'" [(model)]="${field}Files" (filesChanged)="on${toPascal(si.label)}Uploaded($event)"></sd-upload-file>`];
    }
  }

  generatedTs = computed(() => {
    const list = this.items();
    if (!list.length) return '// Chưa có component nào.';

    const imports = new Set<string>([
      `import { Component } from '@angular/core';`,
      `import { SdPageComponent } from '@sd-angular/core/modules/layout';`,
    ]);
    const fields:   string[] = [];
    const methods:  string[] = [];
    const addedFields = new Set<string>();

    const processFormItem = (si: SectionItem) => {
      const f = toCamel(si.label);
      if (addedFields.has(f)) return;
      addedFields.add(f);

      switch (si.type) {
        case 'input':
          imports.add(`import { SdInput } from '@sd-angular/core/forms/input';`);
          fields.push(`  ${f} = '';`);
          break;
        case 'select':
          imports.add(`import { SdSelect } from '@sd-angular/core/forms/select';`);
          fields.push(`  ${f}: number | null = null;`);
          fields.push(`  ${f}Options = [{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }];`);
          break;
        case 'textarea':
          imports.add(`import { SdTextarea } from '@sd-angular/core/forms/textarea';`);
          fields.push(`  ${f} = '';`);
          break;
        case 'date':
          imports.add(`import { SdDate } from '@sd-angular/core/forms/date';`);
          fields.push(`  ${f}: string | null = null;`);
          break;
        case 'upload-file':
          imports.add(`import { SdUploadFile } from '@sd-angular/core/components/upload-file';`);
          fields.push(`  ${f}Files: File[] = [];`);
          methods.push(
            `  on${toPascal(si.label)}Uploaded(files: (string | File)[]): void {`,
            `    alert('Đã tải lên ' + files.length + ' tệp');`,
            `  }`,
          );
          break;
      }
    };

    for (const item of list) {
      switch (item.type) {
        case 'button': {
          imports.add(`import { SdButton } from '@sd-angular/core/components/button';`);
          const c = item.config as ButtonCfg;
          methods.push(
            `  on${toPascal(c.title)}Click(): void {`,
            `    alert('Đã click nút "${c.title}"');`,
            `  }`,
          );
          break;
        }
        case 'table':
          imports.add(`import { SdTable, SdTableOption } from '@sd-angular/core/components/table';`);
          if (!addedFields.has('__table')) {
            addedFields.add('__table');
            fields.push(
              `  tableOption: SdTableOption<any> = {`,
              `    key: 'my-table', type: 'server',`,
              `    items: async (_, req) => await this.loadTableData(req),`,
              `    columns: [`,
              `      { field: 'id', title: 'ID', type: 'number', width: '80px' },`,
              `      { field: 'name', title: 'Tên', type: 'string', width: '200px' },`,
              `    ],`,
              `    commands: [`,
              `      { icon: 'edit', title: 'Sửa', color: 'primary', click: row => this.onTableEdit(row) },`,
              `      { icon: 'delete', title: 'Xoá', color: 'error', click: row => this.onTableDelete(row) },`,
              `    ],`,
              `    paginate: {}, reload: { visible: true },`,
              `  };`,
            );
            methods.push(
              `  async loadTableData(req: any): Promise<any> {`,
              `    // TODO: inject Service và gọi API`,
              `    throw new Error('Not implemented');`,
              `  }`,
              `  onTableEdit(row: any): void { alert('Sửa — ID: ' + row.id); }`,
              `  onTableDelete(row: any): void { alert('Xoá — ID: ' + row.id); }`,
            );
          }
          break;
        case 'section':
          imports.add(`import { SdSection, SdSectionItem } from '@sd-angular/core/components/section';`);
          (item.config as SectionCfg).items.forEach(processFormItem);
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          processFormItem({ id: item.id, type: item.type as FormComponentType, label: (item.config as any).label ?? '', placeholder: '', required: false, colSpan: item.colSpan });
      }
    }

    return [
      [...imports].join('\n'),
      '',
      `@Component({`,
      `  selector: 'app-my-page',`,
      `  standalone: true,`,
      `  imports: [SdPageComponent /* + các component đã dùng */],`,
      `  templateUrl: './my-page.component.html',`,
      `})`,
      `export class MyPageComponent {`,
      ...fields,
      '',
      ...methods,
      `}`,
    ].join('\n');
  });

  /** Code snippet for a single item (used in settings drawer → Source tab) */
  getItemCode(item: CanvasItem | null): string {
    if (!item) return '';
    return this.genItemHtml(item, '').join('\n');
  }
}
