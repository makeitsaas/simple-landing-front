import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrentUserService } from './services/current-user.service';
import { LoginPageComponent } from './pages/login/login-page.component';
import { AuthenticationRoutes } from './authentication.routes';
import { RouterModule } from '@angular/router';
import { LocalLoginComponent } from './components/local-login/local-login.component';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    ReactiveFormsModule
  ],
  declarations: [
    LoginPageComponent,
    LocalLoginComponent
  ],
  providers: [
    CurrentUserService,
    AuthService
  ]
})
export class AuthenticationModule {}
