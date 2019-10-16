import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './pages/base-editor/base-editor.component';
import { WireframeEditorComponent } from './pages/wireframe-editor/wireframe-editor.component';
import { FieldsEditorComponent } from './pages/fields-editor/fields-editor.component';
import { StylesEditorComponent } from './pages/styles-editor/styles-editor.component';

const editorsRoutes: Routes = [
  {
    path: 'editors',
    component: BaseEditorComponent,
    children: [
      {
        path: 'wireframe',
        component: WireframeEditorComponent
      },
      {
        path: 'fields',
        component: FieldsEditorComponent
      },
      {
        path: 'styles',
        component: StylesEditorComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(editorsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditorsRoutingModule {
}
