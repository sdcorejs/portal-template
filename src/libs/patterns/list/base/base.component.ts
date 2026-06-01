import { Component, computed, signal, viewChild, viewChildren } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { DemoButtonComponent } from '../../shared/demo-button/demo-button.component';
import { DemoTableComponent } from '../../shared/demo-table/demo-table.component';

function toMethodName(title: string): string {
  return title.trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

@Component({
  selector: 'app-pattern-list-base',
  standalone: true,
  imports: [SdPageComponent, DemoTableComponent, DemoButtonComponent,
            SdButton, SdSideDrawer, SdCodeEditor, SdInput],
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class ListBaseComponent {
  settingsDrawer   = viewChild.required<SdSideDrawer>('settingsDrawer');
  tableComponent   = viewChild.required<DemoTableComponent>('demoTable');
  buttonComponents = viewChildren<DemoButtonComponent>('demoBtn');

  activeTab        = signal<'properties' | 'source'>('properties');
  activeSourceFile = signal<'model' | 'service' | 'ts' | 'html' | 'scss'>('model');

  // ── Applied state (drives live UI) ───────────────────────
  appliedTitle = signal('Danh sách — Cơ bản');
  appliedDescription = signal(
    'Pattern chuẩn cho màn danh sách: sd-table kiểu server, phân trang, tạo mới, xóa hàng loạt.'
  );
  appliedButtonIds = signal<string[]>(['btn-1']);

  // ── Draft state (only valid while drawer is open) ────────
  draftTitle       = '';
  draftDescription = '';
  draftButtonIds   = signal<string[]>([]);
  private nextBtnSeq = 2;

  // ── Generated source code ─────────────────────────────────
  generatedModel = computed(() => [
    `export interface Item {`,
    `  id: number;`,
    `  code: string;`,
    `  name: string;`,
    `  amount: number;`,
    `  status: boolean;`,
    `  createdDate: string;`,
    `}`,
  ].join('\n'));

  generatedService = computed(() => [
    `import { Injectable } from '@angular/core';`,
    `import type { Item } from './item.model';`,
    ``,
    `@Injectable({ providedIn: 'root' })`,
    `export class ItemService {`,
    `  // eslint-disable-next-line @typescript-eslint/no-explicit-any`,
    `  async paging(req: any): Promise<any> {`,
    `    // TODO: call API`,
    `    throw new Error('Not implemented');`,
    `  }`,
    `}`,
  ].join('\n'));

  generatedTs = computed(() => {
    const buttons   = this.buttonComponents();
    const tableCode = this.tableComponent().generatedCode();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tableCfg  = this.tableComponent().appliedConfig() as any;

    const needsBtn = buttons.length > 0;

    const cmdMethods = ((tableCfg.commands ?? []) as any[])
      .map((cmd: any) => {
        const name = toMethodName(cmd.title) || 'Command';
        return `  on${name}(row: Item): void {\n    // TODO: implement\n  }`;
      }).join('\n\n');

    const actMethods = ((tableCfg.actions ?? []) as any[])
      .map((act: any) => {
        const name = toMethodName(act.title) || 'Action';
        return `  on${name}(rows: Item[]): void {\n    // TODO: implement\n  }`;
      }).join('\n\n');

    const btnMethods = buttons
      .map((btn, i) => {
        const name = toMethodName(btn.appliedConfig().title) || `Button${i + 1}`;
        return `  on${name}(): void {\n    // TODO: implement\n  }`;
      }).join('\n\n');

    const methods = [cmdMethods, actMethods, btnMethods].filter(m => m.trim()).join('\n\n');

    return [
      `import { Component, inject } from '@angular/core';`,
      `import { SdPageComponent } from '@sdcorejs/angular/modules/layout';`,
      needsBtn ? `import { SdButton } from '@sdcorejs/angular/components/button';` : null,
      `import { SdTable } from '@sdcorejs/angular/components/table';`,
      `import type { SdTableOption } from '@sdcorejs/angular/components/table';`,
      `import type { Item } from '../../services/item.model';`,
      `import { ItemService } from '../../services/item.service';`,
      ``,
      `@Component({`,
      `  selector: 'app-list',`,
      `  standalone: true,`,
      `  imports: [SdPageComponent${needsBtn ? ', SdButton' : ''}, SdTable],`,
      `  templateUrl: './list.component.html',`,
      `  styleUrls: ['./list.component.scss'],`,
      `})`,
      `export class ListComponent {`,
      `  private itemService = inject(ItemService);`,
      ``,
      `  ${tableCode.split('\n').join('\n  ')}`,
      methods ? `\n${methods}` : '',
      `}`,
    ].filter((l): l is string => l !== null).join('\n');
  });

  generatedHtml = computed(() => {
    const title       = this.appliedTitle();
    const description = this.appliedDescription();
    const buttons     = this.buttonComponents();

    const btnLines = buttons.map((btn, i) => {
      const cfg = btn.appliedConfig();
      const parts: string[] = [];
      parts.push(`    <sd-button`);
      if (cfg.title)      parts.push(`      title="${cfg.title}"`);
      parts.push(`      type="${cfg.type}"`);
      parts.push(`      color="${cfg.color}"`);
      parts.push(`      size="${cfg.size}"`);
      if (cfg.prefixIcon) parts.push(`      prefixIcon="${cfg.prefixIcon}"`);
      if (cfg.suffixIcon) parts.push(`      suffixIcon="${cfg.suffixIcon}"`);
      if (cfg.disabled)   parts.push(`      [disabled]="true"`);
      if (cfg.block)      parts.push(`      [block]="true"`);
      const name = toMethodName(cfg.title) || `Button${i + 1}`;
      parts.push(`      (click)="on${name}()">`);
      parts.push(`    </sd-button>`);
      return parts.join('\n');
    }).join('\n');

    const headerRight = buttons.length > 0
      ? `\n  <div headerRight>\n${btnLines}\n  </div>`
      : '';

    return [
      `<sd-page`,
      `  title="${title}"`,
      `  description="${description}">${headerRight}`,
      `  <div class="content">`,
      `    <sd-table [option]="tableOption"></sd-table>`,
      `  </div>`,
      `</sd-page>`,
    ].join('\n');
  });

  generatedScss = computed(() => [
    `:host {`,
    `  display: block;`,
    `  height: 100%;`,
    `}`,
    ``,
    `.content {`,
    `  height: 100%;`,
    `  padding: 8px;`,
    `}`,
  ].join('\n'));

  // ── Drawer lifecycle ──────────────────────────────────────
  openSettings(): void {
    this.draftTitle = this.appliedTitle();
    this.draftDescription = this.appliedDescription();
    this.draftButtonIds.set([...this.appliedButtonIds()]);
    this.activeTab.set('properties');
    this.settingsDrawer().open();
  }

  applyConfig(): void {
    this.appliedTitle.set(this.draftTitle);
    this.appliedDescription.set(this.draftDescription);
    this.appliedButtonIds.set([...this.draftButtonIds()]);
    this.settingsDrawer().close();
  }

  cancelConfig(): void {
    this.settingsDrawer().close();
  }

  addButton(): void {
    const id = `btn-${this.nextBtnSeq++}`;
    this.draftButtonIds.update(ids => [...ids, id]);
  }

  removeButton(id: string): void {
    this.draftButtonIds.update(ids => ids.filter(b => b !== id));
  }
}
