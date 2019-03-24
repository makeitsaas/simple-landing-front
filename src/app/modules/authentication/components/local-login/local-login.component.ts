import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-local-login',
  templateUrl: './local-login.component.html'
})
export class LocalLoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  errorMessage: string;

  constructor(
    private authService: AuthService,
    private currentUserService: CurrentUserService
  ) {}

  onSubmit() {
    this.authService.login(
      this.loginForm.get('username').value,
      this.loginForm.get('password').value
    ).subscribe(response => {
      console.log('server response', response);
      this.errorMessage = '';
      // this.currentUserService.onUserJWT(response.token);
    }, info => {
      console.log('info', info);
      if(info.error) {
        this.errorMessage = info.error.message
      } else {
        this.errorMessage = info;
      }
    });
  }
}
