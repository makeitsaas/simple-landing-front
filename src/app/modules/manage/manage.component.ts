import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../authentication/services/current-user.service';
import { AuthService } from '../authentication/services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  user: any;
  opened = false;

  constructor(
    private currentUserService: CurrentUserService,
    private authService: AuthService,
    private router: Router
  ) {
    router.events.subscribe(() => this.opened = false);
  }

  ngOnInit() {
    this.currentUserService.onUser().subscribe(user => this.user = user);
  }

  logout() {
    this.authService.logout();
  }
}
