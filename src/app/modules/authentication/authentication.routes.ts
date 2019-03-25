import { LoginPageComponent } from './pages/login/login-page.component';
import { Routes } from '@angular/router';
import { OauthCallbackComponent } from './pages/oauth-callback/oauth-callback.component';

export const AuthenticationRoutes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'oauth/callback', component: OauthCallbackComponent },
  { path: 'oauth/callback/:strategy', component: OauthCallbackComponent },
];
