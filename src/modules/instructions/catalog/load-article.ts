import type { InstructionId } from './instruction-registry';
import type { InstructionContent } from './instruction-content';
const loaders: Record<InstructionId, () => Promise<InstructionContent>> = {
  overview: async () => {
    const [article, component] = await Promise.all([
      import('./articles/overview'),
      import('../features/getting-started/getting-started-demo.component'),
    ]);
    return { ...article.default, demo: component.OverviewDemoComponent };
  },
  setup: async () => {
    const [article, component] = await Promise.all([
      import('./articles/setup'),
      import('../features/getting-started/getting-started-demo.component'),
    ]);
    return { ...article.default, demo: component.SetupDemoComponent };
  },
  architecture: async () => {
    const [article, component] = await Promise.all([
      import('./articles/architecture'),
      import('../features/architecture/pages/architecture.component'),
    ]);
    return { ...article.default, demo: component.ArchitectureComponent };
  },
  routing: async () => {
    const [article, component] = await Promise.all([
      import('./articles/routing'),
      import('../features/architecture/architecture-demos.component'),
    ]);
    return { ...article.default, demo: component.RoutingDemoComponent };
  },
  configuration: async () => {
    const [article, component] = await Promise.all([
      import('./articles/configuration'),
      import('../features/architecture/architecture-demos.component'),
    ]);
    return { ...article.default, demo: component.ConfigurationDemoComponent };
  },
  integration: async () => {
    const [article, component] = await Promise.all([
      import('./articles/integration'),
      import('../features/architecture/architecture-demos.component'),
    ]);
    return { ...article.default, demo: component.IntegrationDemoComponent };
  },
  di: async () => {
    const [article, component] = await Promise.all([import('./articles/di'), import('../features/modern-angular/di-demo.component')]);
    return { ...article.default, demo: component.DiDemoComponent };
  },
  signals: async () => {
    const [article, component] = await Promise.all([
      import('./articles/signals'),
      import('../features/modern-angular/signals-demo.component'),
    ]);
    return { ...article.default, demo: component.SignalsDemoComponent };
  },
  'permission-model': async () => {
    const [article, component] = await Promise.all([
      import('./articles/permission-model'),
      import('../features/authorization/permission-demos.component'),
    ]);
    return { ...article.default, demo: component.PermissionModelDemoComponent };
  },
  'permission-checks': async () => {
    const [article, component] = await Promise.all([
      import('./articles/permission-checks'),
      import('../features/authorization/permission-demos.component'),
    ]);
    return { ...article.default, demo: component.PermissionChecksDemoComponent };
  },
  'data-scope': async () => {
    const [article, component] = await Promise.all([
      import('./articles/data-scope'),
      import('../features/authorization/permission-demos.component'),
    ]);
    return { ...article.default, demo: component.DataScopeDemoComponent };
  },
  typescript: async () => {
    const [article, component] = await Promise.all([
      import('./articles/typescript'),
      import('../features/coding-conventions/coding-demos.component'),
    ]);
    return { ...article.default, demo: component.TypeScriptDemoComponent };
  },
  spacing: async () => {
    const [article, component] = await Promise.all([
      import('./articles/spacing'),
      import('../features/coding-conventions/coding-demos.component'),
    ]);
    return { ...article.default, demo: component.SpacingDemoComponent };
  },
  quality: async () => {
    const [article, component] = await Promise.all([
      import('./articles/quality'),
      import('../features/coding-conventions/coding-demos.component'),
    ]);
    return { ...article.default, demo: component.QualityDemoComponent };
  },
  git: async () => {
    const [article, component] = await Promise.all([import('./articles/git'), import('../features/tooling/tooling-demos.component')]);
    return { ...article.default, demo: component.GitDemoComponent };
  },
  theme: async () => {
    const [article, component] = await Promise.all([import('./articles/theme'), import('../features/tooling/tooling-demos.component')]);
    return { ...article.default, demo: component.ThemeDemoComponent };
  },
  'portal-config': async () => {
    const [article, component] = await Promise.all([
      import('./articles/portal-config'),
      import('../features/portal-config/portal-config.component'),
    ]);
    return { ...article.default, demo: component.PortalConfigComponent };
  },
};
export function loadArticle(id: InstructionId): Promise<InstructionContent> {
  return loaders[id]();
}
