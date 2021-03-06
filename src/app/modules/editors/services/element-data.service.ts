import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetsInterface } from '../interfaces/assets.interface';
import { DnDItem } from './dnd-tree.service';
import { ElementData, ElementDataInterface } from '../entities/element-data';

export interface IPageLayers {
  styles: AssetsInterface[];
  contentHtml: string;
  scripts: AssetsInterface[];
}

export interface UpdateElementDto {
  fields?: any;
  translations?: {[lang: string]: any};
  parent?: string|number;
  position?: number;
}

@Injectable()
export class ElementDataService {

  constructor(
    private http: HttpClient
  ) {
  }

  getPageElements(pageId: string): Observable<ElementDataInterface[]> {
    return this.http.get(environment.APIUrl + `/pages/${pageId}/elements`).pipe(map((response: any) => {
      return response.payload;
    }));
  }

  getPageLayers(pageId: string): Observable<IPageLayers> {
    return this.http.get(environment.APIUrl + `/pages/${pageId}/layers`).pipe(map((response: any) => {
      return response;
    }));
  }

  getElement(dataElementId: string): Observable<ElementDataInterface> {
    return this.http.get(environment.APIUrl + `/elements/${dataElementId}`).pipe(map((elementData: ElementDataInterface) => {
      return elementData;
    }));
  }

  createElement(pageId: string, type: string, options: object = {}) {
    return this.http.post(environment.APIUrl + `/pages/${pageId}/elements`, {
      ...options,
      type
    }).pipe(map((response: any) => {
      return response;
    }));
  }

  updateElement(htmlElementId: string | number, dto: UpdateElementDto): Observable<any> {
    return this.http.put(environment.APIUrl + `/pages/1/elements/${htmlElementId}`, dto)
      .pipe(map((response: any) => {
        return response;
      }));
  }

  updateTree(pageId: string | number, topItem: DnDItem) {
    const relations = this.convertNestableToRelations(topItem);
    console.log('relations', relations);
    // todo : cas où c'est un nouveau parent
  }

  convertNestableToRelations(item: DnDItem): any[] {
    let relations = item.children.map((childItem, i) => {
      return {
        parentId: item.metaElement.data.id,
        position: i,
        htmlElementDataId: childItem.metaElement.data.id
      };
    });

    item.children.forEach(childItem => {
      relations = relations.concat(this.convertNestableToRelations(childItem));
    });

    return relations;
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

}
