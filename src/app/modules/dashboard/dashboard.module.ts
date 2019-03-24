import { NgModule } from '@angular/core';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    DashboardRoutingModule
  ],
  declarations: [
    DashboardPageComponent
  ],
  providers: [
  ],
  exports: [
  ]
})
export class DashboardModule {}
