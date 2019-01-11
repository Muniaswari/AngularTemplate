import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class RoleService {

    constructor(private _http: Http, private contant: Constants,
        private authorizationHeader: AuthorizationHeader) { }

    get(): Observable<any> {
        const api: string = [this.contant.roleapi, 'findall'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    FindallRoles(id): Observable<any> {
        const api: string = [this.contant.roleapi, 'FindallRoles', id].join('/');
        console.log(api);
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }
    
    getPage(page: number = 1,  searchField: string, searchValue: any) {
        const api = [this.contant.roleapi, 'findPageWise', page,  searchField, searchValue].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .do(res => console.log(res.json()))
            .catch(this.handleError);
    }

    findMaxId(): Observable<any> {
        const api: string = [this.contant.roleapi, 'findMaxId'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            // .do(res => console.log('All: ' + res))
            .catch(this.handleError);
    }

    save(model: any): Observable<any> {
        const body = JSON.stringify(model);
        return this._http.post(this.contant.roleapi + '/save', body,
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            //  .do(data => console.log("All: " + data))
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    update(id: any, model: any): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let api: string = [this.contant.roleapi, 'update', id].join('/');
        const body = JSON.stringify(model);
        return this._http.put(api, body, this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    delete(id: any, model: any): Observable<any> {
        const api: string = [this.contant.roleapi, 'delete', id].join('/');
        console.log(api);
        return this._http.put(api, JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
