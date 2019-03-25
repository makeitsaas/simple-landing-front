import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountSettingsPageComponent } from './pages/account-settings/account-settings-page.component';
import { AuthenticatedGuard } from '../../core/guards/authenticated.guard';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    canActivate: [AuthenticatedGuard],
    component: AccountSettingsPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(settingsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule { }
