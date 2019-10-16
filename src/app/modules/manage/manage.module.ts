import { NgModule } from '@angular/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage.component';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatMenuModule, MatSidenavModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    DashboardModule,
    SettingsModule,
    ManageRoutingModule,

    /* Material Modules */
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    FlexLayoutModule
  ],
  declarations: [
    ManageComponent
  ],
  bootstrap: [ManageComponent]
})
export class ManageModule {}
