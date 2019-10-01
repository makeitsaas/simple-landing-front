import { Injectable } from '@angular/core';
import { ElementDataInterface } from '../entities/element-data';

interface ElementNestedLocation {
  nestedItem?: NestableListItem;
  nestedParent?: NestableListItem;
}

export interface NestableListItem {
  content: string;
  type: string;
  cols?: number;
  originalElement?: ElementDataInterface;
  cssClasses?: string;
  disable?: boolean;
  handle?: boolean;
  customDragImage?: boolean;
  children?: NestableListItem[];
}

@Injectable()
export class DndTreeService {
  moveElement(element: ElementDataInterface, newParentElement: ElementDataInterface, newPosition: number, tree: NestableListItem) {
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

  findAndRemoveNestedItem(element: ElementDataInterface, tree: NestableListItem): NestableListItem | void {
    const {nestedItem, nestedParent} = this.findNestedItem(element, tree);
    if (nestedItem && nestedParent) {
      const index = nestedParent.children.indexOf(nestedItem);
      return nestedParent.children.splice(index, 1)[0];
    }
  }

  findNestedItem(element: ElementDataInterface, tree: NestableListItem): ElementNestedLocation {
    for (const child of tree.children) {
      if (child.originalElement === element) {
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

  placeElement(nestedItem: NestableListItem, nestedParent: NestableListItem, position: number) {
    nestedParent.children.splice(position, 0, nestedItem);
  }
}
