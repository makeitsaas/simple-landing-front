import { Component, OnInit } from '@angular/core';
import { HtmlElementsService } from '../../services/html-elements.service';

@Component({
  templateUrl: './base-editor.component.html',
  styleUrls: ['./base-editor.component.scss']
})
export class BaseEditorComponent implements OnInit {
  constructor(private htmlElementsService: HtmlElementsService) {
  }

  ngOnInit() {
    this.htmlElementsService.getPageElements('1').subscribe((elements: any[]) => {
      console.log('elements', elements);
    });
  }

}
