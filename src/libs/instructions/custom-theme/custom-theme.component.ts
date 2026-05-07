import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdButton } from '@sd-angular/core/components/button';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-custom-theme',
  standalone: true,
  imports: [CommonModule, FormsModule, SdButton, SdCodeEditor, SdPageComponent, SdSection, SdSwitch],
  templateUrl: './custom-theme.component.html',
  styleUrls: ['./custom-theme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomThemeComponent {
  pageDescription = signal(
    'Hướng dẫn tùy chỉnh theme cho portal: ghi đè CSS variables của Core UI qua sd.theme() và sinh Angular Material M2 Palette tương ứng để đồng bộ màu cho Material components — tất cả trong styles.scss.'
  );

  // ── Live preview ──────────────────────────────────────────────────────────
  primaryColor = signal('#2A66F4');
  primaryLightColor = signal('#EAF1FF');
  previewSwitch = signal(true);

  previewPrimaryDark = computed(() => {
    const p = this.generatePalette(this.primaryColor());
    return p.find(([s]) => s === '700')?.[1] ?? '#1C4AD9';
  });

  // ── Palette generator inputs ──────────────────────────────────────────────
  palettePrimary = signal('#2A66F4');
  paletteAccent  = signal('#4CAF50');
  paletteWarn    = signal('#F82C13');

  private computedPalettes = computed(() => ({
    primary: this.generatePalette(this.palettePrimary()),
    accent:  this.generatePalette(this.paletteAccent()),
    warn:    this.generatePalette(this.paletteWarn()),
  }));

  paletteDisplay = computed(() => {
    const { primary, accent, warn } = this.computedPalettes();
    return [
      { name: 'Primary', shades: primary.map(([stop, hex]) => ({ stop, hex, white: this.needsWhiteText(hex) })) },
      { name: 'Accent',  shades: accent.map(([stop, hex]) => ({ stop, hex, white: this.needsWhiteText(hex) })) },
      { name: 'Warn',    shades: warn.map(([stop, hex]) => ({ stop, hex, white: this.needsWhiteText(hex) })) },
    ];
  });

  generatedScss = computed(() => {
    const { primary, accent, warn } = this.computedPalettes();
    return [
      this.toScss('custom-primary', primary),
      this.toScss('custom-accent',  accent),
      this.toScss('custom-warn',    warn),
    ].join('\n\n');
  });

  // ── Step codes ────────────────────────────────────────────────────────────
  readonly step1Code = `// src/styles.scss
@use '@sd-angular/core/assets/scss/themes/default' as sd;

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

  readonly step3Code = `// src/styles.scss — tiếp nối sau sd.theme()
@use '@angular/material' as mat;
@include mat.core();

// Paste palette sinh từ Bước 2 vào đây
$custom-primary-palette: mat.m2-define-palette(( /* 50→900 + contrast */ ));
$custom-accent-palette:  mat.m2-define-palette(( /* 50→900 + contrast */ ));
$custom-warn-palette:    mat.m2-define-palette(( /* 50→900 + contrast */ ));

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

  // ── Color input handlers ──────────────────────────────────────────────────
  onColorPick(sig: WritableSignal<string>, event: Event): void {
    sig.set((event.target as HTMLInputElement).value);
  }

  onHexType(sig: WritableSignal<string>, event: Event): void {
    const val = (event.target as HTMLInputElement).value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(val)) sig.set(val);
  }

  // ── Palette math (ported from scripts/palette-generator.html) ────────────
  private hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  private hslToHex(h: number, s: number, l: number): string {
    h /= 360; s /= 100; l /= 100;
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  }

  private generatePalette(hex: string): Array<[string, string]> {
    const [r, g, b] = this.hexToRgb(hex);
    const [h, s, l] = this.rgbToHsl(r, g, b);
    const lerp = (a: number, bv: number, t: number) => a + (bv - a) * t;
    const lightHalf = [95, 88, 78, 66, 56];
    const darkHalf  = [lerp(l, 8, 0.25), lerp(l, 8, 0.5), lerp(l, 8, 0.72), lerp(l, 8, 0.88)];
    return [
      ['50',  this.hslToHex(h, Math.min(s * 0.2,  100), lightHalf[0])],
      ['100', this.hslToHex(h, Math.min(s * 0.35, 100), lightHalf[1])],
      ['200', this.hslToHex(h, Math.min(s * 0.55, 100), lightHalf[2])],
      ['300', this.hslToHex(h, Math.min(s * 0.75, 100), lightHalf[3])],
      ['400', this.hslToHex(h, Math.min(s * 0.9,  100), lightHalf[4])],
      ['500', hex.toUpperCase()],
      ['600', this.hslToHex(h, Math.min(s * 1.05, 100), Math.max(darkHalf[0], 10))],
      ['700', this.hslToHex(h, Math.min(s * 1.1,  100), Math.max(darkHalf[1], 8))],
      ['800', this.hslToHex(h, Math.min(s * 1.1,  100), Math.max(darkHalf[2], 6))],
      ['900', this.hslToHex(h, Math.min(s * 1.1,  100), Math.max(darkHalf[3], 4))],
    ];
  }

  private needsWhiteText(hex: string): boolean {
    const [r, g, b] = this.hexToRgb(hex);
    const lin = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return (1.05) / (L + 0.05) > (L + 0.05) / 0.05;
  }

  private toScss(varName: string, palette: Array<[string, string]>): string {
    const stops = palette.map(([s, h]) => `  ${s}: ${h.toUpperCase()},`).join('\n');
    const contrastLines = palette
      .filter(([, h]) => this.needsWhiteText(h))
      .map(([s]) => `    ${s}: white,`)
      .join('\n');
    return `$${varName}-palette: mat.m2-define-palette((\n${stops}\n  contrast: (\n${contrastLines}\n  )\n));`;
  }
}
