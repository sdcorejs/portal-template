import { Component, computed, signal, viewChild } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSideDrawer } from '@sdcorejs/angular/components/side-drawer';
import { SdInput } from '@sdcorejs/angular/forms/input';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdSelect } from '@sdcorejs/angular/forms/select';
import { SdSwitch } from '@sdcorejs/angular/forms/switch';

type ButtonType  = 'fill' | 'light' | 'outline' | 'link';
type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type ButtonSize  = 'sm' | 'md' | 'lg';

interface ButtonDemoConfig {
  title: string;
  type: ButtonType;
  color: ButtonColor;
  size: ButtonSize;
  prefixIcon: string;
  suffixIcon: string;
  disabled: boolean;
  block: boolean;
}

const DEFAULT_CONFIG: ButtonDemoConfig = {
  title: 'Tạo mới',
  type: 'fill',
  color: 'primary',
  size: 'sm',
  prefixIcon: 'add',
  suffixIcon: '',
  disabled: false,
  block: false,
};

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

@Component({
  selector: 'app-demo-button',
  standalone: true,
  imports: [SdButton, SdSideDrawer, SdCodeEditor, SdInput, SdLabel, SdSelect, SdSwitch],
  templateUrl: './demo-button.component.html',
  styleUrls: ['./demo-button.component.scss'],
})
export class DemoButtonComponent {
  settingsDrawer = viewChild.required<SdSideDrawer>('settingsDrawer');
  activeTab = signal<'properties' | 'source'>('properties');

  appliedConfig = signal<ButtonDemoConfig>(clone(DEFAULT_CONFIG));

  // Draft state — plain mutable object, only used while drawer is open
  draft: ButtonDemoConfig = clone(DEFAULT_CONFIG);

  readonly typeOptions:  { id: ButtonType;  name: string }[] = [
    { id: 'fill',    name: 'fill'    },
    { id: 'light',   name: 'light'   },
    { id: 'outline', name: 'outline' },
    { id: 'link',    name: 'link'    },
  ];
  readonly colorOptions: { id: ButtonColor; name: string }[] = [
    { id: 'primary',   name: 'primary'   },
    { id: 'secondary', name: 'secondary' },
    { id: 'success',   name: 'success'   },
    { id: 'warning',   name: 'warning'   },
    { id: 'error',     name: 'error'     },
  ];
  readonly sizeOptions:  { id: ButtonSize;  name: string }[] = [
    { id: 'sm', name: 'sm — Nhỏ'   },
    { id: 'md', name: 'md — Vừa'   },
    { id: 'lg', name: 'lg — Lớn'   },
  ];

  generatedCode = computed(() => {
    const cfg = this.appliedConfig();
    const lines: string[] = ['<sd-button'];
    if (cfg.title)      lines.push(`  title="${cfg.title}"`);
    lines.push(`  type="${cfg.type}"`);
    lines.push(`  color="${cfg.color}"`);
    lines.push(`  size="${cfg.size}"`);
    if (cfg.prefixIcon) lines.push(`  prefixIcon="${cfg.prefixIcon}"`);
    if (cfg.suffixIcon) lines.push(`  suffixIcon="${cfg.suffixIcon}"`);
    if (cfg.disabled)   lines.push(`  [disabled]="true"`);
    if (cfg.block)      lines.push(`  [block]="true"`);
    lines.push(`  (click)="onButtonClick($event)">`);
    lines.push('</sd-button>');
    return lines.join('\n');
  });

  openSettings(): void {
    this.draft = clone(this.appliedConfig());
    this.activeTab.set('properties');
    this.settingsDrawer().open();
  }

  applyConfig(): void {
    this.appliedConfig.set(clone(this.draft));
    this.settingsDrawer().close();
  }

  cancelConfig(): void {
    this.settingsDrawer().close();
  }
}
