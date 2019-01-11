import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class UserPermissionsService {

    constructor(private _http: Http, private contant: Constants,
        private authorizationHeader: AuthorizationHeader) { }

     checkFormPermission(email): Observable<any> {
        const api: string = [this.contant.permissionapi, 'checkFormPermission',  email].join('/');
      return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
        .do(res => console.log(res))
          .catch(this.handleError);
     }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
