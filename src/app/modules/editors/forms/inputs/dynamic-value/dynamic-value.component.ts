import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ElementDataService } from '../../../services/element-data.service';

@Component({
  selector: 'dynamic-value',
  templateUrl: './dynamic-value.component.html'
})
export class DynamicValueComponent implements OnInit {

  @Input('id') dataId: string | number;
  @Input('code') dataCode: string;

  sampleModel = '';

  constructor(
    private el: ElementRef,
    private htmlElementsService: ElementDataService
  ) {
  }

  ngOnInit() {
    this.sampleModel = this.el.nativeElement.textContent;
  }

  saveEditable(newValue: string) {
    // console.log(`save element(${this.dataId})[${this.dataCode}]`, newValue);
    this.sampleModel = newValue;
    const putOptions = this.assignDotKey({}, this.dataCode, newValue);
    this.htmlElementsService.updateElement(this.dataId, putOptions)
      .subscribe(() => console.log('success'), err => this.onError(err));
  }

  onError(err?: Error) {
    console.log('dynamic value error', err);
  }

  assignDotKey(obj, dotKey, value) {
    const keys = dotKey.split('.');
    const first = keys.shift();

    if (first) {
      if (keys.length) {
        obj[first] = this.assignDotKey(obj[first] || {}, keys.join('.'), value);
      } else {
        obj[first] = value;
      }
    }


    return obj;
  }
}
