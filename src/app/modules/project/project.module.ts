import { NgModule } from '@angular/core';
import { ProjectOverviewPageComponent } from './pages/project-overview/project-overview-page.component';
import { ProjectRoutingModule } from './project-routing.module';
import { EnvironmentOverviewPageComponent } from './pages/environment-overview/environment-overview-page.component';

@NgModule({
  imports: [
    ProjectRoutingModule
  ],
  declarations: [
    ProjectOverviewPageComponent,
    EnvironmentOverviewPageComponent
  ],
  providers: [
  ],
  exports: [
  ]
})
export class ProjectModule {}
