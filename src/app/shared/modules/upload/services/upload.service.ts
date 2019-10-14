import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface UploadFileResponse {
  message: string;
  files: MediaFile[];
}

export interface MediaFile {
  uuid: string;
  relativeUrl: string;
  absoluteUrl: string;
  originalKey: string;
}

@Injectable()
export class UploadService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  postFile(filesToUpload: File[] | File | {[key: string]: File}): Observable<MediaFile[]> {
    const endPoint = 'http://localhost:3006/upload';  // todo : get from environment or discovery
    const formData: FormData = new FormData();
    if (filesToUpload instanceof File) {
      formData.append('file-0', filesToUpload, filesToUpload.name);
    } else {
      for (const key in filesToUpload) {
        if (filesToUpload.hasOwnProperty(key)) {
          formData.append(`file-${key}`, filesToUpload[key], filesToUpload[key].name);
        }
      }
    }
    formData.append('username', 'Duwab');
    return this.httpClient
      .post(endPoint, formData).pipe(map((response: UploadFileResponse) => {
        return response.files;
      }));
  }
}
