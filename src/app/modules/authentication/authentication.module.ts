import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrentUserService } from './services/current-user.service';
import { LoginPageComponent } from './pages/login/login-page.component';
import { LocalLoginComponent } from './components/local-login/local-login.component';
import { AuthService, jwtOptionsFactory } from './services/auth.service';
import { OauthCallbackComponent } from './pages/oauth-callback/oauth-callback.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SharedModule } from '@shared/shared.module';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    })
  ],
  declarations: [
    LoginPageComponent,
    LocalLoginComponent,
    OauthCallbackComponent
  ],
  providers: [
    CurrentUserService,
    AuthService
  ]
})
export class AuthenticationModule {}
