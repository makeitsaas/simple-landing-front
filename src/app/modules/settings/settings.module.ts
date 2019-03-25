import { NgModule } from '@angular/core';
import { AccountSettingsPageComponent } from './pages/account-settings/account-settings-page.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsService } from './services/settings.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule
  ],
  declarations: [
    AccountSettingsPageComponent
  ],
  providers: [
    SettingsService
  ]
})
export class SettingsModule {}
