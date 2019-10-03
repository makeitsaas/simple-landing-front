import { Component, OnInit } from '@angular/core';
import { ElementDataService } from '../../services/element-data.service';
import { EditorContextService } from '../../services/editor-context.service';

@Component({
  templateUrl: './base-editor.component.html',
  styleUrls: ['./base-editor.component.scss']
})
export class BaseEditorComponent implements OnInit {
  constructor(
    private htmlElementsService: ElementDataService,
    private editorContextService: EditorContextService
  ) {
  }

  ngOnInit() {
    const pageId = this.editorContextService.getCurrentPageId();
    this.htmlElementsService.getPageElements(pageId).subscribe((elements: any[]) => {
      console.log('elements', elements);
    });
  }

}
