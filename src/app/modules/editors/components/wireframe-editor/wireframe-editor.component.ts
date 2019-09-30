import { Component, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { MatSnackBar } from '@angular/material';
import { HtmlElementInterface, HtmlElementsService } from '../../services/html-elements.service';

export interface NestableListItem {
  content: string;
  type: string;
  originalElement?: HtmlElementInterface;
  cssClasses?: string;
  disable?: boolean;
  handle?: boolean;
  customDragImage?: boolean;
  children?: NestableListItem[];
}

const columnTemplate: NestableListItem = {
  content: 'New Column',
  type: 'column',
  children: []
};

@Component({
  selector: 'wireframe-editor',
  templateUrl: './wireframe-editor.component.html',
  styleUrls: ['wireframe-editor.component.scss']
})
export class WireframeEditorComponent implements OnInit {
  store: NestableListItem[] = [
    {
      content: 'New Section',
      type: 'section',
      children: []
    },
    {
      content: 'New Columns Group',
      type: 'columns',
      children: [columnTemplate, columnTemplate]
    },
    {
      content: 'New block',
      type: 'block',
      children: []
    }
  ];
  nestableList: NestableListItem[] = [];

  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;

  constructor(
    private snackBarService: MatSnackBar,
    private htmlElementsService: HtmlElementsService
  ) {
  }

  ngOnInit() {
    this.htmlElementsService.getPageStructure('1').subscribe(structure => {
      console.log('structure', structure);
      this.nestableList = structure.children;
    });
  }

  onDragStart(event: DragEvent) {
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;

    this.snackBarService.dismiss();
    this.snackBarService.open('Drag started!', undefined, {duration: 2000});
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

    if (effect === 'move') {

      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent) {
    this.currentDraggableEvent = event;
    this.snackBarService.dismiss();
    this.snackBarService.open(this.currentDragEffectMsg || `Drag ended!`, undefined, {duration: 2000});
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list
      && (event.dropEffect === 'copy'
        || event.dropEffect === 'move')) {

      let index = event.index;

      if (typeof index === 'undefined') {

        index = list.length;
      }

      list.splice(index, 0, event.data);
    }
  }

  getAcceptableChildrenTypes(item: NestableListItem) {
    return this.htmlElementsService.getAcceptableChildrenTypes(item.type);
  }

  getElementCssClasses(item: NestableListItem, parentType: string) {
    const classes: { [key: string]: boolean } = {};
    const commonClasses = this.getCommonChildCssClasses(parentType);

    if (item.cssClasses) {
      const classNames = item.cssClasses.split(' ');
      classNames.forEach(className => classes[className] = true);
    } else {
      classes[`element-${item.type}`] = true;
    }

    return Object.assign(commonClasses, classes);
  }

  getCommonChildCssClasses(parentType: string) {
    const classes: { [key: string]: boolean } = {};

    classes.element = true;

    if (parentType === 'section') {
      classes.container = true;
    }

    if (parentType === 'columns') {
      classes['col-md-6'] = true;
    }

    return classes;
  }
}
