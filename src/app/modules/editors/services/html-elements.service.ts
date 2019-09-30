import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetsInterface } from '../interfaces/assets.interface';

const HTML_CALL_LIMIT = 10000;

export interface HtmlElementInterface {
  id: string;
  type: string;
  parent?: HtmlElementInterface;
}

export interface IPageLayers {
  styles: AssetsInterface[];
  contentHtml: string;
  scripts: AssetsInterface[];
}

@Injectable()
export class HtmlElementsService {

  private htmlCallCount = 0;

  constructor(
    private http: HttpClient
  ) {
  }

  getPageElements(pageId: string): Observable<any[]> {
    return this.http.get(environment.APIUrl + '/pages/1/elements').pipe(map((response: any) => {
      return response.payload;
    }));
  }

  getPageLayers(pageId: string): Observable<IPageLayers> {
    return this.http.get(environment.APIUrl + '/pages/1/layers').pipe(map((response: any) => {
      return response;
    }));
  }

  getPageStructure(pageId: string): Observable<any> {
    return this.getPageElements(pageId).pipe(map((elements: any[]) => {
      const pageElement = elements.filter(el => el.type === 'page')[0];
      const dragPageTree = this.populateAsDraggableChildren(pageElement, elements);

      return dragPageTree;
    }));
  }

  updateElement(htmlElementId: string | number, {fields, translations}: { fields?: any, translations?: any }): Observable<any> {
    const currentLanguage = 'en';
    const translationsByLang = {};

    if (translations) {
      translationsByLang[currentLanguage] = translations;
    }

    return this.http.put(environment.APIUrl + `/pages/1/elements/${htmlElementId}`, {fields, translations: translationsByLang})
      .pipe(map((response: any) => {
        return response;
      }));
  }

  getAcceptableChildrenTypes(parentType: string): string[] {
    switch (parentType) {
      case 'page':
        return ['section'];
      case 'section':
        return ['block', 'columns'];
      case 'columns':
        return ['column'];
      case 'column':
        return ['block', 'columns'];
      case 'block':
        return [];
      default:
        return [];
    }
  }

  private populateAsDraggableChildren(element: any, elements: any[]) {

    const dragItem: any = this.transformElementAsDraggable(element);
    dragItem.children = elements
      .filter(el => el.parent && el.parent.id === element.id)
      .map(child => this.populateAsDraggableChildren(child, elements));

    this.incHtmlCallCount();

    return dragItem;
  }

  private transformElementAsDraggable(element: any) {
    return {
      content: 'something',
      cssClasses: `element-${element.type}`,
      type: element.type,
      originalElement: element,
    };
  }

  private incHtmlCallCount() {
    this.htmlCallCount++;

    if (this.htmlCallCount > HTML_CALL_LIMIT) {
      throw new Error('too many html calls (probably a recursive error)');
    }
  };
}
