import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Constants } from '../constants';
import { AuthorizationHeader } from '../common/authorizationHeader'

@Injectable()
export class MasterService {

    constructor(private _http: Http, private contant: Constants,
        private authorizationHeader: AuthorizationHeader) { }

    findAll(): Observable<any> {
        const api: string = [this.contant.masterapi, 'findall'].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            .do(res => console.log(res))
            .catch(this.handleError);
    }

    checkDuplication(formName, id): Observable<any> {
        return this._http.get([this.contant.masterapi, 'checkDuplication', formName, id].join('/'),
            this.authorizationHeader.getAuthHeader())
            .map(res => res.json())
            .catch(this.handleError);
    }

    getPage(page: number = 1, category, searchField: string, searchValue: any) {
        console.log("hjt");
        const api = [this.contant.masterapi, 'findPageWise', page, category, searchField, searchValue].join('/');
        return this._http.get(api, this.authorizationHeader.getAuthHeader())
            .do(res => console.log(res.json()))
            .catch(this.handleError);
    }

    getById(id): Observable<any> {
        return this._http.get([this.contant.masterapi, 'findById', id].join('/'),
            this.authorizationHeader.getAuthHeader()).map(res => res.json())
            .catch(this.handleError);
    }

    save(model: any): Observable<any> {
        return this._http.post(this.contant.masterapi + '/save',
            JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    update(id: any, model: any): Observable<any> {
        return this._http.put([this.contant.masterapi, 'update', id].join('/'),
            JSON.stringify(model),
            this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    delete(id: any, model: any): Observable<any> {
        const api: string = [this.contant.masterapi, 'delete', id].join('/');
        console.log(api);
        return this._http.put(api, JSON.stringify(model), 
        this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    deletepermanently(id: number): Observable<any> {
        const api: string = [this.contant.masterapi, 'delete', id].join('/');
        console.log(api);
        return this._http.delete(api, this.authorizationHeader.getAuthHeader())
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    tableColumns(formName: string): Observable<any> {
        return this._http.get([this.contant.masterapi, 'tablecolumns', formName].join('/'),
            this.authorizationHeader.getAuthHeader())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
