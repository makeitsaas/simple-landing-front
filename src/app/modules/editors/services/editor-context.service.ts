import { Injectable } from '@angular/core';

@Injectable()
export class EditorContextService {

  getCurrentPageId(): string {
    return '1';
  }

  getCurrentLanguageCode(): string {
    return 'en';
  }
}
