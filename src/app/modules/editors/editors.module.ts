import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './components/base-editor/base-editor.component';
import { EditorsRoutingModule } from './editors-routing.module';
import { ElementDataService } from './services/element-data.service';
import { FieldsEditorComponent } from './components/fields-editor/fields-editor.component';
import { WireframeEditorComponent } from './components/wireframe-editor/wireframe-editor.component';
import { InlineFieldComponent } from './forms/inputs/inline-field/inline-field.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditInputComponent } from './forms/inputs/edit-input/edit-input.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BlockElementComponent } from './components/block-element/block-element.component';
import { DynamicValueComponent } from './forms/inputs/dynamic-value/dynamic-value.component';
import { DndModule } from 'ngx-drag-drop';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatSidenavModule,
  MatSnackBarModule
} from '@angular/material';
import { BlockThumbnailComponent } from './components/block-thumbnail/block-thumbnail.component';
import { DndTreeService } from './services/dnd-tree.service';
import { MetaElementStoreService } from './services/meta-element-store.service';
import { EditorContextService } from './services/editor-context.service';
import { HelpEditorDialogComponent } from './components/dialog/help-editor-dialog/help-editor-dialog.component';
import { StylesEditorComponent } from './components/styles-editor/styles-editor.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { SassService } from './services/sass.service';

const monacoConfig: NgxMonacoEditorConfig = {
  defaultOptions: {
    scrollBeyondLastLine: false,
    scrollbar: {
      verticalScrollbarSize: '10px'
    },
    minimap: {
      enabled: false
    }
  }, // pass default options to be used
  onMonacoLoad: () => {
    // console.log((<any> window).monaco);
  }
};

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    EditorsRoutingModule,
    DndModule,
    MonacoEditorModule.forRoot(monacoConfig),

    /* Material Modules */
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSidenavModule,
  ],
  declarations: [
    BaseEditorComponent,
    FieldsEditorComponent,
    WireframeEditorComponent,
    StylesEditorComponent,

    CodeEditorComponent,

    InlineFieldComponent,
    EditInputComponent,
    AutofocusDirective,
    BlockElementComponent,
    DynamicValueComponent,
    BlockThumbnailComponent,
    HelpEditorDialogComponent
  ],
  providers: [
    ElementDataService,
    DndTreeService,
    MetaElementStoreService,
    EditorContextService,
    SassService
  ],
  entryComponents: [
    InlineFieldComponent,
    HelpEditorDialogComponent
  ]
})
export class EditorsModule {
}
