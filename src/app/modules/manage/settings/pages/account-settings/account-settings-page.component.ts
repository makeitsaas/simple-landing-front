import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  templateUrl: './account-settings-page.component.html'
})
export class AccountSettingsPageComponent implements OnInit {

  sometingResponse: any;
  errorResponse: any;

  constructor(
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.settingsService.getSomething().subscribe(something => {
      this.sometingResponse = something;
    }, error => {
      this.errorResponse = error;
    });
  }
}
