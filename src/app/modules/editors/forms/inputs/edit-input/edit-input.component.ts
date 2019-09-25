import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-input',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss'],
})
export class EditInputComponent implements OnInit {
  @Input() data: string;
  @Output() focusOut: EventEmitter<string> = new EventEmitter<string>();
  editMode = false;
  dataModel: string;

  constructor() {
  }

  ngOnInit() {
  }

  edit() {
    this.dataModel = `${this.data || ''}`;
    this.editMode = true;
  }

  cancel() {
    this.dataModel = `${this.data || ''}`;
    this.editMode = false;
  }

  submit() {
    this.focusOut.emit(this.dataModel);
    this.editMode = false;
  }
}
