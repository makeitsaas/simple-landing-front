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
