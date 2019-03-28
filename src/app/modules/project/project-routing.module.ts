import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjectOverviewPageComponent } from './pages/project-overview/project-overview-page.component';
import { EnvironmentOverviewPageComponent } from './pages/environment-overview/environment-overview-page.component';

const projectRoutes: Routes = [
  { path: 'projects/:project_id', component: ProjectOverviewPageComponent },
  { path: 'projects/:project_id/environments/:environment_id', component: EnvironmentOverviewPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(projectRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectRoutingModule { }
