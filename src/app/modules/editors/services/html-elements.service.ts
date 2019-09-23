import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HtmlElementsService {
  constructor(
    private http: HttpClient
  ) {}
  getPageElements(pageId: string): Observable<any[]> {
    return this.http.get(environment.APIUrl + '/pages/1/elements').pipe(map((response: any) => {
      return response.payload;
    }));
  }
}
