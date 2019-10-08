import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';

@Injectable()
export class SassService {
  constructor(
    private http: HttpClient
  ) {
  }

  convertToCss(scss: string, variables: { [key: string]: string | number } = {}): Promise<string> {
    return new Promise(((resolve, reject) => {
      this.http.put(`${environment.APIUrl}/sass-render`, {
        scss,
        variables
      }).subscribe(
        ({payload}: any) => resolve(payload),
        err => (console.error(err), reject(err.error.message)));
    }));
  }
}
