import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isUsuarioAutenticado()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userType = route.data['userType'];
    const isMedico = this.authService.isMedicoLoggedIn();
    const isPaciente = this.authService.isPacienteLoggedIn();

    if (userType) {
      if (userType === 'medico' && !isMedico) {
        this.router.navigate(['/login']);
        return false;
      }
      if (userType === 'paciente' && !isPaciente) {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }
}
