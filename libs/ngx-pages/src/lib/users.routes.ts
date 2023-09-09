import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component'),
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadComponent: () => import('./user/user.component'),
  },
];
