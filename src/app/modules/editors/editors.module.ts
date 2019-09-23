import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './components/base-editor/base-editor.component';
import { EditorsRoutingModule } from './editors-routing.module';
import { HtmlElementsService } from './services/html-elements.service';

@NgModule({
  imports: [
    EditorsRoutingModule
  ],
  declarations: [
    BaseEditorComponent
  ],
  providers: [
    HtmlElementsService
  ]
})
export class EditorsModule {}
