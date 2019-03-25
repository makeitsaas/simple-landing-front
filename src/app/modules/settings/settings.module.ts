import { NgModule } from '@angular/core';
import { AccountSettingsPageComponent } from './pages/account-settings/account-settings-page.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    SettingsRoutingModule
  ],
  declarations: [
    AccountSettingsPageComponent
  ]
})
export class SettingsModule {}
