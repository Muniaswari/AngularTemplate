//https://stackoverflow.com/questions/49191337/how-to-handle-error-thrown-from-custom-global-error-handler-in-angular-4
//https://www.loggly.com/blog/angular-exception-logging-made-simple/
//https://www.codemag.com/article/1711021/Logging-in-Angular-Applications
///https://medium.com/@amcdnl/global-error-handling-with-angular2-6b992bdfb59c
import { NgModule, ErrorHandler, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, XHRBackend, RequestOptions, Http } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthService } from './shared/guard/auth.service';
import { AdminAuthService } from './shared/guard/adminauth.service';
import { CustomerService } from './shared/services/customer.service';
import { CommunicationService } from './shared/services/Communication.service';
import { FormDesignService } from './shared/services/formdesign.service';

import { FormValidation } from './shared/common/formValidation';
import { Constants } from './shared/constants';
import { ServerURLInterceptor } from './shared/guard/interceptor';
import { AuthorizationHeader } from './shared/common/authorizationHeader';
import { ErrorInterceptor } from './shared/errorhandling/error.interceptor';
import { AppErrorHandler } from './shared/errorhandling/global-error-handler';
import { CustomDateFormatPipe } from './shared/common/customDateFormatPipe';
import { HomeComponent } from './home/home.component';
import { UserPermissionsService } from './shared/services/userpermissions.service';

export function interceptorFactory(xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  serverURLInterceptor: ServerURLInterceptor) {
  const service = new InterceptorService(xhrBackend, requestOptions);
  service.addInterceptor(serverURLInterceptor);
  return service;
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  imports: [
    NgbModule.forRoot(),
    CommonModule, FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  exports: [TranslateModule],
  providers: [AuthService,
    CommunicationService,
    UserPermissionsService,
    AdminAuthService,
    FormDesignService,
    FormValidation,
    CustomDateFormatPipe,
    CustomerService,
    AuthorizationHeader,
    Constants,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    ServerURLInterceptor,
    {
      provide: InterceptorService,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions, ServerURLInterceptor]
    }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
