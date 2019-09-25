import { Component } from '@angular/core';

// DEPRECATED
@Component({
  selector: 'app-inline-field',
  templateUrl: './inline-field.component.html'
})
export class InlineFieldComponent {
  sampleModel = 'My text';

  saveEditable(e: string) {

  }

  onError() {
    console.log('error');
  }
}
