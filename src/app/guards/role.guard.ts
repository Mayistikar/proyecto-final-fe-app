import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginClientService } from '../services/login-client.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private loginService: LoginClientService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole']; // Rol esperado en la ruta
    const userRole = this.loginService.getUserRole(); // Obtener el rol del usuario

    if (userRole !== expectedRole) {
      this.router.navigate(['/login']); // Redirigir si no tiene permiso
      return false;
    }
    return true;
  }
}

