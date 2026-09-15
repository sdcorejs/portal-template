import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';

export const formRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      {
        path: 'input',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/input/input.component').then(m => m.InputDemoComponent),
      },
      {
        path: 'validation',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/validation/validation.component').then(m => m.ValidationDemoComponent),
      },
      {
        path: 'select',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/select/select.component').then(m => m.SelectDemoComponent),
      },
      {
        path: 'textarea',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/textarea/textarea.component').then(m => m.TextareaDemoComponent),
      },
      {
        path: 'date',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/date/date.component').then(m => m.DateDemoComponent),
      },
      {
        path: 'datetime',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/datetime/datetime.component').then(m => m.DatetimeDemoComponent),
      },
      {
        path: 'input-number',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/input-number/input-number.component').then(m => m.InputNumberDemoComponent),
      },
      {
        path: 'chip',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/chip/chip.component').then(m => m.ChipDemoComponent),
      },
      {
        path: 'chip-calendar',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/chip-calendar/chip-calendar.component').then(m => m.ChipCalendarDemoComponent),
      },
      {
        path: 'radio',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/radio/radio.component').then(m => m.RadioDemoComponent),
      },
      {
        path: 'checkbox',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/checkbox/checkbox.component').then(m => m.CheckboxDemoComponent),
      },
      {
        path: 'switch',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./features/switch/switch.component').then(m => m.SwitchDemoComponent),
      },
    ],
  },
];
