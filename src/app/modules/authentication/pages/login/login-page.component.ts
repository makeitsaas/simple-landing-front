import { Component } from '@angular/core';
import { environment } from '@env';

@Component({
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  githubOAuthUrl = environment.authAPIUrl + '/oauth/github';
}
