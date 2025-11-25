import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { CreateOrderComponent } from './pages/create-order/create-order.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'orders/create', component: CreateOrderComponent, canActivate: [AuthGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
