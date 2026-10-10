import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SdBreadcrumb, type SdBreadcrumbItem } from '@sdcorejs/angular/components/breadcrumb';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdFormBuilder, SdFormRender, type SdFormGenericSchema } from '@sdcorejs/angular/components/form-generic';
import { SdInform } from '@sdcorejs/angular/components/inform';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { FORM_NAVIGATION_SAMPLE, formNavigationSeed } from './form-navigation.schema';

@Component({
  selector: 'app-form-navigation-demo',
  standalone: true,
  imports: [SdBreadcrumb, SdButton, SdCodeEditor, SdFormBuilder, SdFormRender, SdInform, SdSection, SdSelect, SdSwitch, SdPageComponent],
  templateUrl: './form-navigation.component.html',
  styleUrl: './form-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormNavigationDemoComponent {
  readonly trail: SdBreadcrumbItem[] = [{ label: 'Workspace', url: '/utility/workspace/designer' }, { label: 'Form tabs & steps' }];
  readonly render = viewChild<SdFormRender>('liveRender');
  readonly form = new FormGroup({});
  readonly draft = signal<SdFormGenericSchema | undefined>(formNavigationSeed());
  readonly applied = signal<SdFormGenericSchema>(formNavigationSeed());
  readonly value = signal<Record<string, unknown>>({ needsLegal: false });
  readonly activePageId = signal<string | null>('details');
  readonly panel = signal<'render' | 'builder'>('render');
  readonly viewed = signal(false);
  readonly busy = signal(false);
  readonly failNextSubmit = signal(false);
  readonly errors = signal<string[]>([]);
  readonly warnings = signal<string[]>([]);
  readonly submitted = signal<{ schema: SdFormGenericSchema; value: Record<string, unknown> } | null>(null);
  readonly status = signal(
    'Điền Thông tin trước khi chuyển bước. Kiểm tra toàn bộ sẽ kiểm tra cả trang chưa mở; trang Pháp lý chỉ xuất hiện khi được chọn.'
  );
  readonly changed = computed(() => JSON.stringify(this.draft()) !== JSON.stringify(this.applied()));
  readonly draftMode = computed(() => this.draft()?.navigation?.type ?? 'legacy');
  readonly appliedMode = computed(() => this.applied().navigation?.type ?? 'legacy');
  readonly navigationOptions = [
    { id: 'steps', name: 'Steps' },
    { id: 'tabs', name: 'Tabs' },
    { id: 'legacy', name: 'Một trang (legacy)' },
  ];
  readonly linear = computed(() => {
    const navigation = this.draft()?.navigation;
    return navigation?.type === 'steps' && navigation.linear === true;
  });
  readonly schemaJson = computed(() => JSON.stringify(this.applied(), null, 2));
  readonly valueJson = computed(() => JSON.stringify(this.value(), null, 2));
  readonly submittedJson = computed(() => JSON.stringify(this.submitted(), null, 2));
  readonly htmlCode = `<sd-form-builder [(schema)]="draft" />
<!-- Áp dụng: applied = structuredClone(draft) -->
<sd-form-render [schema]="applied" [(value)]="value"
  [(activePageId)]="activePageId" [form]="form" />`;
  readonly tsCode = `import { signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import type { SdFormGenericSchema } from '@sdcorejs/angular/components/form-generic';
const schema: SdFormGenericSchema = {
  navigation: { type: 'steps', linear: true }, // hoặc { type: 'tabs' }
  pages: [{ id: 'details', label: 'Thông tin', elements: [] },
          { id: 'review', label: 'Xác nhận', elements: [] }],
};
const activePageId = signal<string | null>('details');
const form = new FormGroup({});
// await render.validate() kiểm tra mọi trang đang visible.
// Consumer quyết định khi nào lưu schema, upload hoặc gửi dữ liệu.`;

  selectNavigation(value: unknown): void {
    const mode = value === 'tabs' ? 'tabs' : value === 'legacy' ? 'legacy' : 'steps';
    this.draft.update(current => {
      const base = { ...(current ?? formNavigationSeed()) };
      delete base.navigation;
      return mode === 'legacy' ? base : { ...base, navigation: mode === 'tabs' ? { type: 'tabs' } : { type: 'steps', linear: true } };
    });
    this.status.set('Đã đổi điều hướng bản nháp. Bấm Áp dụng schema để Render nhận đúng bản này.');
  }
  setLinear(value: boolean): void {
    this.draft.update(schema =>
      schema?.navigation?.type === 'steps' ? { ...schema, navigation: { type: 'steps', linear: value } } : schema
    );
  }
  applySchema(): void {
    const schema = this.draft();
    if (!schema?.pages.length) {
      this.errors.set(['Schema cần ít nhất một trang.']);
      return;
    }
    this.applied.set(structuredClone(schema));
    this.activePageId.set(schema.pages[0].id);
    this.errors.set([]);
    this.warnings.set([]);
    this.submitted.set(null);
    this.panel.set('render');
    this.status.set('Render đang dùng bản chụp đúng schema vừa áp dụng. Dữ liệu nhập được giữ trong phiên demo.');
  }
  fillSample(): void {
    this.value.set(structuredClone(FORM_NAVIGATION_SAMPLE));
    this.errors.set([]);
    this.status.set('Đã điền mẫu cho mọi trang; dữ liệu Pháp lý được giữ dù trang đang ẩn.');
  }
  jumpToReview(): void {
    this.activePageId.set('review');
  }
  async validate(): Promise<boolean> {
    const result = await this.render()?.validate();
    // Field errors are rendered by Core; messages.error contains schema-level errors.
    const errors = result?.messages.error ?? ['Renderer chưa sẵn sàng.'];
    this.errors.set(
      result && !result.valid && !errors.length ? ['Có trường chưa hợp lệ. Mở trang được chọn và sửa các trường đã đánh dấu.'] : errors
    );
    this.warnings.set(result?.messages.warning ?? []);
    this.status.set(
      result?.valid
        ? 'Mọi trang visible hợp lệ. Cảnh báo không chặn gửi demo.'
        : 'Có lỗi trên trang visible. Mở các trang để sửa trường được đánh dấu.'
    );
    return result?.valid ?? false;
  }
  async submit(): Promise<void> {
    if (this.busy() || this.viewed()) return;
    this.busy.set(true);
    try {
      if (!(await this.validate())) return;
      // Chụp schema/value cùng lúc để chỉnh sửa sau đó không đổi bản gửi.
      const snapshot = { schema: structuredClone(this.applied()), value: structuredClone(this.value()) };
      await new Promise(resolve => setTimeout(resolve, 350));
      if (this.failNextSubmit()) {
        this.failNextSubmit.set(false);
        this.errors.set(['Giả lập lỗi gửi. Dữ liệu và schema được giữ; bấm Gửi demo để thử lại.']);
        return;
      }
      this.submitted.set(snapshot);
      this.status.set('Đã lưu bản gửi trong phiên demo; không có HTTP hoặc backend.');
    } finally {
      this.busy.set(false);
    }
  }
  exportSchema(): void {
    const url = URL.createObjectURL(new Blob([this.schemaJson()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form-navigation.schema.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  reset(): void {
    this.draft.set(formNavigationSeed());
    this.applied.set(formNavigationSeed());
    this.value.set({ needsLegal: false });
    this.activePageId.set('details');
    this.form.reset();
    this.panel.set('render');
    this.viewed.set(false);
    this.failNextSubmit.set(false);
    this.errors.set([]);
    this.warnings.set([]);
    this.submitted.set(null);
    this.status.set('Đã khôi phục schema Steps linear và dữ liệu trống.');
  }
}
SdTabComponent({ component: FormNavigationDemoComponent, name: 'Form Tabs & Steps', icon: 'dynamic_form' })(FormNavigationDemoComponent);
