import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AppRoutingModule } from './app-routing.module';
import { WebStorageModule } from 'ngx-store';
import { CommonModule } from '@angular/common';
import { SettingsModule } from './modules/settings/settings.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatMenuModule, MatSidenavModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ProjectModule } from './modules/project/project.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WebStorageModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    CoreModule,
    DashboardModule,
    AuthenticationModule,
    SettingsModule,
    ProjectModule,
    AppRoutingModule,

    /* Material Modules */
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
