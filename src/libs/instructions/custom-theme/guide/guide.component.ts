import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-custom-theme-guide',
  standalone: true,
  imports: [SdCodeEditor, SdPageComponent, SdSection],
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomThemeGuideComponent {
  readonly step1Code = `// src/styles.scss
@use '@sdcorejs/angular/assets/scss/themes/default' as sd;

// Mixin merge map truyền vào với bộ mặc định rồi sinh toàn bộ --sd-* CSS variables.
// Chỉ cần khai báo những token muốn ghi đè.
html {
  @include sd.theme(
    (
      primary:       #2a66f4,
      primary-light: #eaf1ff,
      primary-dark:  #1c4ad9,

      error:         #f82c13,
      error-light:   #fed5d0,

      success:       #4caf50,
      success-light: #dbefdc,
    )
  );
}`;

  readonly step2Code = `// Dùng tab "Công cụ" để sinh tự động từ 3 màu gốc (primary, error, success).
// Kết quả gồm 10 shade (50→900) + map contrast cho mỗi palette.

// Ví dụ output:
$custom-primary-palette: mat.m2-define-palette((
  50:  #EAF1FF,
  100: #C9DAFF,
  200: #91B5FF,
  300: #5589FF,
  400: #3570FF,
  500: #2A66F4,
  600: #1C4AD9,
  700: #1237B0,
  800: #0B2788,
  900: #071A66,
  contrast: (
    400: white,
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
));`;

  readonly step3Code = `// src/styles.scss — tiếp nối sau sd.theme()
@use '@angular/material' as mat;
@include mat.core();

// Paste palette sinh từ tab "Công cụ" vào đây
$custom-primary-palette: mat.m2-define-palette(( /* 50→900 + contrast */ ));
$custom-accent-palette:  mat.m2-define-palette(( /* success palette */ ));
$custom-warn-palette:    mat.m2-define-palette(( /* error palette */ ));

$custom-theme: mat.m2-define-light-theme((
  color: (
    primary: $custom-primary-palette,
    accent:  $custom-accent-palette,
    warn:    $custom-warn-palette,
  ),
  density: -3,
));

@include mat.all-component-themes($custom-theme);`;

  readonly step4Code = `// angular.json
{
  "projects": {
    "your-portal": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
}`;
}
