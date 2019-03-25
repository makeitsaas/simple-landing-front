import { NgModule } from '@angular/core';
import { Error404PageComponent } from './templates/error-404-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ExampleInterceptor } from './interceptors/example.interceptor';
import { InvalidTokenInterceptor } from './interceptors/invalid-token.interceptor';


@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [
    Error404PageComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExampleInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InvalidTokenInterceptor,
      multi: true
    },
  ]
})
export class CoreModule {}
