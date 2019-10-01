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

import { ElementData } from './element-data';
import { BehaviorSubject, Observable } from 'rxjs';

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

export class MetaElement {
  private currentLang = 'en';
  private locationChangeSubject = new BehaviorSubject<LocationChange>(null);
  private fieldChangeSubject = new BehaviorSubject<FieldChange>(null);
  private translationChangeSubject = new BehaviorSubject<TranslationChange>(null);

  data: ElementData;  // preferably immutable
  onLocationChange: Observable<LocationChange> = this.locationChangeSubject.asObservable();
  onFieldChange: Observable<FieldChange> = this.fieldChangeSubject.asObservable();
  onTranslationChange: Observable<TranslationChange> = this.translationChangeSubject.asObservable();

  constructor(data: ElementData | any = {}) {
    if (data instanceof ElementData) {
      this.data = data;
    } else {
      this.data = new ElementData(data);
      if (this.data.parent) {
        console.log('this element has initial parent', this.data.id);
      }
    }
  }

  /*
    External setters
   */
  setTreeLocation(parent: MetaElement, position: number) {

  }

  setField(key: string, value: any) {

  }

  setTranslation(key: string, value: string, currentLang: string = this.currentLang) {

  }

  /*
    State control
   */
  usePreviousData() {

  }

  useNextData() {

  }

  /*
    Internal business logic
   */
  private applyFieldChange() {

  }

  private applyPositionChange() {

  }

  private saveFieldsAndTranslations() {

  }

  private savePosition() {

  }

  refresh() {

  }
}
