import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaFile, UploadService } from '../../services/upload.service';

interface FileToUpload {  // possible model for progress management
  inputFile: File;
  progress: number;
  media?: MediaFile;
  error?: any;
}

@Component({
  selector: 'app-shared-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.scss']
})
export class UploadAreaComponent {

  @Input() valid: boolean;
  @Output() validChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() files: File[] = [];
  @Output() filesChange: EventEmitter<File[]> = new EventEmitter<File[]>();

  @Input() medias: MediaFile[] = [];
  @Output() mediasChange: EventEmitter<MediaFile[]> = new EventEmitter<MediaFile[]>();

  filesToUpload: File[];

  constructor(private uploadService: UploadService) {
  }

  onInputFiles(files: FileList) {
    this.filesToUpload = Array.from(files);
    this.filesChange.emit(this.filesToUpload);
    this.validChange.emit(this.filesToUpload.length > 0);
    this.uploadFiles();
  }

  uploadFiles() {
    this.uploadService.postFile(this.filesToUpload).subscribe(uploadedFiles => {
      // do something, if upload success
      console.log('the data', uploadedFiles);
      this.mediasChange.emit(uploadedFiles);
    }, error => {
      console.log(error);
      this.mediasChange.emit([]);
    });
  }
}
