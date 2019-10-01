import { Component, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { MatSnackBar } from '@angular/material';
import { HtmlElementDataService } from '../../services/html-element-data.service';
import { DndTreeService, NestableListItem } from '../../services/dnd-tree.service';

const columnTemplate: NestableListItem = {
  content: 'New Column',
  type: 'column',
  cols: 6,
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
  structure: NestableListItem;

  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;
  private pageId = '1';

  constructor(
    private snackBarService: MatSnackBar,
    private htmlElementsService: HtmlElementDataService,
    private dndTreeService: DndTreeService
  ) {
  }

  ngOnInit() {
    this.htmlElementsService.getPageStructure(this.pageId).subscribe(structure => {
      console.log('structure', structure);
      this.structure = structure;
      this.nestableList = structure.children;
    });
  }

  save() {
    console.log('save', this.nestableList);
    this.htmlElementsService.updateTree(this.pageId, this.structure);
  }

  editBack() {
    console.log('editBack');
  }

  editForward() {
    console.log('editForward');
  }

  triggerProgrammaticReordering() {
    console.log('programmatic reordering');
    this.dndTreeService.moveElement(this.nestableList[1].children[3].originalElement, this.nestableList[0].originalElement, this.structure);
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

    if (item.type === 'column') {
      if (item.cols) {
        classes[`col-md-${item.cols}`] = true;
      } else {
        classes['col-md-6'] = true;
      }

      // if (parentType === 'columns') {
      //   classes['col-md-6'] = true;
      // }
    }

    return Object.assign(commonClasses, classes);
  }

  getCommonChildCssClasses(parentType: string) {
    const classes: { [key: string]: boolean } = {};

    classes.element = true;

    if (parentType === 'section') {
      classes.container = true;
    }

    return classes;
  }

  shuttleColumnsWidth(item: NestableListItem) {
    console.log('shuttle');
    item.children.forEach(child => child.cols = child.cols === 2 ? 6 : 2);
  }
}
