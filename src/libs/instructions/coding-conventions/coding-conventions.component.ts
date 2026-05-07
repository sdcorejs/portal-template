import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-coding-conventions',
  standalone: true,
  imports: [CommonModule, SdPageComponent, SdSection, SdCodeEditor],
  template: `
    <sd-page [title]="'Coding Conventions (Dev)'" [description]="pageDescription">
      <div class="demo-page-body">
        <div class="d-flex flex-column gap-16">
          <sd-section title="Mục tiêu" icon="rule">
            <div class="guide-note">
              Module này dành riêng cho dev, dùng để thống nhất cách viết CSS/SCSS trong dự án. Mục tiêu chính là:
              giảm xung đột global style, tăng khả năng tái sử dụng, và dễ maintain khi codebase lớn dần.
            </div>
          </sd-section>

          <sd-section title="1) Khai báo CSS cho component" icon="css">
            <div class="rule-grid">
              <div class="rule-col">
                <div class="rule-col__title rule-col__title--dont">Don't</div>
                <sd-code-editor [model]="cssNamingDont" language="scss" [viewed]="true" maxHeight="260px"></sd-code-editor>
              </div>
              <div class="rule-col">
                <div class="rule-col__title rule-col__title--do">Do</div>
                <sd-code-editor [model]="cssNamingDo" language="scss" [viewed]="true" maxHeight="260px"></sd-code-editor>
              </div>
            </div>

            <div class="rule-explain mt-12">
              <div><strong>Diễn giải:</strong> Không dùng id và không đặt tên class quá chung chung ở cấp global.</div>
              <div>Hãy đặt prefix <strong>.c-</strong> cho root class của component để nhìn vào là biết style thuộc component nào.</div>
              <div>Những class phổ biến như <strong>.action</strong>, <strong>.title</strong> vẫn được phép dùng ở bên trong root class đã có prefix.</div>
            </div>
          </sd-section>

          <sd-section title="2) CSS được sử dụng nhiều lần" icon="recycling">
            <div class="rule-grid">
              <div class="rule-col">
                <div class="rule-col__title rule-col__title--dont">Don't</div>
                <sd-code-editor [model]="reusableDont" language="scss" [viewed]="true" maxHeight="180px"></sd-code-editor>
              </div>
              <div class="rule-col">
                <div class="rule-col__title rule-col__title--do">Do</div>
                <sd-code-editor [model]="reusableDo" language="html" [viewed]="true" maxHeight="180px"></sd-code-editor>
              </div>
            </div>

            <div class="rule-explain mt-12">
              <div><strong>Diễn giải:</strong> Nếu một phần giao diện lặp lại ở nhiều nơi, không copy/paste CSS vào từng component.</div>
              <div>Hãy tách thành component dùng chung trong shared của module (header, footer, toolbar...) để giảm duplicate code.</div>
              <div>Cách này giúp sửa 1 nơi, ảnh hưởng đồng bộ tất cả màn hình đang dùng chung component đó.</div>
            </div>
          </sd-section>

          <sd-section title="3) Override CSS của component con" icon="layers_clear">
            <div class="rule-grid">
              <div class="rule-col">
                <div class="rule-col__title rule-col__title--dont">Don't</div>
                <sd-code-editor [model]="overrideDont" language="scss" [viewed]="true" maxHeight="220px"></sd-code-editor>
              </div>
              <div class="rule-col">
                <div class="rule-col__title rule-col__title--do">Do</div>
                <sd-code-editor [model]="overrideDo" language="scss" [viewed]="true" maxHeight="220px"></sd-code-editor>
              </div>
            </div>

            <div class="rule-explain mt-12">
              <div><strong>Diễn giải:</strong> Không override style component con bằng SCSS global vì dễ leak style sang nơi khác.</div>
              <div>Khi cần override sâu, ưu tiên phạm vi host với <strong>:host ::ng-deep</strong> để giới hạn ảnh hưởng trong component hiện tại.</div>
              <div>Rule này đặc biệt quan trọng với màn hình phức tạp có nested component và style từ thư viện core.</div>
            </div>
          </sd-section>
        </div>
      </div>
    </sd-page>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;

        .demo-page-body {
          padding: 8px 4px;
          background-color: #f1f5f9;
          min-height: 100%;
        }
      }

      .guide-note {
        padding: 12px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #ffffff;
        color: #334155;
        font-size: 13px;
        line-height: 1.6;
      }

      .rule-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .rule-col__title {
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .rule-col__title--dont {
        color: #b91c1c;
      }

      .rule-col__title--do {
        color: #166534;
      }

      .rule-explain {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 12px;
        border: 1px dashed #cbd5e1;
        border-radius: 8px;
        background: #f8fafc;
        font-size: 12px;
        color: #334155;
        line-height: 1.55;
      }

      @media (max-width: 991.98px) {
        .rule-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodingConventionsComponent {
  pageDescription =
    'Tài liệu quy ước coding cho dev: naming CSS/SCSS, tái sử dụng giao diện, và nguyên tắc override style component con.';

  cssNamingDont = `/* Không nên sử dụng id */
#header {
}

/* Tên class thông dụng khó phân biệt global hay của component */
.home {
}

/* Tên class thông dụng khó phân biệt global hay của component */
.title {
  .action {
  }
}`;

  cssNamingDo = `/* Prefix .c */
.c-home {
}

/* Prefix .c */
.c-title {
  /* Cho phép sử dụng tên class thông dụng khi đã được wrap trong class component */
  .action {
  }
}`;

  reusableDont = `/* Copy/Paste vào CSS của các component để sử dụng */
.c-header {
}

.c-footer {
}`;

  reusableDo = `/* Tách thành component dùng chung theo module */
<product-header></product-header>
<ops-header></ops-header>
<pos-header></pos-header>`;

  overrideDont = `/* Khai báo SCSS toàn cục (Global) */
.<component-name> {
  .c-header {
  }

  .c-title {
  }
}`;

  overrideDo = `:host ::ng-deep {
  .c-header {
  }

  .c-title {
  }
}`;
}
