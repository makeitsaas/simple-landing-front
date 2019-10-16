import { NgModule } from '@angular/core';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { MatButtonModule, MatCardModule, MatGridListModule, MatListModule } from '@angular/material';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProjectsRoutingModule,

    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatListModule,
  ],
  declarations: [
    ProjectsListComponent
  ],
  providers: [
  ],
  exports: [
  ]
})
export class ProjectsModule {}
