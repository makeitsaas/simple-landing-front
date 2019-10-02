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
import { MetaElementStoreService } from '../../services/meta-element-store.service';
import { Observable } from 'rxjs';

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
  itemTemplates: DnDItemTemplate[] = templatesList;
  pageTree: DnDItem;

  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;
  private pageId = '1';
  private watchers: { [key: number]: Observable<any> } = {};
  private currentDragItem: DnDItem | void;
  canGoPrev = false;
  canGoNext = false;

  constructor(
    private snackBarService: MatSnackBar,
    private htmlElementsService: ElementDataService,
    private dndTreeService: DndTreeService,
    private metaElementStore: MetaElementStoreService
  ) {
  }

  ngOnInit() {
    this.dndTreeService.getPageTree(this.pageId).subscribe(pageTree => {
      this.pageTree = pageTree;
      this.dndTreeService.afterSetupCleanPositions(this.pageTree);
    });
    this.metaElementStore.treeChange.subscribe(element => this.onElementLocation(element));
  }

  save() {
    console.log('save', this.pageTree.children);
    this.htmlElementsService.updateTree(this.pageId, this.pageTree);
  }

  editBack() {
    this.metaElementStore.goPrev();
    this.canGoPrev = this.metaElementStore.canGoPrev();
    this.canGoNext = this.metaElementStore.canGoNext();
  }

  editForward() {
    this.metaElementStore.goNext();
    this.canGoPrev = this.metaElementStore.canGoPrev();
    this.canGoNext = this.metaElementStore.canGoNext();
  }

  triggerProgrammaticAction() {
    console.log('nothing yet');
  }

  toggleContainer(element: MetaElement) {
    element.setField('container', element.data.fields.container === 'fluid' ? null : 'fluid');
  }

  toggleColumnsWidth(item: DnDItem) {
    item.children.forEach(child => child.cols = child.cols === 2 ? 6 : 2);
  }

  onDragStart(event: DragEvent, originalItem?: DnDItem) {
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;

    this.currentDragItem = originalItem;

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

  onDragEnd(event: DragEvent, originalItem?: DnDItem) {
    this.currentDragItem = null;
    this.currentDraggableEvent = event;
    this.snackBarService.dismiss();
    this.snackBarService.open(this.currentDragEffectMsg || `Drag ended!`, undefined, {duration: 2000});
  }

  onDrop(event: DndDropEvent, list: DnDItem[]) {
    console.log('onDrop');
    if (['copy', 'move'].indexOf(event.dropEffect) !== -1) {
      const index = isNaN(event.index) ? list.length : event.index;
      const clonedDnDItem: DnDItem = event.data;
      const boundDndItem = this.dndTreeService.bindMetaElement(clonedDnDItem);

      list.splice(index, 0, boundDndItem);

      // logical position, ignoring temporary or copied items
      const logicalPosition = list.slice(0, index).filter(item => {
        console.log('item', item);
        return true;
      }).length;

      // DnD Tree is changed, tell MetaElement he has changed position
      const ignoreList = this.currentDragItem ? [this.currentDragItem] : [];
      const {nestedItem, nestedParent} = this.dndTreeService.findNestedItem(boundDndItem.metaElement, this.pageTree, ignoreList);
      boundDndItem.metaElement.setTreeLocation(nestedParent.metaElement, logicalPosition);
      this.currentDragItem = null;
    }
  }

  onElementLocation(metaElement: MetaElement) {
    const ignoreList = this.currentDragItem ? [this.currentDragItem] : [];
    const {nestedItem, nestedParent} = this.dndTreeService.findNestedItem(metaElement, this.pageTree, ignoreList);
    const parentHasChanged = nestedParent.metaElement.localId !== metaElement.treeLocation.parentMetaElementId;
    const positionHasChanged = nestedParent.children.indexOf(nestedItem) !== metaElement.treeLocation.position;
    if (parentHasChanged || positionHasChanged) {
      console.log('onElementLocation => move element', metaElement.treeLocation, this.currentDragItem);
      this.dndTreeService.moveElement(metaElement, this.pageTree);
    } else {
      console.log('onElementLocation => nothing to do', metaElement.treeLocation, this.currentDragItem);
    }
    this.dndTreeService.afterSetupCleanPositions(nestedParent);
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
