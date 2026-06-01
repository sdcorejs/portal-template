import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SdButton } from '@sdcorejs/angular/components/button';
import { SdCodeEditor } from '@sdcorejs/angular/components/code-editor';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdInputNumber } from '@sdcorejs/angular/forms/input-number';
import { SdLabel } from '@sdcorejs/angular/forms/label';
import { SdLoadingService } from '@sdcorejs/angular/services/loading';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';

@Component({
  selector: 'app-loading-demo',
  standalone: true,
  imports: [SdButton, SdCodeEditor, SdPageComponent, SdSection, SdInputNumber, SdLabel],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingDemoComponent {
  readonly #loadingService = inject(SdLoadingService);

  pageDescription = signal<string>('Dịch vụ hiển thị overlay loading, hỗ trợ gắn vào bất kỳ phần tử DOM nào.');

  // Config
  duration = signal<number>(2000);
  targetSelector = signal<string>('body');

  // State
  isRunning = signal<boolean>(false);

  // Options
  targetOptions = [
    { id: 'body', name: 'Toàn trang (body)' },
    { id: '#preview-box', name: 'Vùng Preview (#preview-box)' },
  ];

  tsCode = `import { Component, inject } from '@angular/core';
import { SdLoadingService } from '@sdcorejs/angular/services/loading';

@Component({
  selector: 'app-my-component',
  standalone: true,
  templateUrl: './my-component.component.html',
})
export class MyComponent {
  readonly #loadingService = inject(SdLoadingService);

  async loadData() {
    this.#loadingService.start();
    try {
      await fetchSomething();
    } finally {
      this.#loadingService.stop();
    }
  }
}`;

  startLoading() {
    const selector = this.targetSelector();
    if (this.#loadingService.isLoading(selector)) return;

    this.isRunning.set(true);
    this.#loadingService.start(selector);

    setTimeout(() => {
      this.#loadingService.stop(selector);
      this.isRunning.set(false);
    }, this.duration());
  }

  stopLoading() {
    this.#loadingService.stop(this.targetSelector());
    this.isRunning.set(false);
  }
}
