import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection, SdSectionItem } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdSelect } from '@sd-angular/core/forms/select';
import { SdSwitch } from '@sd-angular/core/forms/switch';
import { SdPageComponent } from '@sd-angular/core/modules/layout';
import { SdColor } from '@sd-angular/core/utilities/models';

@Component({
  selector: 'app-section-basic',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdSection,
    SdSectionItem,
    SdCodeEditor,
    SdPageComponent,
    SdInput,
    SdSelect,
    SdSwitch,
    SdLabel,
  ],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionBasicComponent {
  pageDescription = signal(
    'Playground tương tác cho sd-section. Chỉnh các thuộc tính bên trái để thấy thay đổi ngay trong phần xem trước.'
  );

  // ── Config signals ────────────────────────────────────────────────────────
  title = signal('Thông tin khách hàng');
  subTitle = signal('Thông tin cơ bản');
  icon = signal('person');
  iconColor = signal<SdColor>('primary');
  collapsable = signal(false);
  collapsed = signal(false);
  hideHeader = signal(false);
  noPaddingBody = signal(false);

  iconColorOptions = [
    { id: 'primary', name: 'Primary (xanh chính)' },
    { id: 'secondary', name: 'Secondary (xám)' },
    { id: 'success', name: 'Success (xanh lá)' },
    { id: 'warning', name: 'Warning (vàng)' },
    { id: 'error', name: 'Error (đỏ)' },
    { id: 'info', name: 'Info (xanh dương)' },
  ];

  // ── Auto-generated code ───────────────────────────────────────────────────
  htmlCode = computed(() => {
    const props: string[] = [];
    if (this.title()) props.push(`title="${this.title()}"`);
    if (this.subTitle()) props.push(`subTitle="${this.subTitle()}"`);
    if (this.icon()) props.push(`icon="${this.icon()}"`);
    if (this.iconColor() !== 'primary') props.push(`[iconColor]="'${this.iconColor()}'"`);
    if (this.collapsable()) props.push(`collapsable`);
    if (this.collapsed()) props.push(`[(collapsed)]="isCollapsed"`);
    if (this.hideHeader()) props.push(`hideHeader`);
    if (this.noPaddingBody()) props.push(`noPaddingBody`);

    const propsStr =
      props.length > 3
        ? `\n  ${props.join('\n  ')}`
        : props.length > 0
          ? ` ${props.join(' ')}`
          : '';

    return `<sd-section${propsStr}>
  <p>Nội dung hiển thị trong body của section.</p>
</sd-section>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdSection } from '@sd-angular/core/components/section';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [SdSection],
  templateUrl: './my-component.component.html',
})
export class MyComponent {
  isCollapsed = false;
}`;
}
