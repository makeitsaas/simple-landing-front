import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './oauth-callback.component.html'
})
export class OauthCallbackComponent implements OnInit {

  private strategy: string;
  private providerCode: string;

  loading = false;
  successMessage: string;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.strategy = this.route.snapshot.paramMap.get('strategy');
    this.providerCode = this.route.snapshot.queryParamMap.get('code');

    this.clearUrl().then(() => {
      this.handleCode();
    });
  }

  clearUrl() {
    return this.router.navigate(
      ['.'],
      { relativeTo: this.route, queryParams: { } }
    );
  }

  handleCode() {
    if (this.strategy && this.providerCode) {
      this.loading = true;
      this.authService.sendAuthorizationCode(
        this.providerCode,
        this.strategy
      ).subscribe(() => {
        this.loading = false;
        this.errorMessage = '';
        this.successMessage = 'Successfully signed in !';
      }, errorInfo => {
        this.loading = false;
        if (errorInfo.error) {
          this.errorMessage = errorInfo.error.message;
        } else {
          this.errorMessage = errorInfo.message || errorInfo;
        }
      });
    }
  }
}
