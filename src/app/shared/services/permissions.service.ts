import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class PermissionsService {

    constructor(private _http: Http, private contant: Constants,
        private authorizationHeader: AuthorizationHeader) { }

    findAllActiveUsers(roleId): Observable<any> {
        const api: string = [this.contant.permissionapi, 'findAllActiveUsers', roleId].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
        .map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    findAllActiveRoles(userId): Observable<any> {
        const api: string = [this.contant.permissionapi, 'findAllActiveRoles', userId].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
        .map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    findRoles(search, userId): Observable<any> {
        const api: string = [this.contant.permissionapi, 'findRoles', search, userId].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            //    .do(res => console.log(res))
            .catch(this.handleError);
    }
    
    findUsersByRoles( roleList): Observable<any> {
        const api: string = [this.contant.permissionapi, 'findUsersByRoles',  roleList].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            //    .do(res => console.log(res))
            .catch(this.handleError);
    }

    findUsersSearch(search, usercategory): Observable<any> {
        const api: string = [this.contant.permissionapi, 'findUsersSearch', search, usercategory].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            //    .do(res => console.log(res))
            .catch(this.handleError);
    }

    findRoleForForms(search): Observable<any> {
        const api: string = [this.contant.permissionapi, 'findRoleForForms', search].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            //    .do(res => console.log(res))
            .catch(this.handleError);
    }

    findAllActiveForms(roleId): Observable<any> {
        const api: string = [this.contant.permissionapi, 'findAllActiveForms', roleId].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    updateusermapping(id: any, model: any): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let api: string = [this.contant.permissionapi, 'saveusermapping', id].join('/');
        console.log(api);
        const body = JSON.stringify(model);
        return this._http.put(api, body, this.authorizationHeader.getAuthHeader())
         //   .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    updateformpermissions(id: any, model: any): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let api: string = [this.contant.permissionapi, 'saveformpermissions', id].join('/');
        console.log(api);
        const body = JSON.stringify(model);
        return this._http.put(api, body, this.authorizationHeader.getAuthHeader())
            .catch(this.handleError);
    }
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
