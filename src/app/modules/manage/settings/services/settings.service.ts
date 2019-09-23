import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env';

@Injectable()
export class SettingsService {
  constructor(
    private http: HttpClient
  ) {
  }

  getSomething(): Observable<any> {
    return new BehaviorSubject({});
  }
}
