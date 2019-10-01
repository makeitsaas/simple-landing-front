import { Component, OnInit } from '@angular/core';
import { ElementDataService } from '../../services/element-data.service';

@Component({
  templateUrl: './base-editor.component.html',
  styleUrls: ['./base-editor.component.scss']
})
export class BaseEditorComponent implements OnInit {
  constructor(private htmlElementsService: ElementDataService) {
  }

  ngOnInit() {
    this.htmlElementsService.getPageElements('1').subscribe((elements: any[]) => {
      console.log('elements', elements);
    });
  }

}
