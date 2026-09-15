import type { EntityKind } from '../data/models';
/** Serializable discovery contract for consumers; loaders remain in a separate Angular-only module. */
export interface PagePattern {
  id: string;
  name: string;
  route: string;
  recordRoutes: { create: string; detail: string; update: string };
  coreVersion: string;
  entityKind: EntityKind | 'role';
  entityLabel: string;
  purpose: string;
  dataShape: string;
  density: string;
  container: string;
  requiredFields: string[];
  relationships: string[];
  interactions: string[];
  suitableWhen: string;
  avoidWhen: string;
  components: string[];
  sourceFiles: string[];
  dataContract: string;
  fixtures: string;
  responsive: string;
  states: string[];
}
