import { Injectable } from '@angular/core';
import { MetaElement } from '../entities/meta-element';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElementDataService } from './element-data.service';
import { HttpClient } from '@angular/common/http';
import { ElementData } from '../entities/element-data';

@Injectable()
export class MetaElementStore {

  constructor(
    private http: HttpClient,
    private elementDataService: ElementDataService
  ) {}

  getNewMetaElement(options?: ElementData|any): MetaElement {
    return new MetaElement(options);
  }

  getPageMetaElements(pageId: string): Observable<MetaElement[]> {
    return this.elementDataService.getPageElements(pageId).pipe(map(elements => {
      return elements.map(data => this.getNewMetaElement(data));
    }));
  }
}
