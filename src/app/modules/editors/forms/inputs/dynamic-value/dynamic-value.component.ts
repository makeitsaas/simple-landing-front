import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'dynamic-value',
  templateUrl: './dynamic-value.component.html'
})
export class DynamicValueComponent implements OnInit {

  @Input('id') dataId: string | number;
  @Input('code') dataCode: string;

  sampleModel = '';

  constructor(private el: ElementRef) {
  }

  ngOnInit() {

    this.sampleModel = this.el.nativeElement.textContent;
  }

  saveEditable(e: string) {
    console.log(`save element(${this.dataId})[${this.dataCode}]`, e);
  }

  onError() {
    console.log('error');
  }
}
