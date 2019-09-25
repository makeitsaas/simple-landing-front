import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './components/base-editor/base-editor.component';
import { EditorsRoutingModule } from './editors-routing.module';
import { HtmlElementsService } from './services/html-elements.service';
import { FieldsEditorComponent } from './components/fields-editor/fields-editor.component';
import { WireframeEditorComponent } from './components/wireframe-editor/wireframe-editor.component';
import { InlineFieldComponent } from './forms/inputs/inline-field/inline-field.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditInputComponent } from './forms/inputs/edit-input/edit-input.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BlockElementComponent } from './components/block-element/block-element.component';
import { DynamicValueComponent } from './forms/inputs/dynamic-value/dynamic-value.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    EditorsRoutingModule
  ],
  declarations: [
    BaseEditorComponent,
    FieldsEditorComponent,
    WireframeEditorComponent,
    InlineFieldComponent,
    EditInputComponent,
    AutofocusDirective,

    BlockElementComponent,
    DynamicValueComponent
  ],
  providers: [
    HtmlElementsService
  ],
  entryComponents: [InlineFieldComponent]
})
export class EditorsModule {}
