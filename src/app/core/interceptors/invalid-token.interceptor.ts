import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../modules/authentication/services/auth.service';

@Injectable()
export class InvalidTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(errorResponse => {
        if(errorResponse.status === 401 && /invalid token/i.test(errorResponse.error && errorResponse.error.message || errorResponse.error)) {
          this.authService.logout();
        }
        throw errorResponse;
      }));
  }
}
