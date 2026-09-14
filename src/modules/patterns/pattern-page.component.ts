import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Type, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdButton } from '@sdcorejs/angular/components/button';
import { PATTERN_GROUPS } from './catalog/pattern-catalog';
import { PatternDraft } from './data/pattern-draft';
const LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  headers: () => import('./features/headers/headers.component').then(m => m.HeadersComponent),
  tables: () => import('./features/tables/tables.component').then(m => m.TablesComponent),
  scores: () => import('./features/scores/scores.component').then(m => m.ScoresComponent),
  buttons: () => import('./features/buttons/buttons.component').then(m => m.ButtonsComponent),
  forms: () => import('./features/forms/forms.component').then(m => m.FormsComponent),
  drawers: () => import('./features/drawers/drawers.component').then(m => m.DrawersComponent),
  compositions: () => import('./features/compositions/compositions.component').then(m => m.CompositionsComponent),
};
interface SourceFile {
  path: string;
  content: string;
}
@Component({
  selector: 'app-pattern-page',
  imports: [NgComponentOutlet, RouterLink, RouterLinkActive, SdPageComponent, SdButton],
  providers: [PatternDraft],
  templateUrl: './pattern-page.component.html',
  styleUrl: './styles/patterns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternPageComponent {
  readonly draft = inject(PatternDraft);
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly groupId = computed(() => this.data()['group'] as string);
  readonly group = computed(() => PATTERN_GROUPS[this.groupId()]);
  readonly variant = computed(() => this.group().variants.find(v => v[0] === this.params().get('variant')) ?? this.group().variants[0]);
  readonly demo = signal<Type<unknown> | null>(null);
  readonly tab = signal('preview');
  readonly error = signal('');
  readonly source = signal<SourceFile[]>([]);
  readonly sourceState = signal('idle');
  readonly copied = signal('');
  readonly groups = Object.entries(PATTERN_GROUPS);
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
      this.tab.set('preview');
      void LOADERS[group]()
        .then(component => {
          if (request === this.generation) this.demo.set(component);
        })
        .catch(() => this.error.set('Không tải được mẫu. Vui lòng tải lại trang.'));
    });
  }
  async showSource(): Promise<void> {
    this.tab.set('source');
    if (this.sourceState() === 'ready') return;
    const request = ++this.sourceGeneration;
    const group = this.groupId();
    this.sourceState.set('loading');
    try {
      const response = await fetch('patterns-source.json', { signal: this.abort.signal });
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
  async copy(file: SourceFile): Promise<void> {
    try {
      await navigator.clipboard.writeText(file.content);
      this.copied.set('Đã sao chép ' + file.path);
    } catch {
      this.copied.set('Không truy cập được clipboard; chọn và sao chép trong khối source.');
    }
  }
}
