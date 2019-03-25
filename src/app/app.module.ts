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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WebStorageModule,
    CommonModule,
    CoreModule,
    DashboardModule,
    AuthenticationModule,
    SettingsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
