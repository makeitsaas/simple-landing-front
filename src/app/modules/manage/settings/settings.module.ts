import { NgModule } from '@angular/core';
import { AccountSettingsPageComponent } from './pages/account-settings/account-settings-page.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsService } from './services/settings.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule,

    MatButtonModule
  ],
  declarations: [
    AccountSettingsPageComponent
  ],
  providers: [
    SettingsService
  ]
})
export class SettingsModule {}
