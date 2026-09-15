import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Type, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdTab, SdTabGroup } from '@sdcorejs/angular/components/tab';
import { SdCodeEditor, CodeLanguage } from '@sdcorejs/angular/components/code-editor';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { PATTERN_GROUPS, PATTERN_PATHS } from './catalog/pattern-catalog';
import { PatternDraft } from './data/pattern-draft';
const LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  'tab-group': () => import('./features/tab-group/tab-group.component').then(m => m.TabGroupComponent),
  stepper: () => import('./features/stepper/stepper.component').then(m => m.StepperComponent),
  header: () => import('./features/header/header.component').then(m => m.HeaderComponent),
  table: () => import('./features/table/table.component').then(m => m.TableComponent),
  score: () => import('./features/score/score.component').then(m => m.ScoreComponent),
  button: () => import('./features/button/button.component').then(m => m.ButtonComponent),
  form: () => import('./features/form/form.component').then(m => m.FormComponent),
  drawer: () => import('./features/drawer/drawer.component').then(m => m.DrawerComponent),
  composition: () => import('./features/composition/composition.component').then(m => m.CompositionComponent),
};
interface SourceFile {
  path: string;
  content: string;
}
@Component({
  selector: 'app-pattern-page',
  imports: [NgComponentOutlet, RouterLink, RouterLinkActive, SdPageComponent, SdButton, SdTab, SdTabGroup, SdCodeEditor],
  providers: [PatternDraft, { provide: MAT_TABS_CONFIG, useValue: { preserveContent: true } }],
  templateUrl: './pattern-page.component.html',
  styleUrl: './styles/pattern.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternPageComponent {
  readonly draft = inject(PatternDraft);
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly groupId = computed(() => this.data()['group'] as string);
  readonly groupPath = computed(() => PATTERN_PATHS[this.groupId()]);
  readonly group = computed(() => PATTERN_GROUPS[this.groupId()]);
  readonly variant = computed(() => this.group().variants.find(v => v[0] === this.params().get('variant')) ?? this.group().variants[0]);
  readonly demo = signal<Type<unknown> | null>(null);
  readonly tab = signal(0);
  readonly error = signal('');
  readonly source = signal<SourceFile[]>([]);
  readonly sourceState = signal('idle');
  readonly copied = signal('');
  readonly expandedSources = signal<Record<string, boolean>>({});
  private generation = 0;
  private sourceGeneration = 0;
  private readonly abort = new AbortController();
  constructor() {
    const destroy = inject(DestroyRef);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (this.draft.dirty() || this.draft.saving()) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    destroy.onDestroy(() => {
      this.generation++;
      this.sourceGeneration++;
      this.abort.abort();
      window.removeEventListener('beforeunload', beforeUnload);
    });
    effect(() => {
      const group = this.groupId();
      const request = ++this.generation;
      this.demo.set(null);
      this.error.set('');
      this.source.set([]);
      this.sourceState.set('idle');
      this.tab.set(0);
      void LOADERS[group]()
        .then(component => {
          if (request === this.generation) this.demo.set(component);
        })
        .catch(() => this.error.set('Không tải được mẫu. Vui lòng tải lại trang.'));
    });
  }
  async showSource(): Promise<void> {
    if (this.sourceState() === 'ready') return;
    const request = ++this.sourceGeneration;
    const group = this.groupId();
    this.sourceState.set('loading');
    try {
      const response = await fetch('pattern-source.json', { signal: this.abort.signal });
      if (!response.ok) throw new Error('source');
      const manifest = (await response.json()) as Record<string, SourceFile[]>;
      if (request !== this.sourceGeneration || group !== this.groupId()) return;
      if (!manifest[group]?.length) throw new Error('missing');
      this.source.set(manifest[group]);
      this.sourceState.set('ready');
    } catch {
      if (!this.abort.signal.aborted && request === this.sourceGeneration) this.sourceState.set('error');
    }
  }
  selectTab(index: number): void {
    this.tab.set(index);
    if (index === 2) void this.showSource();
  }
  toggleSource(path: string, expanded: boolean): void {
    this.expandedSources.update(value => ({ ...value, [path]: expanded }));
  }
  language(path: string): CodeLanguage {
    const extension = path.split('.').pop();
    return extension === 'ts'
      ? 'typescript'
      : extension === 'scss'
        ? 'scss'
        : extension === 'css'
          ? 'css'
          : extension === 'json'
            ? 'json'
            : 'html';
  }
  async copy(file: SourceFile): Promise<void> {
    try {
      await navigator.clipboard.writeText(file.content);
      this.copied.set('Đã sao chép ' + file.path);
    } catch {
      this.copied.set('Không truy cập được clipboard; chọn và sao chép trong khối source.');
    }
  }
}
