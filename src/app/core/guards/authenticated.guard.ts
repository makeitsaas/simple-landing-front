import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CurrentUserService } from '../../modules/authentication/services/current-user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../modules/authentication/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {

  constructor(
    private currentUserService: CurrentUserService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.authService.onReady().then(() => {
      if (this.currentUserService.isAuthenticated()) {
        return true;
      } else {
        this.router.navigateByUrl('/login?redirect=todoredirect');
        return false;
      }
    });
  }
}
