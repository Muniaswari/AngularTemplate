import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class UserService {

    constructor(private _http: Http, private contant: Constants,
        private authorizationHeader: AuthorizationHeader) { }

    get(): Observable<any> {
        const api: string = [this.contant.userapi, 'findall'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .catch(this.handleError);
    }

    findUsers(page: number = 1, usercategory) {
        console.log("hit",usercategory);
        const api = [this.contant.userapi, 'findPageWise', page, usercategory].join('/');
        console.log(api);
     return     this._http.get(api, this.authorizationHeader.getAuthHeader())
        .map(res => res)
        .catch(this.handleError);

  }

    getById(id: string): Observable<any> {
        const api: string = [this.contant.userapi, 'findById', id].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .catch(this.handleError);
    }

    save(model: any): Observable<any> {
        const body = JSON.stringify(model);
        return this._http.post(this.contant.masterapi + '/save', body,
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            //  .do(data => console.log("All: " + data))
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    update(id: any, model: any): Observable<any> {
        const api: string = [this.contant.masterapi, 'update', id].join('/');
        const body = JSON.stringify(model);
        return this._http.put(api, body, this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    delete(id: number): Observable<any> {
        const api: string = [this.contant.masterapi, 'delete', id].join('/');
        console.log(api);
        return this._http.delete(api, this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
