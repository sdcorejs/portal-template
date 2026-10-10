import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal, viewChild } from '@angular/core';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdImportExcel, type SdImportExcelOption } from '@sdcorejs/angular/components/import-excel';
import { I18nService } from '@sdcorejs/angular/i18n';
import { SdExcelService } from '@sdcorejs/angular/services/excel';
import { DemoLabFrameComponent } from '../../../../shared/demo-lab/demo-lab-frame.component';

interface AssetRow {
  code: string;
  name: string;
  quantity: number;
  site: string;
}

@Component({
  selector: 'app-import-excel-demo',
  standalone: true,
  imports: [DemoLabFrameComponent, SdButton, SdImportExcel],
  templateUrl: './import-excel.component.html',
  styleUrls: ['../../../../shared/demo-lab/demo-lab.scss', './import-excel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportExcelDemoComponent {
  readonly i18n = inject(I18nService);
  private readonly excel = inject(SdExcelService);
  readonly importer = viewChild(SdImportExcel);
  readonly accepted = signal<AssetRow[]>([]);
  readonly readOnly = signal(false);
  readonly mounted = signal(true);
  readonly downloading = signal(false);
  readonly downloadError = signal(false);
  private readonly generation = signal(0);
  private remountTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.generation.update(value => value + 1);
      clearTimeout(this.remountTimer);
    });
  }

  t(vi: string, en: string): string {
    return this.i18n.language() === 'en' ? en : vi;
  }

  readonly option = computed<SdImportExcelOption<AssetRow>>(() => {
    const generation = this.generation();
    // Locale is intentionally a dependency: titles and validation copy follow the frame's language.
    this.i18n.language();
    return {
      title: this.t('Nhập tài sản cảng Harbor', 'Import Harbor assets'),
      fileName: 'harbor-assets.xlsx',
      limit: 20,
      columns: [
        { field: 'code', title: this.t('Mã tài sản', 'Asset code'), type: 'string', required: true, maxlength: 12 },
        { field: 'name', title: this.t('Tên tài sản', 'Asset name'), type: 'string', required: true, maxlength: 80 },
        { field: 'quantity', title: this.t('Số lượng', 'Quantity'), type: 'number', required: true, min: 1, max: 100 },
        {
          field: 'site',
          title: this.t('Kho', 'Site'),
          type: 'values',
          required: true,
          values: ['HARBOR', 'RIDGE'],
          checkValueInArray: true,
        },
      ],
      validateItem: (row, idx) => {
        if (!/^AST-\d{3}$/.test(row.code)) {
          return { idx, errorMessage: this.t('Mã phải có dạng AST-201.', 'Use an asset code such as AST-201.') };
        }
        if (!Number.isInteger(row.quantity)) {
          return { idx, errorMessage: this.t('Số lượng phải là số nguyên.', 'Quantity must be a whole number.') };
        }
        return row.quantity > 20
          ? {
              idx,
              warningMessage: this.t(
                'Trên 20 thiết bị: xác nhận sức chứa của kho trước khi dùng dữ liệu.',
                'More than 20 units: confirm site capacity before using these records.'
              ),
            }
          : { idx };
      },
      validateItems: rows =>
        rows.flatMap((row, idx) =>
          rows.filter(other => other.code === row.code).length > 1
            ? [{ idx, errorMessage: this.t('Mã tài sản bị trùng trong tệp.', 'Asset code is duplicated in the workbook.') }]
            : []
        ),
      // Native accept does not await a Promise. Keep this local callback synchronous.
      accept: rows => {
        if (this.destroyed || generation !== this.generation() || this.readOnly()) return [];
        if (this.importer()?.numberOfError || rows.length === 0) return [];
        this.accepted.set(rows.map(row => ({ ...row })));
        queueMicrotask(() => {
          if (!this.destroyed && generation === this.generation()) this.importer()?.close();
        });
        return [];
      },
    };
  });

  readonly optionCode = computed(
    () => `import { SdImportExcel } from '@sdcorejs/angular/components/import-excel';
import { SdExcelService } from '@sdcorejs/angular/services/excel';

// Local workbook: row 1 = field keys, row 2 = titles, data starts at row 3.
option = {
  columns: [
    { field: 'code', title: 'Asset code', type: 'string', required: true },
    { field: 'quantity', title: 'Quantity', type: 'number', min: 1, max: 100 }
  ],
  accept: (rows) => { this.localAssets = rows.map(row => ({ ...row })); return []; }
};
// <sd-import-excel #importer [option]="option" />
// Open with importer.open(); native upload reads a local .xlsx file.`
  );

  private remountImporter(): void {
    this.importer()?.close();
    this.generation.update(value => value + 1);
    this.mounted.set(false);
    clearTimeout(this.remountTimer);
    const generation = this.generation();
    this.remountTimer = setTimeout(() => {
      if (!this.destroyed && generation === this.generation()) this.mounted.set(true);
    }, 0);
  }

  reset(): void {
    this.remountImporter();
    this.accepted.set([]);
    this.readOnly.set(false);
    this.downloading.set(false);
    this.downloadError.set(false);
  }

  toggleReadOnly(): void {
    this.readOnly.update(value => !value);
    this.remountImporter();
    this.downloading.set(false);
    this.downloadError.set(false);
  }

  async downloadSample(mode: 'valid' | 'invalid' | 'empty' = 'valid'): Promise<void> {
    const generation = this.generation();
    this.downloading.set(true);
    this.downloadError.set(false);
    const rows: AssetRow[] =
      mode === 'empty'
        ? []
        : [
            { code: 'AST-201', name: 'Harbor scanner', quantity: 4, site: 'HARBOR' },
            { code: 'AST-202', name: 'Receiving tablet', quantity: mode === 'invalid' ? -1 : 26, site: 'HARBOR' },
          ];
    try {
      await this.excel.export({ columns: this.option().columns, items: rows, fileName: `harbor-assets-${mode}.xlsx` });
    } catch {
      if (!this.destroyed && generation === this.generation()) this.downloadError.set(true);
    } finally {
      if (!this.destroyed && generation === this.generation()) this.downloading.set(false);
    }
  }
}

SdTabComponent({ component: ImportExcelDemoComponent, name: 'Import Excel', icon: 'table_view' })(ImportExcelDemoComponent);
