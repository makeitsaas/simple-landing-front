import { NgModule } from '@angular/core';
import { TemplatesListComponent } from './pages/templates-list/templates-list.component';
import { TemplatesRoutingModule } from './templates-routing.module';

@NgModule({
  imports: [
    TemplatesRoutingModule
  ],
  declarations: [
    TemplatesListComponent
  ],
  providers: [
  ],
  exports: [
  ]
})
export class TemplatesModule {}
