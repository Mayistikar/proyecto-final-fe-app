import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./client/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./seller/home/home.page').then( m => m.HomePage),
    canActivate: [RoleGuard],
    data: { expectedRole: 'seller' } // Rol esperado para esta ruta
  },
  {
    path: 'client-visit',
    loadComponent: () => import('./seller/client-visit/client-visit.component').then( m => m.ClientVisitPage),
    canActivate: [RoleGuard],
    data: { expectedRole: 'seller' } // Rol esperado para esta ruta
  },
  {
    path: 'home-client',
    loadComponent: () => import('./client/home/home-client.page').then( m => m.HomePageClient),
    canActivate: [RoleGuard],
    data: { expectedRole: 'client' } // Rol esperado para esta ruta
  },
  {
    path: 'deliveries',
    loadComponent: () => import('./client/deliveries/deliveries.component').then( m => m.DeliveriesComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'client' } // Rol esperado para esta ruta
  },
  {
    path:'order-confirmation',
    loadComponent : () => import('./client/order-confirmation/order-confirmation.component').then( m => m.OrderConfirmationComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'client' } // Rol esperado para esta ruta
  },
  {
    path: 'assigned-clients',
    loadComponent: () => import('./seller/assigned-clients/assigned-clients.component').then( m => m.AssignedClientsComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'seller' } // Rol esperado para esta ruta
  },
  {
    path: 'seller-client-assignment',
    loadComponent: () => import('./seller/seller-client-assignment/seller-client-assignment.component').then(m => m.SellerClientAssignmentComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'seller' }
  },
  {
    path: 'scheduled-deliveries',
    loadComponent: () => import('./client/scheduled-deliveries/scheduled-deliveries.component').then(m => m.ScheduledDeliveriesComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'client' } // Rol esperado para esta ruta
  },
  {
    path: 'tracking',
    loadComponent: () => import('./client/tracking/tracking.component').then(m => m.TrackingComponent),
    // canActivate: [RoleGuard],
    // data: { expectedRole: 'client' } // Rol esperado para esta ruta
  },
  {
    path: 'order-status',
    loadComponent: () => import('./client/order-status/order-status.component').then(m => m.OrderStatusComponent),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
