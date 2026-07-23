import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { Cart } from './cart/cart';
import { Category } from './category/category';
import { Contact } from './contact/contact';
import { Dashboard } from './dash/dash';
import { Login } from './login/login';
import { ProductDetail } from './product-detail/product-detail';
import { Register } from './register/register';
import { AuthGuard } from './services/auth.guard';
import { HeaderComponent } from './header/header';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash',
    pathMatch: 'full',
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'dash',
    component: Dashboard,
  },
  {
    path: 'category',
    component: Category,
  },
  {
    path: 'product/:id',
    component: ProductDetail,
    data: {
      prerender: false,
    },
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
  {
    path: 'contact',
    component: Contact,
  },
  {
    path: 'header',
    component: HeaderComponent,
  },
];
