import { Component } from '@angular/core';

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
