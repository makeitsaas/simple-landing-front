import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { MediaFile } from '@shared/modules/upload/services/upload.service';

@Component({
  templateUrl: './account-settings-page.component.html',
  styleUrls: ['./account-settings-page.component.scss']
})
export class AccountSettingsPageComponent implements OnInit {
  somethingResponse: any;
  errorResponse: any;
  medias: MediaFile[] = [];

  constructor(
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.settingsService.getSomething().subscribe(something => {
      this.somethingResponse = something;
    }, error => {
      this.errorResponse = error;
    });
  }
}
