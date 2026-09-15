import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SdPageComponent } from '@sdcorejs/angular/modules/layout';
import { SdSection } from '@sdcorejs/angular/components/section';
import { SdTabComponent } from '@sdcorejs/angular/components/tab-router';
import { INSTRUCTIONS } from '../../catalog/instruction-registry';
import type { InstructionContent } from '../../catalog/instruction-content';
import { InstructionExampleComponent } from '../instruction-example/instruction-example.component';

@Component({
  selector: 'app-instruction-article',
  imports: [RouterLink, SdPageComponent, SdSection, InstructionExampleComponent],
  templateUrl: './instruction-article.component.html',
  styleUrl: './instruction-article.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionArticleComponent {
  readonly route = inject(ActivatedRoute);
  readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  readonly meta = computed(() => INSTRUCTIONS.find(item => item.id === this.data()['articleId']) ?? INSTRUCTIONS[0]);
  readonly article = computed(() => this.data()['article'] as InstructionContent);
  readonly previous = computed(() => INSTRUCTIONS[this.meta().order - 2]);
  readonly next = computed(() => INSTRUCTIONS.find(item => item.order === this.meta().order + 1));
  readonly related = computed(() => INSTRUCTIONS.filter(item => this.article().related.includes(item.id)));
  readonly zoom = viewChild<ElementRef<HTMLDialogElement>>('zoom');
  readonly imageTrigger = viewChild<ElementRef<HTMLButtonElement>>('imageTrigger');
  readonly imagePath = computed(() => '/assets/instructions/' + this.meta().id + '/overview.svg');
  readonly sections = [
    { id: 'goals', title: 'Mục tiêu & chuẩn bị' },
    { id: 'steps', title: 'Hướng dẫn thực hiện' },
    { id: 'example', title: 'Thử ngay' },
    { id: 'review', title: 'Lỗi thường gặp & checklist' },
    { id: 'sources', title: 'Nguồn & bài liên quan' },
  ];
  jump(id: string): void {
    const element = this.host.nativeElement.querySelector<HTMLElement>('#' + id);
    element?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    element?.focus({ preventScroll: true });
  }
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  openImage(): void {
    this.zoom()?.nativeElement.showModal();
  }
  closeImage(): void {
    this.zoom()?.nativeElement.close();
  }
  restoreFocus(): void {
    this.imageTrigger()?.nativeElement.focus();
  }
}
SdTabComponent({
  component: InstructionArticleComponent,
  name: args => INSTRUCTIONS.find(item => args.url?.split(/[?#]/)[0] === '/instruction/' + item.path)?.title ?? 'Instructions',
  icon: args => INSTRUCTIONS.find(item => args.url?.split(/[?#]/)[0] === '/instruction/' + item.path)?.icon ?? 'school',
})(InstructionArticleComponent);
