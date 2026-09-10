import { SD_PERMISSION_PUBLIC } from '@sdcorejs/angular/modules/permission';
import { Routes } from '@angular/router';

export const formsRoutes: Routes = [
  {
    path: '',
    data: { permission: SD_PERMISSION_PUBLIC },
    children: [
      {
        path: 'input',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./input/input.component').then(m => m.InputDemoComponent),
      },
      {
        path: 'validation',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./validation/validation.component').then(m => m.ValidationDemoComponent),
      },
      {
        path: 'select',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./select/select.component').then(m => m.SelectDemoComponent),
      },
      {
        path: 'textarea',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./textarea/textarea.component').then(m => m.TextareaDemoComponent),
      },
      {
        path: 'date',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./date/date.component').then(m => m.DateDemoComponent),
      },
      {
        path: 'datetime',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./datetime/datetime.component').then(m => m.DatetimeDemoComponent),
      },
      {
        path: 'input-number',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./input-number/input-number.component').then(m => m.InputNumberDemoComponent),
      },
      {
        path: 'chip',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./chip/chip.component').then(m => m.ChipDemoComponent),
      },
      {
        path: 'chip-calendar',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./chip-calendar/chip-calendar.component').then(m => m.ChipCalendarDemoComponent),
      },
      {
        path: 'radio',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./radio/radio.component').then(m => m.RadioDemoComponent),
      },
      {
        path: 'checkbox',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./checkbox/checkbox.component').then(m => m.CheckboxDemoComponent),
      },
      {
        path: 'switch',
        data: { permission: SD_PERMISSION_PUBLIC },
        loadComponent: () => import('./switch/switch.component').then(m => m.SwitchDemoComponent),
      },
    ],
  },
];
