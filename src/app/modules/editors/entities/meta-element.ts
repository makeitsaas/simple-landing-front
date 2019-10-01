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

class MetaElementData {
  readonly type: string;
}

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
  newPosition: number;
  newParent: MetaElement;
}

export class MetaElement {
  private currentLang = 'en';
  private locationChangeSubject = new BehaviorSubject<LocationChange>(null);
  private fieldChangeSubject = new BehaviorSubject(null);
  private translationChangeSubject = new BehaviorSubject(null);

  data: MetaElementData;
  onLocationChange: Observable<any> = this.locationChangeSubject.asObservable();
  onFieldChange: Observable<any> = this.fieldChangeSubject.asObservable();
  onTranslationChange: Observable<any> = this.translationChangeSubject.asObservable();

  constructor(data: ElementData | any = {}) {

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
