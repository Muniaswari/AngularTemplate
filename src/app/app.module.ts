//"repository": "https://github.com/Muniaswari/AngularTemplate",
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
import { HomeComponent } from './home/home.component';

import { AuthService } from './shared/guard/auth.service';
import { AdminAuthService } from './shared/guard/adminauth.service';
import { CustomerService } from './shared/services/customer.service';
import { CommunicationService } from './shared/services/Communication.service';
import { FormDesignService } from './shared/services/formdesign.service';
import { UserPermissionsService } from './shared/services/userpermissions.service';

import { AlphaNumericValid } from './shared/common/alphanumericValid';
import { FormValidation } from './shared/common/formValidation';

import { Constants } from './shared/constants';
import { ServerURLInterceptor } from './shared/guard/interceptor';
import { AuthorizationHeader } from './shared/common/authorizationHeader';
import { AppErrorHandler } from './shared/errorhandling/global-error-handler';


export function interceptorFactory(xhrBackend: XHRBackend,
  requestOptions: RequestOptions,
  serverURLInterceptor: ServerURLInterceptor) {
  const service = new InterceptorService(xhrBackend, requestOptions);
  service.addInterceptor(serverURLInterceptor);
  return service;
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
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
  declarations: [AlphaNumericValid, 
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
