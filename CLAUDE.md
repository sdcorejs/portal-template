# Portal Template — Quy ước viết màn demo (sample)

Tài liệu này quy định **cách viết các màn demo/sample** trong repo `portal-template`. Mục tiêu: mọi màn demo (`src/libs/forms/*`, `src/libs/components/*`, `src/libs/patterns/*`, …) đều có **cùng cấu trúc, cùng layout, cùng quy ước đặt tên**, để AI gen code không lệch giữa các lần.

**Màn chuẩn (canonical reference):** [`src/libs/forms/input/`](src/libs/forms/input/) — gồm `*.component.ts` + `*.component.html` + `*.component.scss`. Khi tạo màn demo mới, **đọc và bám sát màn này** về kiến trúc, đặt tên, layout, signal-flow.

---

## 1. Stack & nguyên tắc chung

- **Angular 19, standalone components, signals-first.** Dùng `signal()` / `computed()` cho mọi state demo. Không dùng `@Input()` decorator — dùng `input()` / `model()` / `output()` khi cần.
- **`ChangeDetectionStrategy.OnPush`** bắt buộc.
- **Native control flow** trong template: `@if` / `@for (… track …)` / `@let`. Không dùng `*ngIf` / `*ngFor`.
- **Comment WHY** bằng tiếng Việt khi logic không hiển nhiên. Không comment WHAT.
- **Không hardcode chuỗi i18n** trong sample (sample là tài liệu hiển thị tiếng Việt — cứ để literal trong template/signal).

---

## 2. Cấu trúc thư mục cho một màn demo

Mỗi màn demo là một thư mục con với 3 file:

```
src/libs/<group>/<demo-name>/
  ├─ <demo-name>.component.ts
  ├─ <demo-name>.component.html
  └─ <demo-name>.component.scss
```

- `<group>` ví dụ: `forms`, `components`, `patterns`, `services`, …
- `<demo-name>` đặt theo **tên component đang demo** (kebab-case). Ví dụ component `SdSelect` → thư mục `select/`.
- Class component: `<PascalName>DemoComponent`. Selector: `app-<demo-name>-demo`.
- Đăng ký route trong `routes.ts` của group: `loadComponent: () => import('./<demo-name>/<demo-name>.component').then(m => m.<PascalName>DemoComponent)`.

---

## 3. Cấu trúc class `*.component.ts`

Bám theo thứ tự sau (đọc [`forms/input/input.component.ts`](src/libs/forms/input/input.component.ts) làm mẫu):

1. **Imports** — gom theo nhóm: `@angular/*`, third-party, `@sd-angular/core/*`, local. Mỗi component `SdXxx` import từ secondary entry point riêng (`@sd-angular/core/forms/<name>` hoặc `@sd-angular/core/components/<name>`).
2. **Interface mock data** (nếu cần) — khai báo ngay trên class, không tách file.
3. **Decorator `@Component`** — `standalone: true`, `imports: [...]`, `templateUrl`, `styleUrls`, `changeDetection: OnPush`.
4. **Class body — theo block, comment phân tách:**
   - `// Mock Data` — array dữ liệu giả (nếu có).
   - `// Tokens` — toàn bộ `signal<…>(initialValue)` đại diện cho từng prop của component đang demo + state phụ trợ (mode, preview helper).
   - Danh sách option cho `sd-select` config (`<x>Options: { id, name }[]`).
   - `computed()` cho mọi giá trị dẫn xuất (description động, placeholder động, preview label …).
   - **`htmlCode = computed(() => …)`** — sinh đoạn HTML preview dựa trên các signal hiện tại. Chỉ đẩy prop **khi giá trị khác mặc định / khi user bật**. Format `[prop]="'value'"` cho string, `[prop]="true"` cho boolean.
   - **`tsCode = \`…\``** — đoạn TS mẫu **tĩnh** copy-paste ra ngoài, kèm import + class skeleton.
   - Private helper (nếu cần) ở cuối: `getXxxTemplateCode()`, `formatXxx()`, …

**Nguyên tắc đặt tên signal:** trùng tên với prop component đang demo (`label`, `placeholder`, `size`, `disabled`, `viewed`, …). Signal mô tả **state của control đang demo**, một biến `modelValue` để demo two-way `[(model)]`.

---

## 4. Layout template `*.component.html` (3 vùng cố định)

Mọi màn demo dùng đúng skeleton này:

