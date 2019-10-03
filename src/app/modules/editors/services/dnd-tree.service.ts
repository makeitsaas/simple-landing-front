import { Injectable } from '@angular/core';
import { MetaElement } from '../entities/meta-element';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetaElementStoreService } from './meta-element-store.service';
import { MetaElementStore } from '../store/meta-element.store';
import { EditorContextService } from './editor-context.service';

const HTML_CALL_LIMIT = 10000;

interface ElementNestedLocation {
  nestedItem?: DnDItem;
  nestedParent?: DnDItem;
}

export interface DnDItem {
  // primary dnd features
  children?: DnDItem[];       // nested relations
  metaElement: MetaElement;   // real content

  // secondary dnd features
  disable?: boolean;
  handle?: boolean;
  customDragImage?: boolean;

  // convenience display features
  content: string;            // short name
  type: string;               // display type

  // unnecessary display features (see metaElement)
  cols?: number;
  cssClasses?: string;
}

export interface DnDItemTemplate {
  content: string;
  type: string;
  cols?: number;
  children: DnDItemTemplate[];
}

@Injectable()
export class DndTreeService {

  private htmlCallCount = 0;

  constructor(
    private metaElementStoreService: MetaElementStoreService
  ) {
  }

  /*

    Public Methods

   */

  getPageTree(pageId: string): Observable<DnDItem> {
    return this.metaElementStoreService.getPageMetaElements(pageId).pipe(map((elements: MetaElement[]) => {
      const pageElement = elements.filter(el => el.data.type === 'page')[0];
      const dragPageTree = this.populateAsDraggableChildren(pageElement, elements);

      return dragPageTree;
    }));
  }

  moveElement(element: MetaElement, tree: DnDItem) {
    const targetParentElement = MetaElementStore.findMetaByLocalId(element.treeLocation.parentMetaElementId);
    const newPosition = element.treeLocation.position;

    if (!targetParentElement) {
      throw new Error('no parent');
    }

    // const targetParentItem = this.findNestedItem(targetParentElement, tree);
    // const targetParentDnDItem = targetParentItem.nestedItem;

    const {nestedItem: targetParentDnDItem} = this.findNestedItem(targetParentElement, tree);

    if (!targetParentDnDItem) {
      console.log('target parent MetaElement', targetParentElement);
      throw new Error('new parent cannot be found');
    }

    const nestedItem = this.findAndRemoveNestedItem(element, tree);

    if (!nestedItem) {
      throw new Error('element cannot be found');
    }

    this.placeElement(nestedItem, targetParentDnDItem, newPosition);
  }

  findAndRemoveNestedItem(element: MetaElement, tree: DnDItem): DnDItem | void {
    const {nestedItem, nestedParent} = this.findNestedItem(element, tree);
    if (nestedItem && nestedParent) {
      const index = nestedParent.children.indexOf(nestedItem);
      console.log('splice', nestedParent, index);
      return nestedParent.children.splice(index, 1)[0];
    }
  }

  findNestedItem(element: MetaElement, tree: DnDItem, ignoreList: DnDItem[] = []): ElementNestedLocation {
    if (tree.metaElement === element && ignoreList.indexOf(tree) === -1) {
      return {
        nestedItem: tree,
        nestedParent: null
      };
    }

    for (const child of tree.children) {
      if ((child.metaElement === element) && (ignoreList.indexOf(child) === -1)) {
        return {
          nestedItem: child,
          nestedParent: tree
        };
      } else {
        const nestedLocation = this.findNestedItem(element, child, ignoreList);

        if (nestedLocation && nestedLocation.nestedItem) {
          return nestedLocation;
        }
      }
    }

    return {};
  }

  placeElement(nestedItem: DnDItem, nestedParent: DnDItem, position: number) {
    nestedParent.children.splice(position, 0, nestedItem);
  }

  bindMetaElement(dndItem: any): DnDItem {
    if (!dndItem.metaElement) {
      // item comes from a DndItemTemplate => create new MetaElements for it and its children
      dndItem.metaElement = this.metaElementStoreService.getNewMetaElement(dndItem);

    } else if (!(dndItem.metaElement instanceof MetaElement)) {
      // item comes from a DnDItem, but has been cloned => rebind recursively MetaElements
      dndItem.metaElement = MetaElementStore.findMetaByLocalId(dndItem.metaElement.localId);
    }

    dndItem.children = dndItem.children.map(child => this.bindMetaElement(child));
    this.afterSetupCleanPositions(dndItem);

    return dndItem;
  }

  afterSetupCleanPositions(tree: DnDItem) {
    tree.children.map((child, i) => {
      child.metaElement.setCleanedPosition(i, tree.metaElement.localId);
      this.afterSetupCleanPositions(child);
    });
  }

  /*

    Private Methods

   */

  private populateAsDraggableChildren(element: MetaElement, elements: MetaElement[]): DnDItem {
    const dragItem: any = this.transformElementAsDraggable(element);
    dragItem.children = elements
      .filter(el => el.data.parent && el.data.parent.id === element.data.id)
      .map(child => this.populateAsDraggableChildren(child, elements))
      .sort((child1, child2) => {
        // metaElement.treeLocation might not be set yet, because tree hasn't been displayed
        const pos1 = child1.metaElement.data.position || 0;
        const pos2 = child2.metaElement.data.position || 0;
        if (pos1 === pos2) {
          return 0;
        } else {
          return pos1 > pos2 ? 1 : -1;
        }
      });

    this.incHtmlCallCount();

    return dragItem;
  }

  private transformElementAsDraggable(element: MetaElement): DnDItem {
    return {
      content: 'something',
      cssClasses: `element-${element.data.type}`,
      type: element.data.type,
      metaElement: element
    };
  }

  private incHtmlCallCount(): void {
    this.htmlCallCount++;

    if (this.htmlCallCount > HTML_CALL_LIMIT) {
      throw new Error('too many html calls (probably a recursive error)');
    }
  }
}
