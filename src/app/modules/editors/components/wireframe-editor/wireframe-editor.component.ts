import { Component, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { MatSnackBar } from '@angular/material';
import { ElementDataService } from '../../services/element-data.service';
import { DndTreeService, NestableListItem } from '../../services/dnd-tree.service';
import { ElementDataInterface } from '../../entities/element-data';

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
      content: 'Section',
      type: 'section',
      children: []
    },
    {
      content: 'Columns',
      type: 'columns',
      children: [columnTemplate, columnTemplate]
    },
    {
      content: 'Block',
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
    private htmlElementsService: ElementDataService,
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
    const el = this.nestableList[1].children[3].originalElement;
    const newParent = this.nestableList[0].originalElement;
    const newPosition = 1;
    this.dndTreeService.moveElement(el, newParent, newPosition, this.structure);
  }

  toggleContainer(element: ElementDataInterface) {
    if (element) {
      element.fields.container = element.fields.container === 'fluid' ? null : 'fluid';
    }
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
    }

    if (parentType === 'section') {
      if (item.originalElement && item.originalElement.fields.container === 'fluid') {
        classes['container-fluid'] = true;
      } else {
        classes.container = true;
      }
    }

    return Object.assign(commonClasses, classes);
  }

  getCommonChildCssClasses(parentType: string) {
    const classes: { [key: string]: boolean } = {};

    classes.element = true;

    return classes;
  }

  shuttleColumnsWidth(item: NestableListItem) {
    item.children.forEach(child => child.cols = child.cols === 2 ? 6 : 2);
  }
}
