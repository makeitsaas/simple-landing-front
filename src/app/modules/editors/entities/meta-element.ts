/*

MetaElement Vs ElementData :
- ElementData : Pure API Resource (without transformation)
- MetaElement : A meta representation of element
    -> is always available
    -> its data might not be stored in API yet
    -> gathers all diff applied to an element
    -> has multiple actions available (migrate up/down, update, observe, ...)
    -> exposes subjects related to data changes
    -> can buffer actions (CRUD data)
    -> protects immutable data
    -> adapts default values (position, id, ...) for UI behavior

 */

import { ElementData, ElementDataInterface } from './element-data';
import { ElementDiff } from './element-diff';
import { MetaElementStore } from '../store/meta-element.store';

let nextLocalId = 1;

class FieldChange {
  key: string;
  value: any;
}

class TranslationChange {
  lang = 'en';
  key: string;
  value: any;
}

class LocationChange {
  newPosition?: number;
  newParent?: MetaElement;
}

interface TreeLocation {
  position: number;
  parentMetaElementId: number;
}

export class MetaElement {
  public localId = nextLocalId++;
  private currentLang = 'en';
  private saveReadyResolve: (value?: any) => void;

  data: ElementData;            // preferably immutable
  treeLocation: TreeLocation;   // because parent might not have a database id, we must link to MetaElement (which will always exist)
  storeDiffCallback: (ElementDiff) => void;
  private onSaveReady: Promise<any> = new Promise<any>(resolve => this.saveReadyResolve = resolve);

  constructor(data: ElementData | any = {type: 'block'}) {
    this.applyDataChange(data);
    setTimeout(() => {

    }, 10);
  }

  /*
    External setters
   */

  setRemoteDataResponse(data: ElementDataInterface) {
    this.applyDataChange(data);
  }

  setTreeLocation(parentMetaElement: MetaElement, position: number) {
    // if moved into same container at a greater position, index will have 1 more than expected
    // (Dnd displays item at its previous position, so there is one item more)
    const isPlacedAfterItself = this.treeLocation
                              && parentMetaElement.localId === this.treeLocation.parentMetaElementId
                              && position > this.treeLocation.position;
    const realPosition = isPlacedAfterItself ? (position - 1) : position;
    const diff = new ElementDiff({
      action: 'updateLocation',
      nextValue: {
        parentMetaElementId: parentMetaElement.localId,
        position: realPosition
      },
      previousValue: {      // reassign new object to avoid unexpected bindings
        ...this.treeLocation
      }
    });
    this.storeDiffCallback(diff);
  }

  setField(key: string, nextValue: any) {
    const diff = new ElementDiff({
      action: 'updateField',
      nextValue: {
        key,
        value: nextValue
      },
      previousValue: {
        key,
        value: this.data.fields[key]
      }
    });
    this.storeDiffCallback(diff);
  }

  setTranslation(key: string, value: string, currentLang: string = this.currentLang) {

  }

  setCleanedPosition(cleanPosition: number) {
    // sometime, we might have elements coming from API with same position value.
    // that's why we ensure, for better UX, that displayed position is applied to MetaElement
    if (!this.treeLocation && this.data.parent) {
      const metaParent = MetaElementStore.findMetaByElementById(this.data.parent.id);
      this.treeLocation = {
        position: this.data.position,
        parentMetaElementId: metaParent && metaParent.localId
      };
    }

    // reassign new object to avoid unexpected bindings
    this.treeLocation = {
      ...this.treeLocation,
      position: cleanPosition
    };
  }

  /*
    State control
   */
  usePreviousData(diff: ElementDiff) {
    switch (diff.action) {
      case 'updateField':
        this.applyFieldChange(diff.previousValue);
        break;
      case 'updateLocation':
        this.applyLocationChange(diff.previousValue);
        break;
    }
  }

  useNextData(diff: ElementDiff) {
    switch (diff.action) {
      case 'updateField':
        this.applyFieldChange(diff.nextValue);
        break;
      case 'updateLocation':
        this.applyLocationChange(diff.nextValue);
        break;
    }
  }

  /*
    Internal business logic
   */

  private applyDataChange(data: ElementData | any) {
    // check case we receive data but meanwhile, we've intentionally updated MetaElement
    // console.warn('Not implemented : MetaElement.updateData', data);
    if (data instanceof ElementData) {
      this.data = data;
    } else {
      this.data = new ElementData(data);
      if (this.data.parent) {
        // console.log('this element has initial parent', this.data.id);
      }
    }

    if (this.data.id) {
      this.saveReadyResolve();
    }
  }

  private applyFieldChange(diffRequest: FieldChange) {
    const mutableData = this.data.asObject();
    const previousValue = mutableData.fields[diffRequest.key];
    mutableData.fields[diffRequest.key] = diffRequest.value;
    this.applyDataChange(mutableData);
  }

  private applyLocationChange(diffRequest: TreeLocation) {
    this.treeLocation = diffRequest;
    const mutableData = this.data.asObject();
    mutableData.position = diffRequest.position;
    // we ignore mutableData.parent, because it is "treeLocation" that best reflects local relations
    this.applyDataChange(mutableData);
  }

  private saveFieldsAndTranslations() {

  }

  private saveLocation() {

  }

  refresh() {

  }
}
