import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './components/base-editor/base-editor.component';
import { EditorsRoutingModule } from './editors-routing.module';

@NgModule({
  imports: [
    EditorsRoutingModule
  ],
  declarations: [
    BaseEditorComponent
  ]
})
export class EditorsModule {}
