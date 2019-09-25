import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetsInterface } from '../interfaces/assets.interface';

export interface IPageLayers {
  styles: AssetsInterface[];
  contentHtml: string;
  scripts: AssetsInterface[];
}

@Injectable()
export class HtmlElementsService {
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
}
