import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SdAvatar } from '@sd-angular/core/components/avatar';
import { SdCodeEditor } from '@sd-angular/core/components/code-editor';
import { SdSection } from '@sd-angular/core/components/section';
import { SdInput } from '@sd-angular/core/forms/input';
import { SdInputNumber } from '@sd-angular/core/forms/input-number';
import { SdLabel } from '@sd-angular/core/forms/label';
import { SdPageComponent } from '@sd-angular/core/modules/layout';

@Component({
  selector: 'app-avatar-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SdCodeEditor,
    SdPageComponent,
    SdSection,
    SdAvatar,
    SdInput,
    SdInputNumber,
    SdLabel,
  ],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarDemoComponent {
  pageDescription = signal(
    'Component SdAvatar hiển thị ảnh đại diện cho người dùng, hỗ trợ fallback sang ký tự viết tắt tên dính kèm background pattern sinh màu tự động.'
  );

  src = signal<string>('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80');
  size = signal<number>(64);

  htmlCode = computed(() => {
    let props = ``;
    if (this.size() !== 32) {
      props += `\n  [size]="${this.size()}"`;
    }

    return `<sd-avatar
  [src]="'${this.src()}'"${props}>
</sd-avatar>`;
  });

  tsCode = `import { Component } from '@angular/core';
import { SdAvatar } from '@sd-angular/core/components/avatar';

@Component({
  standalone: true,
  imports: [SdAvatar],
  templateUrl: './my-component.component.html',
})
export class MyComponent {
  // Variables or Logic here
}`;

  simulateError() {
    this.src.set('https://failed-image-url.com/xyz.jpg');
  }

  simulateEmptyUrl() {
    this.src.set('');
  }

  simulateName() {
    this.src.set('Nguyen Van A');
  }
}
