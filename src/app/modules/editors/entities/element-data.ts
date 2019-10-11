export interface ElementDataInterface {
  id: string|number;
  type: string;
  settings: any;
  fields: any;
  translations: any;
  css: string;
  position: number;
  customTemplate?: any;
  parent?: ElementDataInterface;
}

export class ElementData implements ElementDataInterface {
  readonly id: string|number;
  readonly type: string;
  readonly settings: any = {};
  readonly fields: {readonly [key: string]: any} = {};
  readonly translations: any = {};
  readonly css: string = '';
  readonly position: number = 0;
  readonly customTemplate?: any;
  readonly parent?: ElementDataInterface;

  constructor(options: any = {}) {
    Object.assign(this, options);
  }

  asObject(): any {
    return Object.assign({}, this);
  }
}
