import { Component, OnInit } from '@angular/core';
import { HtmlElementDataService } from '../../services/html-element-data.service';

@Component({
  templateUrl: './base-editor.component.html',
  styleUrls: ['./base-editor.component.scss']
})
export class BaseEditorComponent implements OnInit {
  constructor(private htmlElementsService: HtmlElementDataService) {
  }

  ngOnInit() {
    this.htmlElementsService.getPageElements('1').subscribe((elements: any[]) => {
      console.log('elements', elements);
    });
  }

}
