import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import {
  SdSplitterComponent,
  SdSplitterPanelComponent,
  SplitterLayoutState,
} from '@sdcorejs/angular/components/splitter';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-splitter-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdButton,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdSplitterComponent,
    SdSplitterPanelComponent,
  ],
  templateUrl: './splitter.component.html',
  styleUrls: ['./splitter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitterDemoComponent {
  // Demo 5: imperative API + collapse
  apiSplitter = viewChild<SdSplitterComponent>('apiSplitter');

  // Demo 6: storage + layoutChange observer
  storageLayout = signal<SplitterLayoutState | null>(null);

  pageDescription = signal(
    '<sd-splitter> bố cục panel co dãn — horizontal/vertical, mix px + flex, nested, collapsible, lưu layout vào localStorage. Kéo divider để resize. Double-click handle (panel collapsible) để toggle. Tab vào handle rồi dùng arrow / Home / End / Enter / Space.'
  );

  // ── Imperative API ─────────────────────────────────────────────────────────
  toggleSidebar(): void {
    this.apiSplitter()?.toggle('sidebar');
  }

  resizeSidebar(px: number): void {
    this.apiSplitter()?.resizePanel('sidebar', px);
  }

  expandAll(): void {
    this.apiSplitter()?.expand('sidebar');
    this.apiSplitter()?.expand('detail');
  }

  resetLayout(): void {
    this.apiSplitter()?.resetLayout();
  }

  onStorageLayoutChange(state: SplitterLayoutState): void {
    this.storageLayout.set(state);
  }

  clearStorage(): void {
    localStorage.removeItem('portal-template-splitter-demo');
    location.reload();
  }

  // ── Source snippets ────────────────────────────────────────────────────────
  basicCode = `<sd-splitter orientation="horizontal">
  <sd-splitter-panel size="1">
    <div class="left">Left (flex 1)</div>
  </sd-splitter-panel>

  <sd-splitter-panel size="1">
    <div class="right">Right (flex 1)</div>
  </sd-splitter-panel>
</sd-splitter>`;

  mixCode = `<sd-splitter orientation="horizontal">
  <!-- px cố định, có min/max -->
  <sd-splitter-panel panelId="sidebar" size="250" unit="px" minSize="100" maxSize="400">
    <div>Sidebar 250px (100–400)</div>
  </sd-splitter-panel>

  <!-- flex còn lại -->
  <sd-splitter-panel size="1">
    <div>Main (flex)</div>
  </sd-splitter-panel>
</sd-splitter>`;

  nestedCode = `<sd-splitter orientation="horizontal">
  <sd-splitter-panel panelId="ide-sidebar" size="200" unit="px" minSize="100" collapsible>
    <div>File Explorer</div>
  </sd-splitter-panel>

  <sd-splitter-panel size="1">
    <!-- Nested vertical splitter -->
    <sd-splitter orientation="vertical">
      <sd-splitter-panel size="2"><div>Editor</div></sd-splitter-panel>
      <sd-splitter-panel panelId="ide-output" size="1" minSize="0.2" collapsible>
        <div>Output / Terminal</div>
      </sd-splitter-panel>
    </sd-splitter>
  </sd-splitter-panel>
</sd-splitter>`;

  apiCode = `<sd-splitter #apiSplitter orientation="horizontal" [snapThreshold]="0.4">
  <sd-splitter-panel panelId="sidebar" size="220" unit="px" minSize="80" maxSize="500" collapsible>
    <div>Sidebar (collapsible)</div>
  </sd-splitter-panel>

  <sd-splitter-panel size="2"><div>Content</div></sd-splitter-panel>

  <sd-splitter-panel panelId="detail" size="1" minSize="0.3" collapsible>
    <div>Detail</div>
  </sd-splitter-panel>
</sd-splitter>

// component.ts
apiSplitter = viewChild<SdSplitterComponent>('apiSplitter');

toggleSidebar() { this.apiSplitter()?.toggle('sidebar'); }
resizeSidebar(px: number) { this.apiSplitter()?.resizePanel('sidebar', px); }
expandAll() {
  this.apiSplitter()?.expand('sidebar');
  this.apiSplitter()?.expand('detail');
}
resetLayout() { this.apiSplitter()?.resetLayout(); }`;

  storageCode = `<sd-splitter
  orientation="horizontal"
  storageKey="portal-template-splitter-demo"
  (layoutChange)="onLayout($event)">

  <sd-splitter-panel panelId="a" size="1"><div>A</div></sd-splitter-panel>
  <sd-splitter-panel panelId="b" size="2"><div>B</div></sd-splitter-panel>
  <sd-splitter-panel panelId="c" size="1"><div>C</div></sd-splitter-panel>
</sd-splitter>

// state lưu vào localStorage[storageKey] → refresh giữ nguyên layout`;
}
