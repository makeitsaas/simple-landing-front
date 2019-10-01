import { Component, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { MatSnackBar } from '@angular/material';
import { ElementDataService } from '../../services/element-data.service';
import {
  DndTreeService,
  DnDItem,
  DnDItemTemplate
} from '../../services/dnd-tree.service';
import { ElementDataInterface } from '../../entities/element-data';
import { MetaElement } from '../../entities/meta-element';
import { MetaElementStore } from '../../services/meta-element.store';

// est-ce que c'était une bonne idée de passer l'interface en classe ? put**n
const columnTemplate: DnDItemTemplate = {
  content: 'New Column',
  type: 'column',
  cols: 6,
  children: []
};

const templatesList: DnDItemTemplate[] = [
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
  },
];

@Component({
  selector: 'wireframe-editor',
  templateUrl: './wireframe-editor.component.html',
  styleUrls: ['wireframe-editor.component.scss']
})
export class WireframeEditorComponent implements OnInit {
  store: DnDItemTemplate[] = templatesList;
  pageTree: DnDItem;

  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;
  private pageId = '1';

  constructor(
    private snackBarService: MatSnackBar,
    private htmlElementsService: ElementDataService,
    private dndTreeService: DndTreeService,
    private metaElementStore: MetaElementStore
  ) {
  }

  ngOnInit() {
    this.dndTreeService.getPageTree(this.pageId).subscribe(pageTree => {
      console.log('pageTree', pageTree);
      this.pageTree = pageTree;
    });
  }

  save() {
    console.log('save', this.pageTree.children);
    this.htmlElementsService.updateTree(this.pageId, this.pageTree);
  }

  editBack() {
    console.log('editBack');
  }

  editForward() {
    console.log('editForward');
  }

  triggerProgrammaticReordering() {
    const el = this.pageTree.children[1].children[3].metaElement;
    const newParent = this.pageTree.children[0].metaElement;
    const newPosition = 1;
    this.dndTreeService.moveElement(el, newParent, newPosition, this.pageTree);
  }

  toggleContainer(element: MetaElement) {
    if (element) {
      alert('todo : update using reactive programming');
      // element.fields.container = element.fields.container === 'fluid' ? null : 'fluid';
    }
  }

  toggleColumnsWidth(item: DnDItem) {
    item.children.forEach(child => child.cols = child.cols === 2 ? 6 : 2);
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
    console.log('onDrop', 1);
    if (list
      && (event.dropEffect === 'copy'
        || event.dropEffect === 'move')) {

      console.log('onDrop', 2);
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }

      console.log(event.data);

      const newItem: DnDItem = event.data;
      if (!newItem.metaElement) {
        newItem.metaElement = this.metaElementStore.getNewMetaElement(event.data);
        if (event.data.children) {
          newItem.children = event.data.children.map(child => {
            return {
              ...child,
              metaElement: this.metaElementStore.getNewMetaElement(child)
            };
          });
        }
      }

      list.splice(index, 0, newItem);
    }
  }

  getAcceptableChildrenTypes(item: DnDItem) {
    return this.htmlElementsService.getAcceptableChildrenTypes(item.type);
  }

  getElementCssClasses(item: DnDItem, parentType: string) {
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
      if (item.metaElement.data.fields.container === 'fluid') {
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
}
