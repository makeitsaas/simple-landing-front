import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ExampleInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Field shall be authorized by API cors ("Access-Control-Allow-Headers")
    /*const modified = req.clone({
      setHeaders: {
        'Name': 'Value'
      }
    });*/
    return next.handle(req);
  }
}
