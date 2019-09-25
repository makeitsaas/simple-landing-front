import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './components/base-editor/base-editor.component';
import { WireframeEditorComponent } from './components/wireframe-editor/wireframe-editor.component';
import { FieldsEditorComponent } from './components/fields-editor/fields-editor.component';

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
