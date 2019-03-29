import { NgModule } from '@angular/core';
import { ProjectOverviewPageComponent } from './pages/project-overview/project-overview-page.component';
import { ProjectRoutingModule } from './project-routing.module';
import { EnvironmentOverviewPageComponent } from './pages/environment-overview/environment-overview-page.component';
import { EnvironmentDiagramComponent } from './components/environment-diagram/environment-diagram.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatGridListModule, MatIconModule, MatMenuModule, MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,

    /* Material Modules */
    MatGridListModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    ProjectOverviewPageComponent,
    EnvironmentOverviewPageComponent,
    EnvironmentDiagramComponent
  ],
  providers: [
  ],
  exports: [
  ]
})
export class ProjectModule {}
