import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MetaElement } from '../../../entities/meta-element';
import { MediaFile } from '@shared/modules/upload/services/upload.service';

interface EditImageInput {
  metaElement: MetaElement;
}

type EditImageDialogOutput = MediaFile | void;
export type EditImageDialogRef = MatDialogRef<EditImageDialogComponent, EditImageDialogOutput>;

@Component({
  templateUrl: './edit-image-dialog.component.html'
})
export class EditImageDialogComponent implements OnInit {
  inputData: EditImageInput;
  valid = false;
  files: File[] = [];
  medias: MediaFile[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditImageDialogComponent, EditImageDialogOutput>,
    @Inject(MAT_DIALOG_DATA) public data: EditImageInput
  ) {
    this.inputData = data;
  }

  ngOnInit() {
    console.log('data', this.inputData);
  }

  done() {
    this.dialogRef.close(this.medias[0]);
  }
}