```html
<sd-page [title]="'<Tên component>'" [description]="pageDescription()">
  <div headerRight>
    <!-- action button nếu có, để trống nếu không -->
  </div>

  <div class="demo-page-body">
    <div class="row row-sm mx-0">
      <!-- CỘT TRÁI: CONFIGURATION (4/12) -->
      <div class="col-md-4">
        <sd-section title="Thuộc tính" icon="settings">
          <div class="demo-config-panel">
            <!-- repeat: .config-item cho từng prop -->
          </div>
        </sd-section>
      </div>

      <!-- CỘT PHẢI: PREVIEW + CODE (8/12) -->
      <div class="col-md-8">
        <div class="d-flex flex-column gap-16">
          <sd-section title="Xem trước" icon="visibility">
            <!-- vùng preview component thật -->
          </sd-section>
          <sd-section title="Mã nguồn" icon="code">
            <h4 class="font-size-14 mb-8">HTML</h4>
            <sd-code-editor [model]="htmlCode()" language="html" maxHeight="300px" [viewed]="true"></sd-code-editor>
            <h4 class="font-size-14 mb-8 mt-16">Typescript</h4>
            <sd-code-editor [model]="tsCode" language="typescript" maxHeight="300px" [viewed]="true"></sd-code-editor>
          </sd-section>
        </div>
      </div>
    </div>
  </div>
</sd-page>
```

**Quy ước từng vùng:**

- **Cột trái — Configuration:** mỗi prop là một `.config-item` chứa `.config-item__label` (`__title` = tên prop monospace + `__desc` = mô tả ngắn 1 dòng) và **một control nhập** ở phải. Control nhập chọn theo kiểu prop:
  - `string` → `sd-input`
  - `number` → `sd-input-number`
  - `boolean` → `sd-switch` `size="sm"`
  - `enum` / `union literal` → `sd-select` với `[items]` là `<x>Options`, `valueField="id"`, `displayField="name"`
  - `Date` / range → `sd-date` / `sd-date-range` tương ứng
- **Cột phải — Preview:** chỉ một instance của component đang demo, **bind toàn bộ signal**. Wrap trong khung `.p-24.bg-slate-100.rounded-8.border.border-dashed.border-slate-300.d-flex.align-items-center.justify-content-center`. Có thể thêm 1-2 dòng `font-size-13` ở dưới để hiển thị `Giá trị hiện tại:` hoặc trạng thái.
- **Cột phải — Code:** dùng `sd-code-editor` với `[viewed]="true"`, `maxHeight="300px"`, hai khối HTML + TS.
- **Conditional config (`@if`)** dùng khi một prop chỉ áp dụng ở mode nhất định (xem suffix trong màn input).

---

## 5. SCSS `*.component.scss` — khung cố định

Bám theo [`forms/input/input.component.scss`](src/libs/forms/input/input.component.scss). Các class **giữ nguyên** giữa các màn:

- `:host { display: block; height: 100%; }` + `.demo-page-body { padding: 8px 4px; background-color: #f1f5f9; min-height: 100%; }`
- `.config-item` — flex row, `gap: 12px`, padding `10px 12px`, border `1px solid #e2e8f0`, radius `8px`. Control nhập ở phải có `width: 180px; flex-shrink: 0`.
- `.config-item__title` — `12px / 600 / #1e293b / monospace`.
- `.config-item__desc` — `11px / #64748b / line-height 1.4`.
- Responsive `@media (max-width: 767.98px)`: `.config-item` chuyển `flex-direction: column`, control nhập `width: 100%`.

**Style đặc thù màn nào để màn đó.** Không viết style đặc thù vào global. Nếu cần preview phụ (grid, card phụ trợ) thì đặt class riêng theo BEM trong file scss của màn.

---

## 6. Sinh `htmlCode` — quy tắc

- Mỗi prop chỉ push vào `props` array **khi đáng hiển thị** (khác default, hoặc user bật).
- Format: `[prop]="'string'"` / `[prop]="true"` / `[prop]="123"`.
- `[(model)]` luôn xuất hiện đầu tiên, giá trị giả định tên biến `value`.
- Nếu có `ng-template` con (suffix, item-def, header-def, …) → tách thành helper `getXxxTemplateCode()` trả `string | undefined`, ghép vào output khi có nội dung.
- Output cuối:
  ```ts
  return inner
    ? `<sd-xxx\n  [(model)]="value"\n  ${props.join('\n  ')}\n>\n  ${inner}\n</sd-xxx>`
    : `<sd-xxx\n  [(model)]="value"\n  ${props.join('\n  ')}\n></sd-xxx>`;
  ```

---

## 7. Đăng ký route

Sửa `routes.ts` của group tương ứng (ví dụ [`src/libs/forms/routes.ts`](src/libs/forms/routes.ts)). Một dòng `loadComponent`, không tạo route con phức tạp.

---

## 8. Checklist trước khi báo done

- [ ] Thư mục `<group>/<demo-name>/` đủ 3 file.
- [ ] Class theo block thứ tự: Mock Data → Tokens → Options → computed → htmlCode → tsCode → helpers.
- [ ] Template đủ 3 vùng: Configuration (col-4) / Preview (col-8 top) / Code (col-8 bottom).
- [ ] Mỗi prop của component đều có 1 `.config-item` với control nhập đúng kiểu dữ liệu.
- [ ] SCSS dùng đúng class `demo-page-body` / `config-item` / `config-item__*` chuẩn.
- [ ] `OnPush` + signals + native control flow.
- [ ] `htmlCode` chỉ in prop khi đáng in; `tsCode` có đủ import + class skeleton.
- [ ] Route đã đăng ký trong `routes.ts`.
- [ ] Build sạch: `npm run build`.
