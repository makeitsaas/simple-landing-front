import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TemplatesListComponent } from './pages/templates-list/templates-list.component';

const dashboardRoutes: Routes = [
  { path: '', component: TemplatesListComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TemplatesRoutingModule { }
