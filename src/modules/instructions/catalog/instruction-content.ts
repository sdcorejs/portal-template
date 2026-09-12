import type { Type } from '@angular/core';
export interface InstructionStep {
  title: string;
  text: string;
  file: string;
  code: string;
  result: string;
}
export interface InstructionContent {
  screenshot?: { src: string; alt: string };
  goals: string[];
  prerequisites: string;
  steps: InstructionStep[];
  exercise: string;
  expected: string;
  exampleCode: string;
  pitfalls: string[];
  checklist: string[];
  sources: { title: string; url: string }[];
  related: string[];
  caption: string;
  demo: Type<unknown>;
}
export type ArticleText = Omit<InstructionContent, 'demo'>;
