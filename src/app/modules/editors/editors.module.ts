import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './pages/base-editor/base-editor.component';
import { FieldsEditorComponent } from './pages/fields-editor/fields-editor.component';
import { WireframeEditorComponent } from './pages/wireframe-editor/wireframe-editor.component';
import { StylesEditorComponent } from './pages/styles-editor/styles-editor.component';
import { EditorsRoutingModule } from './editors-routing.module';
import { ElementDataService } from './services/element-data.service';
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
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { SassService } from './services/sass.service';
import { DynamicImgDirective } from './directives/dynamic-img.directive';
import { EditImageDialogComponent } from './components/dialog/edit-image-dialog/edit-image-dialog.component';
import { SharedModule } from '@shared/shared.module';

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
    SharedModule,
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
    // editors
    BaseEditorComponent,
    FieldsEditorComponent,
    WireframeEditorComponent,
    StylesEditorComponent,

    // monaco wrapper
    CodeEditorComponent,

    // directives
    AutofocusDirective,
    DynamicImgDirective,

    // other components
    InlineFieldComponent,
    EditInputComponent,
    BlockElementComponent,
    DynamicValueComponent,
    BlockThumbnailComponent,
    HelpEditorDialogComponent,
    EditImageDialogComponent
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
    HelpEditorDialogComponent,
    EditImageDialogComponent
  ]
})
export class EditorsModule {
}
