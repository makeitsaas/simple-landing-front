import { NgModule } from '@angular/core';
import { ProjectOverviewPageComponent } from './pages/project-overview/project-overview-page.component';
import { ProjectRoutingModule } from './project-routing.module';
import { EnvironmentOverviewPageComponent } from './pages/environment-overview/environment-overview-page.component';
import { EnvironmentDiagramComponent } from './components/environment-diagram/environment-diagram.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule, MatGridListModule, MatIconModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { EnvironmentService } from './services/environment.service';
import { ModalWorkLocalComponent } from './components/modals/work-local/modal-work-local.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,

    /* Material Modules */
    MatGridListModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  declarations: [
    ProjectOverviewPageComponent,
    EnvironmentOverviewPageComponent,
    EnvironmentDiagramComponent,
    ModalWorkLocalComponent
  ],
  providers: [
    EnvironmentService
  ],
  exports: [
  ],
  entryComponents: [
    ModalWorkLocalComponent
  ]
})
export class ProjectModule {}
