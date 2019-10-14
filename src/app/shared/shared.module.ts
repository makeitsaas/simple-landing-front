import { NgModule } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { UploadModule } from './modules/upload/upload.module';
import { UploadAreaComponent } from './modules/upload/components/upload-area/upload-area.component';

@NgModule({
  imports: [
    CommonModule,
    UploadModule
  ],
  declarations: [
    LoaderComponent
  ],
  exports: [
    LoaderComponent,
    UploadAreaComponent
  ]
})
export class SharedModule {}
