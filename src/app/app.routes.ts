import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { Cart } from './cart/cart';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Register } from './register/register';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'cart',
    component: Cart,
  },
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
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [AuthGuard],
  },
];
