export interface ElementDataInterface {
  id: string;
  type: string;
  settings: any;
  fields: any;
  translations: any;
  css: string;
  position: number;
  customTemplate?: any;
  parent?: ElementDataInterface;
}

export class ElementData {
  id: string;
  type: string;
  settings: any;
  fields: any;
  translations: any;
  css: string;
  position: number;
  customTemplate?: any;
  parent?: ElementDataInterface;

  constructor(options: any = {}) {
    Object.apply(this, options);
  }
}
