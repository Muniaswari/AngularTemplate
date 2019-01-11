import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AccessDenied } from './'; //AuthFail, BadInput, NotFoundError, ServerError,
import { AuthService } from '../guard/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private auth: AuthService;
    constructor(private router: Router, private injector: Injector) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const auth = this.injector.get(AuthService);
        return next.handle(req).catch((err: HttpErrorResponse) => {
            let appError;
            console.log('1. error comes in interceptor: ', err);
            if (err instanceof HttpErrorResponse) {
                switch (err.status) {
                    // case 401:
                    //     this.router.navigateByUrl('/login');
                    //     appError = new AuthFail(err.error);
                    //     break;
                    // case 400:
                    //     appError = new BadInput(err.error);
                    //     break;
                     case 403:
                         appError = new AccessDenied(err.error);
                         break;
                    // case 500:
                    //     appError = new ServerError(err.error);
                    //     break;
                    default:
                        appError = new Error(err.error);
                }
                return Observable.throw(appError);
            }
        });
    }
}