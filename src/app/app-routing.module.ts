import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    loadComponent: () => import('./seller/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'client-visit',
    loadComponent: () => import('./seller/client-visit/client-visit.component').then( m => m.ClientVisitPage)
  },
  {
    path: 'home-client',
    loadComponent: () => import('./client/home/home-client.page').then( m => m.HomePageClient)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
