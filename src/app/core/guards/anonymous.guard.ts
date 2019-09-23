import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CurrentUserService } from '../../modules/authentication/services/current-user.service';
import { AuthService } from '../../modules/authentication/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard implements CanActivate {

  constructor(
    private currentUserService: CurrentUserService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.authService.onReady().then(() => {
      if (this.currentUserService.isAuthenticated()) {
        this.router.navigateByUrl('/manage/dashboard');
        return false;
      } else {
        return true;
      }
    });
  }
}
