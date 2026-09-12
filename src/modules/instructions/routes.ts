import { Routes } from '@angular/router';
import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { INSTRUCTIONS } from './catalog/instruction-registry';
import { loadArticle } from './catalog/load-article';
export const instructionsRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      ...INSTRUCTIONS.map(article => ({
        path: article.path,
        pathMatch: 'full' as const,
        data: { permission: SD_PERMISSION_PUBLIC, articleId: article.id },
        resolve: { article: () => loadArticle(article.id) },
        loadComponent: () =>
          import('./components/instruction-article/instruction-article.component').then(m => m.InstructionArticleComponent),
      })),
      {
        path: 'instroduction',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/instroduction/instroduction.component').then(m => m.InstroductionComponent),
      },
      {
        path: 'custom-theme/tool',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/custom-theme/tool/tool.component').then(m => m.CustomThemeToolComponent),
      },
      { path: 'custom-theme', pathMatch: 'full', redirectTo: 'custom-theme/guide' },
      { path: 'coding-convention', pathMatch: 'full', redirectTo: 'coding-convention/scss' },
      { path: '', pathMatch: 'full', redirectTo: 'getting-started/overview' },
    ],
  },
];
