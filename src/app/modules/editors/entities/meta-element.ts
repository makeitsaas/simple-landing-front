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
import { ElementDataDiff } from './element-data-diff';
import { MetaElementStore } from '../store/meta-element.store';
import { DiffEntry } from '../services/meta-element-store.service';

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

export interface TreeLocation {
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
  onSaveReady: Promise<any> = new Promise<any>(resolve => this.saveReadyResolve = resolve);
  isNewElement = false;

  constructor(data: ElementData | any = {type: 'block'}) {
    this.applyDataChange(data);
  }

  /*
    External setters
   */

  setRemoteDataResponse(data: ElementDataInterface, diffSinceRequest: DiffEntry[]) {
    this.applyDataChange(data);
    console.log('diff since request', diffSinceRequest);
  }

  setTreeLocation(parentMetaElement: MetaElement, position: number) {
    // Position has to be the index in parent.children where this element has to be placed.
    // The tree must not have any DnDItem instance of this element (otherwise we might have a bias
    // when element is moved inside the same parent at a greater position).
    // This precaution has to be made earlier, not here.
    // Move element = 1.remove + 2.insert
    const diff = new ElementDataDiff({
      action: 'updateLocation',
      nextValue: {
        parentMetaElementId: parentMetaElement.localId,
        position
      },
      previousValue: {      // reassign new object to avoid unexpected bindings
        ...this.treeLocation
      }
    });
    console.log('previous', this.treeLocation, JSON.stringify(this.treeLocation));
    this.storeDiffCallback(diff);
  }

  setField(key: string, nextValue: any) {
    const diff = new ElementDataDiff({
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

    if (nextValue !== this.data.fields[key]) {
      this.storeDiffCallback(diff);
    }
  }

  setTranslation(key: string, value: string, currentLang: string = this.currentLang) {

  }

  setCleanedPosition(cleanPosition: number, parentMetaElementId: number) {
    // sometime, we might have elements coming from API with same position value.
    // that's why we ensure, for better UX, that displayed position is applied to MetaElement

    // NOTE : reassign new object to avoid unexpected bindings
    this.treeLocation = {
      position: cleanPosition,
      parentMetaElementId
    };
  }

  /*
    State control
   */
  usePreviousData(diff: ElementDataDiff) {
    switch (diff.action) {
      case 'updateField':
        this.applyFieldChange(diff.previousValue);
        break;
      case 'updateLocation':
        this.applyLocationChange(diff.previousValue);
        break;
    }
  }

  useNextData(diff: ElementDataDiff) {
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
    } else {
      this.isNewElement = true;
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
