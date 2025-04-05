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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
