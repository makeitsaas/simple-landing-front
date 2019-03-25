import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

const API_BASE_URL = environment.APIUrl;

@Injectable()
export class SettingsService {
  constructor(
    private http: HttpClient
  ) {}

  getSomething(): Observable<any> {
    return this.http.get(API_BASE_URL + '/test/authentication');
  }
}
