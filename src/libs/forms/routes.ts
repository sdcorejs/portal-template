import { Routes } from '@angular/router';

export const formsRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'input', loadComponent: () => import('./input/input.component').then(m => m.InputDemoComponent) },
      { path: 'validation', loadComponent: () => import('./validation/validation.component').then(m => m.ValidationDemoComponent) },
      { path: 'select', loadComponent: () => import('./select/select.component').then(m => m.SelectDemoComponent) },
      { path: 'textarea', loadComponent: () => import('./textarea/textarea.component').then(m => m.TextareaDemoComponent) },
      { path: 'date', loadComponent: () => import('./date/date.component').then(m => m.DateDemoComponent) },
      { path: 'datetime', loadComponent: () => import('./datetime/datetime.component').then(m => m.DatetimeDemoComponent) },
      { path: 'input-number', loadComponent: () => import('./input-number/input-number.component').then(m => m.InputNumberDemoComponent) },
      { path: 'chip', loadComponent: () => import('./chip/chip.component').then(m => m.ChipDemoComponent) },
      { path: 'chip-calendar', loadComponent: () => import('./chip-calendar/chip-calendar.component').then(m => m.ChipCalendarDemoComponent) },
      { path: 'radio', loadComponent: () => import('./radio/radio.component').then(m => m.RadioDemoComponent) },
      { path: 'checkbox', loadComponent: () => import('./checkbox/checkbox.component').then(m => m.CheckboxDemoComponent) },
      { path: 'switch', loadComponent: () => import('./switch/switch.component').then(m => m.SwitchDemoComponent) },
    ]
  }
]
