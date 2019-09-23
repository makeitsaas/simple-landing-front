import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BaseEditorComponent } from './components/base-editor/base-editor.component';

const editorsRoutes: Routes = [
  { path: 'editors', component: BaseEditorComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(editorsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditorsRoutingModule { }
