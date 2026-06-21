import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'admin',
    component: Admin,
  },
];
