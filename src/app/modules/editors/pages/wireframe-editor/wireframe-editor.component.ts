import { Component, OnDestroy, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { MatSnackBar } from '@angular/material';
import { ElementDataService } from '../../services/element-data.service';
import {
  DndTreeService,
  DnDItem,
  DnDItemTemplate
} from '../../services/dnd-tree.service';
import { MetaElement } from '../../entities/meta-element';
import { MetaElementStoreService } from '../../services/meta-element-store.service';
import { EditorContextService } from '../../services/editor-context.service';
import { Subscription } from 'rxjs';

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
    content: 'Text only',
    type: 'block',
    children: [],
    fields: {},
  },
  {
    content: 'Text Image',
    type: 'block',
    children: [],
    settings: {blockType: 'text-image'},
  },
];

@Component({
  selector: 'wireframe-editor',
  templateUrl: './wireframe-editor.component.html',
  styleUrls: ['wireframe-editor.component.scss']
})
export class WireframeEditorComponent implements OnInit, OnDestroy {
  elementsTemplatesByCategory: { category: string, title: string, templates: DnDItemTemplate[] }[] = [
    {category: 'core', title: 'Structure templates', templates: templatesList.slice(0, 2)},
    {category: 'generic', title: 'Common templates', templates: templatesList.slice(2, 4)}
  ];
  pageTree: DnDItem;
  showTemplates = false;

  private currentDraggableEvent: DragEvent;
  private currentDragEffectMsg: string;
  private pageId;
  private currentDragItem: DnDItem | void;
  private subscriptions: Subscription[] = [];

  constructor(
    private snackBarService: MatSnackBar,
    private htmlElementsService: ElementDataService,
    private dndTreeService: DndTreeService,
    private metaElementStoreService: MetaElementStoreService,
    private editorContextService: EditorContextService
  ) {
  }

  ngOnInit() {
    this.metaElementStoreService.resetStore();

    this.pageId = this.editorContextService.getCurrentPageId();
    const s1 = this.dndTreeService.getPageTree(this.pageId).subscribe(pageTree => {
      this.pageTree = pageTree;
      this.dndTreeService.afterSetupCleanPositions(this.pageTree);
    });
    const s2 = this.metaElementStoreService.treeChange.subscribe(element => element && this.onElementLocation(element));

    this.subscriptions.push(s1, s2);
  }

  ngOnDestroy() {
    this.subscriptions.map((sub, i) => sub.unsubscribe());
  }

  toggleContainer(element: MetaElement) {
    console.log('toggleContainer was a demo feature, disabled now');
    // element.setField('container', element.data.fields.container === 'fluid' ? null : 'fluid');
  }

  toggleColumnsWidth(item: DnDItem) {
    item.children.forEach(child => child.cols = child.cols === 2 ? 6 : 2);
  }

  onDragStart(event: DragEvent, originalItem?: DnDItem) {
    this.currentDragItem = originalItem;
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;

    // this.snackBarService.dismiss();
    // this.snackBarService.open('Drag started!', undefined, {duration: 2000});
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
      this.dndTreeService.afterSetupCleanPositions(this.pageTree);
    }
  }

  onDragEnd(event: DragEvent, originalItem?: DnDItem) {
    this.currentDragItem = null;
    this.currentDraggableEvent = event;
    this.snackBarService.dismiss();
    this.snackBarService.open(this.currentDragEffectMsg || `Drag ended!`, undefined, {duration: 2000});
  }

  onDrop(event: DndDropEvent, list: DnDItem[]) {
    if (['copy', 'move'].indexOf(event.dropEffect) !== -1) {
      const index = isNaN(event.index) ? list.length : event.index;
      const clonedDnDItem: DnDItem = event.data;
      const boundDndItem = this.dndTreeService.bindMetaElement(clonedDnDItem);

      list.splice(index, 0, boundDndItem);

      // logical position, ignoring temporary or copied items
      const logicalPosition = list.slice(0, index).filter(item => {
        // console.log('item', item);
        return item.metaElement !== boundDndItem.metaElement;
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
    const {nestedItem, nestedParent: initialParent} = this.dndTreeService.findNestedItem(metaElement, this.pageTree, ignoreList);
    const hasParentChanged = !initialParent || initialParent.metaElement.localId !== metaElement.treeLocation.parentMetaElementId;
    const hasPositionChanged = !initialParent
      || !nestedItem
      || initialParent.children.indexOf(nestedItem) !== metaElement.treeLocation.position;

    if (hasParentChanged || hasPositionChanged) {
      console.log('onElementLocation => move element', metaElement.treeLocation, this.currentDragItem);
      const {nestedParent: newParent} = this.dndTreeService.moveElement(metaElement, this.pageTree);
      this.dndTreeService.afterSetupCleanPositions(newParent || initialParent);
    } else {
      console.log('onElementLocation => nothing to do', metaElement.treeLocation, this.currentDragItem);
      if (initialParent) {
        this.dndTreeService.afterSetupCleanPositions(initialParent);
      }
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
