import { NgModule } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { UploadService } from './services/upload.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoaderComponent
  ],
  providers: [
    UploadService
  ],
  exports: [
    LoaderComponent
  ]
})
export class SharedModule {}
