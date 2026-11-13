
import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/presentation/pages/tasks-list/tasks-list.page')
        .then((m) => m.TasksListPage),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/presentation/pages/categories-manage/categories-manage.page')
        .then((m) => m.CategoriesManagePage),
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
  