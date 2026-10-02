import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { SD_UPLOAD_FILE_CONFIGURATION } from '@sdcorejs/angular/components/upload-file';
import { BrowserUtilities } from '@sdcorejs/utils/fns';
import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { WorkspaceStore } from './data/workspace.store';

export const workspaceRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    providers: [
      WorkspaceStore,
      {
        provide: SD_UPLOAD_FILE_CONFIGURATION,
        useFactory: () => {
          const store = inject(WorkspaceStore);
          return {
            upload: store.uploadAttachments,
            details: store.attachmentDetails,
            download: async (key: string | number) => {
              const item = store.files().find(file => file.id === String(key));
              BrowserUtilities.downloadBlob(store.content(String(key)), item?.name);
            },
          };
        },
      },
    ],
    loadComponent: () => import('./workspace.component').then(m => m.WorkspaceComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'queue' },
      { path: 'queue', loadComponent: () => import('./queue/queue.component').then(m => m.WorkspaceQueueComponent) },
      { path: 'files', loadComponent: () => import('./files/files.component').then(m => m.WorkspaceFilesComponent) },
      { path: 'designer', loadComponent: () => import('./designer/designer.component').then(m => m.WorkspaceDesignerComponent) },
      { path: 'request', loadComponent: () => import('./request/request.component').then(m => m.WorkspaceRequestComponent) },
      { path: 'activity', loadComponent: () => import('./activity/activity.component').then(m => m.WorkspaceActivityComponent) },
    ],
  },
];
