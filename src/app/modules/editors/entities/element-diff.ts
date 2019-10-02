import { MetaElement } from './meta-element';

interface ElementDiffFields {
  action: 'updateField' | 'updateTranslation' | 'updateLocation' | 'other';
  nextValue?: any;
  previousValue?: any;
  // metaElement: MetaElement;
}

export class ElementDiff implements ElementDiffFields {
  action: 'updateField' | 'updateTranslation' | 'updateLocation' | 'other';
  nextValue: any;
  previousValue: any;
  // metaElement: MetaElement;

  constructor(options: ElementDiffFields) {
    Object.assign(this, options);
  }

  applyNext() {

  }

  applyPrev() {

  }
}
