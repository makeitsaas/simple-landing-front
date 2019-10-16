import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManageComponent } from './manage.component';

const manageRoutes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'templates',
        loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule)
      },
    ]
    // component
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(manageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ManageRoutingModule {
}
