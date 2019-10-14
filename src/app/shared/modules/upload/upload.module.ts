import { NgModule } from '@angular/core';
import { UploadAreaComponent } from './components/upload-area/upload-area.component';
import { UploadService } from './services/upload.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UploadAreaComponent
  ],
  providers: [
    UploadService
  ],
  exports: [
    UploadAreaComponent
  ]
})
export class UploadModule {}
