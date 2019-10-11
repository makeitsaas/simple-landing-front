import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[dynamic-img]',
})
export class DynamicImgDirective implements OnInit {

  @Input('id') dataId: string | number;
  @Input('media-index') dataMediaIndex: number;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('click') onClick() {
    console.log('data id', this.dataId, this.dataMediaIndex);
  }

  ngOnInit(): void {
    console.log('img');
  }
}
