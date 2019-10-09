import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { UploadedFile, UploadService } from '../../../../../shared/services/upload.service';

@Component({
  templateUrl: './account-settings-page.component.html',
  styleUrls: ['./account-settings-page.component.scss']
})
export class AccountSettingsPageComponent implements OnInit {

  somethingResponse: any;
  errorResponse: any;
  filesToUpload: File[];
  uploadedFiles: UploadedFile[]|void;

  constructor(
    private settingsService: SettingsService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.settingsService.getSomething().subscribe(something => {
      this.somethingResponse = something;
    }, error => {
      this.errorResponse = error;
    });
  }

  handleFileInput(files: FileList) {
    this.filesToUpload = Array.from(files);
  }

  uploadFileToActivity() {
    this.uploadService.postFile(this.filesToUpload).subscribe(uploadedFiles => {
      // do something, if upload success
      console.log('the data', uploadedFiles);
      this.uploadedFiles = uploadedFiles;
    }, error => {
      console.log(error);
      delete this.uploadedFiles;
    });
  }
}
