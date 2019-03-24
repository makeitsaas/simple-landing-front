import { Routes } from '@angular/router';
import { Error404PageComponent } from './core/templates/error-404-page.component';

export const AppRoutes: Routes = [
  { path: '**', component: Error404PageComponent}
];
