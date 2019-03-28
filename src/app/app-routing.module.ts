import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error404PageComponent } from './core/templates/error-404-page.component';

const routes: Routes = [
  { path: '**', component: Error404PageComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      // , { enableTracing: true }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
