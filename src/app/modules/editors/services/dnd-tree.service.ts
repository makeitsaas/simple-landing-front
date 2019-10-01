import { Injectable } from '@angular/core';
import { ElementDataInterface } from '../entities/element-data';
import { MetaElement } from '../entities/meta-element';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetaElementStore } from './meta-element.store';

const HTML_CALL_LIMIT = 10000;

interface ElementNestedLocation {
  nestedItem?: DnDItem;
  nestedParent?: DnDItem;
}

export interface DnDItem {
  content: string;
  type: string;
  cols?: number;
  metaElement: MetaElement;
  cssClasses?: string;
  disable?: boolean;
  handle?: boolean;
  customDragImage?: boolean;
  children?: DnDItem[];
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
    private metaElementStore: MetaElementStore
  ) {
  }

  /*

    Public Methods

   */

  getPageTree(pageId: string): Observable<DnDItem> {
    return this.metaElementStore.getPageMetaElements(pageId).pipe(map((elements: MetaElement[]) => {
      const pageElement = elements.filter(el => el.data.type === 'page')[0];
      const dragPageTree = this.populateAsDraggableChildren(pageElement, elements);

      return dragPageTree;
    }));
  }

  /*

    Private Methods

   */

  private populateAsDraggableChildren(element: MetaElement, elements: MetaElement[]): DnDItem {

    const dragItem: any = this.transformElementAsDraggable(element);
    dragItem.children = elements
      .filter(el => el.data.parent && el.data.parent.id === element.data.id)
      .map(child => this.populateAsDraggableChildren(child, elements));

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

  moveElement(element: MetaElement, newParentElement: MetaElement, newPosition: number, tree: DnDItem) {
    const parentLocation = this.findNestedItem(newParentElement, tree);
    const newNestedParent = parentLocation.nestedItem;

    if (!newNestedParent) {
      throw new Error('new parent cannot be found');
    }

    const nestedItem = this.findAndRemoveNestedItem(element, tree);

    if (!nestedItem) {
      throw new Error('element cannot be found');
    }

    this.placeElement(nestedItem, newNestedParent, newPosition);
  }

  findAndRemoveNestedItem(element: MetaElement, tree: DnDItem): DnDItem | void {
    const {nestedItem, nestedParent} = this.findNestedItem(element, tree);
    if (nestedItem && nestedParent) {
      const index = nestedParent.children.indexOf(nestedItem);
      return nestedParent.children.splice(index, 1)[0];
    }
  }

  findNestedItem(element: MetaElement, tree: DnDItem): ElementNestedLocation {
    for (const child of tree.children) {
      if (child.metaElement === element) {
        // const index = tree.children.indexOf(child);
        return {
          nestedItem: child,
          nestedParent: tree
        };
      } else {
        const nestedLocation = this.findNestedItem(element, child);

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
}
