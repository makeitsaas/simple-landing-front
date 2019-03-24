import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { CurrentUserService } from './current-user.service';
import { LocalStorage } from 'ngx-store';

const helper = new JwtHelperService();

// const LOGIN_URL = 'http://auth-project.lab.makeitsaas.com/auth/login';
const LOGIN_URL = 'http://localhost:3005/login';

@Injectable()
export class AuthService {

  @LocalStorage() jwt: string;

  constructor(
    private http: HttpClient,
    private currentUserService: CurrentUserService
  ) {
    if (this.jwt) {
      console.log('check previous jwt');
      this.useJwt(this.jwt);
    }
  }

  login(username, password): Observable<any> {
    console.log('ok login', username, password);
    return this.http.post<any>(LOGIN_URL, {username, password}, {})
      .pipe(map(({token}) => {
        const {decoded, isExpired} = this.parseJWT(token);

        this.useJwt(token);

        if (isExpired) {
          throw new Error('Expired token');
        } else {
          return decoded.user;
        }
      }));
  }

  useJwt(token: string) {
    const {decoded, isExpired} = this.parseJWT(token);
    if (!isExpired) {
      this.jwt = token;
      this.currentUserService.setUser(decoded.user);
    } else {
      console.log('too old');
      this.logout();
    }
  }

  logout() {
    this.jwt = null;
    this.currentUserService.setUser(null);
  }

  parseJWT(token: string) {
    return {
      decoded: helper.decodeToken(token),
      expirationDate: helper.getTokenExpirationDate(token),
      isExpired: helper.isTokenExpired(token)
    };
  }
}
