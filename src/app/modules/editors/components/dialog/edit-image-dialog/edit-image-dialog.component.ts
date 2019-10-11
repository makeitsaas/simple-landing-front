import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MetaElement } from '../../../entities/meta-element';

interface EditImageInput {
  metaElement: MetaElement;
}

@Component({
  templateUrl: './edit-image-dialog.component.html'
})
export class EditImageDialogComponent implements OnInit {
  inputData: EditImageInput;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditImageInput
  ) {
    this.inputData = data;
  }

  ngOnInit() {
    console.log('data', this.inputData);
  }
}
