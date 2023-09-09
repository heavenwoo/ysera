import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users.routes').then(m => m.usersRoutes),
  },
];
