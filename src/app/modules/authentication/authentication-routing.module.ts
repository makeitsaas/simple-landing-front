import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from './pages/login/login-page.component';
import { OauthCallbackComponent } from './pages/oauth-callback/oauth-callback.component';
import { AnonymousGuard } from '../../core/guards/anonymous.guard';

const authenticationRoutes: Routes = [
  {
    path: 'login',
    canActivate: [AnonymousGuard],
    component: LoginPageComponent
  },
  {
    path: 'oauth/callback/:strategy',
    component: OauthCallbackComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(authenticationRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthenticationRoutingModule { }
