import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';

const dashboardRoutes: Routes = [
  { path: '', component: ProjectsListComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectsRoutingModule { }
