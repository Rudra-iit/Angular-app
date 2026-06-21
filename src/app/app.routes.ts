import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
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
    path: 'dashboard',
    component: Dashboard,
  },

  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
];
